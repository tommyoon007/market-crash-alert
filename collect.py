#!/usr/bin/env python3
"""market-crash-alert 데이터 수집기 (data.json schema 2).

수집 대상
  - FRED 6종 (HY OAS, CCC OAS, VIX, NFCI, 10Y-2Y, Sahm Rule) + 10Y-3M
  - FRED 단기 유동성 3종 (SOFR, IORB, IOER) — SOFR-IORB 스프레드 재료
  - CBOE 공식 CSV (VIX, VIX3M) — FRED보다 하루 빠른 종가
  - Yahoo Finance chart (^VIX, ^VIX3M) — 당일 종가 보강
  - Yahoo Finance chart (^MOVE) — 채권 변동성 지수 20년 일간 종가
  - FRED 연준 순유동성 3종 (WALCL, WTREGEN, RRPONTSYD) — 13주 변화율 재료
  - 파생: HY OAS 20관측치 변화, CCC-HY 격차, VIX 기간구조(VIX3M/VIX),
    SOFR-IORB 스프레드(bp)와 그 5관측치 이동평균,
    연준 순유동성(WALCL − TGA − ON RRP) 13관측치 변화율

설계 원칙
  - 지표 값이 실제로 바뀌지 않으면 data.json을 쓰지 않는다 (updated_at만 바뀌는 커밋 방지).
  - 한 소스가 실패하면 그 시리즈만 기존 data.json 값을 유지한다.
  - 백분위 보정값(calibration)은 긴 이력으로 먼저 계산하고, 저장 이력은 5년으로 자른다.
"""

import bisect
import csv
import io
import json
import math
import os
import statistics
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone

SCHEMA = 2
HISTORY_KEEP_YEARS = 5
CALIBRATION_YEARS = 20
TIMEOUT = 60
RETRIES = 3
USER_AGENT = "market-crash-alert/2.0 (+https://github.com/tommyoon007/market-crash-alert)"
QUANTILE_POINTS = [0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95, 0.99]
MOMENTUM_STEPS = (5, 20)

# 이름, FRED ID, 그룹, 발표 주기(검증용 최대 지연일)
FRED_SERIES = [
    ("HY OAS", "BAMLH0A0HYM2", "credit", 6),
    ("CCC OAS", "BAMLH0A3HYC", "credit", 6),
    ("VIX", "VIXCLS", "market", 6),
    ("NFCI", "NFCI", "financial", 12),
    ("10Y - 2Y", "T10Y2Y", "recession", 6),
    ("Sahm Rule", "SAHMREALTIME", "recession", 75),
    ("10Y - 3M", "T10Y3M", "recession", 6),
]

# 단기 유동성 스프레드 재료: (FRED ID, 요구 최소 관측치)
# IORB는 2021-07-29부터, IOER는 2021-07-28까지 제공되므로 둘을 이어 붙인다.
LIQUIDITY_SERIES = [
    ("SOFR", 100),
    ("IORB", 100),
    ("IOER", 100),
]
LIQUIDITY_SPREAD_MA = 5

CBOE_CSV = {
    "VIX": "https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv",
    "VIX3M": "https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX3M_History.csv",
}

YAHOO_SYMBOLS = {
    "VIX": "%5EVIX",
    "VIX3M": "%5EVIX3M",
    "MOVE": "%5EMOVE",
}
# MOVE는 2002년부터 일간 이력이 있으므로 보정에 쓸 만큼 긴 구간을 받는다.
MOVE_RANGE = "25y"
MOVE_MIN_OBSERVATIONS = 2000

# 연준 순유동성 재료: FRED ID, 요구 최소 관측치(백만/십억 달러 단위가 섞여 있다).
# WALCL·WTREGEN은 백만 달러, RRPONTSYD는 십억 달러.
NET_LIQ_SERIES = [
    ("WALCL", 500),
    ("WTREGEN", 500),
    ("RRPONTSYD", 500),
]
NET_LIQ_STEP = 13
# WALCL 기준일(주간)에 붙일 TGA·ON RRP 값의 허용 간격(일).
# 둘 다 주간 지표라 너무 넓게 잡으면 같은 주 값을 두 번 세게 되므로 짧게 둔다.
NET_LIQ_GAP_DAYS = {"WTREGEN": 3, "RRPONTSYD": 4}


# --------------------------------------------------------------------------
# HTTP
# --------------------------------------------------------------------------

def http_get(url, headers=None, tries=RETRIES):
    last_error = None
    for attempt in range(tries):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": USER_AGENT, **(headers or {})},
            )
            with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001 - 소스별 실패를 모아서 처리한다
            last_error = error
            if attempt < tries - 1:
                time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"GET {url} 실패: {last_error}")


def to_float(raw):
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    if math.isnan(value) or math.isinf(value):
        return None
    return value


# --------------------------------------------------------------------------
# 소스별 수집: {date(ISO): value}
# --------------------------------------------------------------------------

def fetch_fred_api(series_id, api_key):
    params = urllib.parse.urlencode(
        {
            "series_id": series_id,
            "api_key": api_key,
            "file_type": "json",
            "sort_order": "asc",
        }
    )
    raw = http_get("https://api.stlouisfed.org/fred/series/observations?" + params)
    payload = json.loads(raw.decode("utf-8"))
    if not isinstance(payload, dict) or "observations" not in payload:
        raise RuntimeError(f"{series_id}: FRED 응답 형식 오류")
    series = {}
    for item in payload["observations"]:
        value = to_float(item.get("value"))
        if value is None:
            continue
        series[item["date"]] = value
    return series, "FRED API"


def fetch_fred(series_id, api_key):
    if api_key:
        try:
            return fetch_fred_api(series_id, api_key)
        except Exception as error:  # noqa: BLE001 - API 실패 시 공개 CSV로 대체
            print(f"[WARN] FRED API 실패({series_id}): {error} → fredgraph CSV로 재시도")

    raw = http_get(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}")
    text = raw.decode("utf-8-sig")
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    if len(rows) < 2:
        raise RuntimeError(f"{series_id}: fredgraph CSV 형식 오류")
    value_column = 1
    header = rows[0]
    for index, column in enumerate(header):
        if column.strip() == series_id:
            value_column = index
            break
    series = {}
    for row in rows[1:]:
        if len(row) <= value_column:
            continue
        day = row[0].strip()
        value = to_float(row[value_column].strip())
        if not day or value is None:
            continue
        series[day] = value
    return series, "FRED fredgraph CSV"


def fetch_cboe(name):
    raw = http_get(CBOE_CSV[name])
    text = raw.decode("utf-8-sig")
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)
    if not rows:
        raise RuntimeError(f"CBOE {name}: 빈 CSV")
    header = [cell.strip().upper() for cell in rows[0]]
    try:
        close_index = header.index("CLOSE")
    except ValueError:
        close_index = 4
    series = {}
    for row in rows[1:]:
        if len(row) <= close_index:
            continue
        try:
            day = datetime.strptime(row[0].strip(), "%m/%d/%Y").date().isoformat()
        except ValueError:
            continue
        value = to_float(row[close_index].strip())
        if value is None:
            continue
        series[day] = value
    return series, "CBOE CSV"


def fetch_yahoo(name, rng="3mo"):
    symbol = YAHOO_SYMBOLS[name]
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
        f"?range={rng}&interval=1d"
    )
    payload = json.loads(http_get(url).decode("utf-8"))
    result = (payload.get("chart") or {}).get("result") or []
    if not result:
        raise RuntimeError(f"Yahoo {name}: 결과 없음")
    block = result[0]
    timestamps = block.get("timestamp") or []
    quote = ((block.get("indicators") or {}).get("quote") or [{}])[0]
    closes = quote.get("close") or []
    series = {}
    for stamp, close in zip(timestamps, closes):
        value = to_float(close)
        if value is None:
            continue
        moment = datetime.fromtimestamp(int(stamp), tz=timezone.utc)
        if not session_closed(moment):
            continue
        series[moment.date().isoformat()] = value
    return series, f"Yahoo {symbol}"


def session_closed(moment):
    """그 날짜의 미국장이 끝난 뒤인가.

    Yahoo 일봉의 마지막 봉은 장중에 현재가로 계속 바뀝니다. 확정 종가가 아닌
    값을 종가처럼 저장하지 않도록, 같은 날짜 21:30 UTC(16:00 EST, 서머타임이면
    그보다 1시간 이르게 마감) 이후에만 그 봉을 인정합니다.
    """
    day = moment.date()
    close_time = datetime(day.year, day.month, day.day, 21, 30, tzinfo=timezone.utc)
    return datetime.now(timezone.utc) >= close_time


# --------------------------------------------------------------------------
# 보정 통계
# --------------------------------------------------------------------------

def quantile(sorted_values, probability):
    if not sorted_values:
        return None
    if len(sorted_values) == 1:
        return sorted_values[0]
    position = probability * (len(sorted_values) - 1)
    lower = int(math.floor(position))
    upper = min(lower + 1, len(sorted_values) - 1)
    weight = position - lower
    return sorted_values[lower] * (1 - weight) + sorted_values[upper] * weight


def build_calibration(series, label):
    """긴 이력(최대 20년)으로 백분위·변화량 통계를 만든다."""
    if not series:
        return None
    days = sorted(series)
    cutoff = None
    if len(days) > 1:
        last = date.fromisoformat(days[-1])
        cutoff = (last - timedelta(days=int(365.25 * CALIBRATION_YEARS))).isoformat()
    window = [day for day in days if cutoff is None or day >= cutoff]
    values = [series[day] for day in window]
    if len(values) < 30:
        return None
    ordered = sorted(values)
    quantiles = [
        [probability, round(quantile(ordered, probability), 4)]
        for probability in QUANTILE_POINTS
    ]
    changes = {}
    for step in MOMENTUM_STEPS:
        if len(window) <= step + 30:
            continue
        diffs = [
            series[window[index]] - series[window[index - step]]
            for index in range(step, len(window))
        ]
        changes[str(step)] = {
            "mean": round(statistics.fmean(diffs), 4),
            "std": round(statistics.pstdev(diffs), 4),
        }
    return {
        "window_start": window[0],
        "window_end": window[-1],
        "count": len(window),
        "min": round(ordered[0], 4),
        "max": round(ordered[-1], 4),
        "quantiles": quantiles,
        "change": changes,
        "note": None if len(window) >= 2500 else f"{label}: {len(window)}개 관측치로 보정",
    }


# --------------------------------------------------------------------------
# 파생 지표
# --------------------------------------------------------------------------

def derived_change(series, step):
    days = sorted(series)
    if len(days) <= step:
        return {}
    return {
        days[index]: series[days[index]] - series[days[index - step]]
        for index in range(step, len(days))
    }


def derived_spread(left, right):
    return {
        day: left[day] - right[day]
        for day in sorted(set(left) & set(right))
    }


def derived_ratio(top, bottom):
    result = {}
    for day in sorted(set(top) & set(bottom)):
        if bottom[day]:
            result[day] = top[day] / bottom[day]
    return result


def derived_spread_bp(left, right, scale=100):
    """두 금리(%)의 차이를 bp 단위로. 공통 거래일에만 만든다."""
    return {
        day: (left[day] - right[day]) * scale
        for day in sorted(set(left) & set(right))
    }


def value_on_or_before(days, series, day, max_gap_days):
    """day 당일 또는 그 이전 max_gap_days 이내의 최신 관측치 날짜를 찾는다."""
    index = bisect.bisect_right(days, day) - 1
    if index < 0:
        return None
    found = days[index]
    if (date.fromisoformat(day) - date.fromisoformat(found)).days > max_gap_days:
        return None
    return found


def derived_net_liquidity(walcl, tga, rrp):
    """연준 순유동성($B)과 그 13관측치 변화율(%)을 만든다.

    WALCL(백만 달러)·WTREGEN(백만 달러)은 1000으로 나눠 십억 달러로 맞추고,
    RRPONTSYD(십억 달러)를 그대로 뺀다. 주간 지표(WALCL) 날짜를 기준으로
    TGA는 3일, ON RRP는 4일 이내의 값을 붙인다.
    """
    tga_days = sorted(tga)
    rrp_days = sorted(rrp)
    levels = {}
    for day in sorted(walcl):
        tga_day = value_on_or_before(tga_days, tga, day, NET_LIQ_GAP_DAYS["WTREGEN"])
        rrp_day = value_on_or_before(rrp_days, rrp, day, NET_LIQ_GAP_DAYS["RRPONTSYD"])
        if not tga_day or not rrp_day:
            continue
        levels[day] = (walcl[day] - tga[tga_day]) / 1000.0 - rrp[rrp_day]

    days = sorted(levels)
    changes = {}
    for index in range(NET_LIQ_STEP, len(days)):
        base = levels[days[index - NET_LIQ_STEP]]
        # 기준값이 0에 가까우면 변화율이 폭주하므로 계산하지 않는다.
        if abs(base) < 1.0:
            continue
        changes[days[index]] = (levels[days[index]] - base) / abs(base) * 100.0
    return levels, changes


def derived_moving_average(series, window):
    """관측치 기준 최근 window개 이동평균. 달력일이 아니라 거래일 순서로 센다."""
    days = sorted(series)
    if len(days) < window:
        return {}
    return {
        days[index]: statistics.fmean(
            series[days[order]]
            for order in range(index - window + 1, index + 1)
        )
        for index in range(window - 1, len(days))
    }


# --------------------------------------------------------------------------
# 조립
# --------------------------------------------------------------------------

def load_existing(path):
    try:
        with open(path, encoding="utf-8") as handle:
            payload = json.load(handle)
    except (OSError, ValueError):
        return None
    if not isinstance(payload, dict) or not isinstance(payload.get("data"), dict):
        return None
    return payload


def existing_series(existing, series_id):
    if not existing:
        return {}
    block = existing.get("data", {}).get(series_id)
    if not isinstance(block, dict):
        return {}
    observations = block.get("observations") or []
    result = {}
    for item in observations:
        if isinstance(item, list) and len(item) == 2:
            day, value = item
        elif isinstance(item, dict):
            day, value = item.get("date"), item.get("value")
        else:
            continue
        number = to_float(value)
        if day and number is not None:
            result[day] = number
    return result


def trim(series, cutoff):
    return {day: value for day, value in series.items() if day >= cutoff}


def main():
    repo_root = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(repo_root, "data.json")
    existing = load_existing(data_path)
    api_key = (os.environ.get("FRED_API_KEY") or "").strip()

    collected = {}
    sources = {}
    warnings = []

    # 1) FRED
    for name, series_id, group, max_delay in FRED_SERIES:
        time.sleep(0.4)
        try:
            series, source = fetch_fred(series_id, api_key)
            if len(series) < 100:
                raise RuntimeError(f"{series_id}: 관측치 {len(series)}개로 너무 적음")
            collected[series_id] = series
            sources[series_id] = source
            print(f"[FRED] {name} ({series_id}): {len(series)}건, 최신 {max(series)}")
        except Exception as error:  # noqa: BLE001
            fallback = existing_series(existing, series_id)
            if fallback:
                collected[series_id] = fallback
                sources[series_id] = "기존 data.json 유지"
                warnings.append(f"{name} 신규 수집 실패({error}); 기존 값 유지")
                print(f"[WARN] {name} ({series_id}) 수집 실패 → 기존 값 유지: {error}")
            else:
                warnings.append(f"{name} 수집 실패({error}); 값 없음")
                print(f"[WARN] {name} ({series_id}) 수집 실패, 기존 값도 없음: {error}")

    # 1-2) 단기 유동성: SOFR / IORB(+IOER). 저장하지 않고 스프레드 재료로만 쓴다.
    liquidity = {}
    for fred_id, minimum in LIQUIDITY_SERIES:
        time.sleep(0.4)
        try:
            series, _ = fetch_fred(fred_id, api_key)
            if len(series) < minimum:
                raise RuntimeError(f"{fred_id}: 관측치 {len(series)}개로 너무 적음")
            liquidity[fred_id] = series
            print(f"[FRED] {fred_id}: {len(series)}건, 최신 {max(series)}")
        except Exception as error:  # noqa: BLE001
            warnings.append(f"{fred_id} 수집 실패({error})")
            print(f"[WARN] {fred_id} 수집 실패: {error}")

    # 1-3) 연준 순유동성 재료: WALCL / WTREGEN / RRPONTSYD.
    # 저장하지 않고 NET_LIQ_CHG13 계산 재료로만 쓴다.
    net_liq_inputs = {}
    for fred_id, minimum in NET_LIQ_SERIES:
        time.sleep(0.4)
        try:
            series, _ = fetch_fred(fred_id, api_key)
            if len(series) < minimum:
                raise RuntimeError(f"{fred_id}: 관측치 {len(series)}개로 너무 적음")
            net_liq_inputs[fred_id] = series
            print(f"[FRED] {fred_id}: {len(series)}건, 최신 {max(series)}")
        except Exception as error:  # noqa: BLE001
            warnings.append(f"{fred_id} 수집 실패({error})")
            print(f"[WARN] {fred_id} 수집 실패: {error}")

    # 2) VIX / VIX3M: FRED 이력 + CBOE 종가 + Yahoo 최신 종가
    for name, fred_id in (("VIX", "VIXCLS"),):
        base = dict(collected.get(fred_id, {}))
        layers = []
        try:
            cboe, _ = fetch_cboe(name)
            base.update(cboe)
            layers.append(f"CBOE {max(cboe)}")
            print(f"[CBOE] {name}: {len(cboe)}건, 최신 {max(cboe)}")
        except Exception as error:  # noqa: BLE001
            warnings.append(f"CBOE {name} CSV 실패({error}); FRED 값만 사용")
            print(f"[WARN] CBOE {name} 실패: {error}")
        try:
            yahoo, _ = fetch_yahoo(name)
            newest_known = max(base) if base else ""
            added = {day: value for day, value in yahoo.items() if day > newest_known}
            if added:
                base.update(added)
                layers.append(f"Yahoo {max(added)}")
            print(f"[Yahoo] {name}: {len(yahoo)}건, 추가 {len(added)}건")
        except Exception as error:  # noqa: BLE001
            warnings.append(f"Yahoo {name} 실패({error}); CBOE/FRED 값만 사용")
            print(f"[WARN] Yahoo {name} 실패: {error}")
        if base:
            collected[fred_id] = base
            sources[fred_id] = "FRED/CBOE/Yahoo" if layers else "FRED"

    vix3m = {}
    try:
        vix3m, _ = fetch_cboe("VIX3M")
        print(f"[CBOE] VIX3M: {len(vix3m)}건, 최신 {max(vix3m)}")
    except Exception as error:  # noqa: BLE001
        warnings.append(f"CBOE VIX3M CSV 실패({error})")
        print(f"[WARN] CBOE VIX3M 실패: {error}")
    try:
        yahoo3m, _ = fetch_yahoo("VIX3M")
        newest_known = max(vix3m) if vix3m else ""
        added = {day: value for day, value in yahoo3m.items() if day > newest_known}
        if added:
            vix3m.update(added)
        print(f"[Yahoo] VIX3M: {len(yahoo3m)}건, 추가 {len(added)}건")
    except Exception as error:  # noqa: BLE001
        warnings.append(f"Yahoo VIX3M 실패({error})")
        print(f"[WARN] Yahoo VIX3M 실패: {error}")

    # 2-2) MOVE: 미국 국채 옵션 기반 채권 변동성 지수 (Yahoo 장기 일간 종가)
    time.sleep(0.4)
    try:
        move, _ = fetch_yahoo("MOVE", rng=MOVE_RANGE)
        if len(move) < MOVE_MIN_OBSERVATIONS:
            raise RuntimeError(f"MOVE: 관측치 {len(move)}개로 너무 적음")
        collected["MOVE"] = move
        sources["MOVE"] = "Yahoo (^MOVE)"
        print(f"[Yahoo] MOVE: {len(move)}건, 최신 {max(move)}")
    except Exception as error:  # noqa: BLE001
        fallback = existing_series(existing, "MOVE")
        if fallback:
            collected["MOVE"] = fallback
            sources["MOVE"] = "기존 data.json 유지"
            warnings.append(f"MOVE 신규 수집 실패({error}); 기존 값 유지")
            print(f"[WARN] MOVE 수집 실패 → 기존 값 유지: {error}")
        else:
            warnings.append(f"MOVE 수집 실패({error}); 값 없음")
            print(f"[WARN] MOVE 수집 실패, 기존 값도 없음: {error}")

    # 3) 파생 지표
    hy = collected.get("BAMLH0A0HYM2", {})
    ccc = collected.get("BAMLH0A3HYC", {})
    vix = collected.get("VIXCLS", {})

    if hy:
        collected["HY_OAS_CHG20"] = derived_change(hy, 20)
        sources["HY_OAS_CHG20"] = "FRED 파생 (BAMLH0A0HYM2 20관측치 변화)"
    if hy and ccc:
        collected["CCC_HY_GAP"] = derived_spread(ccc, hy)
        sources["CCC_HY_GAP"] = "FRED 파생 (BAMLH0A3HYC - BAMLH0A0HYM2)"
    if vix and vix3m:
        collected["VIX_TERM"] = derived_ratio(vix3m, vix)
        sources["VIX_TERM"] = "CBOE/Yahoo 파생 (VIX3M / VIX)"

    # SOFR - IORB: 정책금리(IORB) 대비 익일물 자금조달 금리(SOFR)의 격차.
    # 양수로 벌어지면 자금시장에 유동성 수요가 몰린다는 뜻이다. 월말·분기말
    # 하루 이틀짜리 튐을 걸러내도록 5관측치 이동평균도 함께 만든다.
    sofr = liquidity.get("SOFR", {})
    policy_rate = dict(liquidity.get("IOER", {}))
    policy_rate.update(liquidity.get("IORB", {}))
    # IORB가 없으면 스프레드가 2021-07에서 끊겨 5년 구간이 비므로, 새로 계산하지 않고
    # 아래 3)에서 기존 data.json 값을 그대로 유지한다(지표가 사라지지 않게).
    if sofr and policy_rate and liquidity.get("IORB"):
        spread = derived_spread_bp(sofr, policy_rate)
        collected["SOFR_IORB"] = spread
        sources["SOFR_IORB"] = "FRED 파생 (SOFR - IORB, 2021-07-28 이전은 IOER)"
        collected["SOFR_IORB_MA5"] = derived_moving_average(spread, LIQUIDITY_SPREAD_MA)
        sources["SOFR_IORB_MA5"] = f"FRED 파생 (SOFR - IORB {LIQUIDITY_SPREAD_MA}관측치 평균)"

    # 연준 순유동성 13주 변화율. 세 소스가 모두 온전히 수집됐을 때만 새로 계산하고,
    # 하나라도 실패하거나 이력이 짧아지면 기존 data.json 값을 그대로 유지한다.
    net_liq_levels = {}
    net_liq_changes = {}
    if len(net_liq_inputs) == len(NET_LIQ_SERIES):
        try:
            net_liq_levels, net_liq_changes = derived_net_liquidity(
                net_liq_inputs["WALCL"],
                net_liq_inputs["WTREGEN"],
                net_liq_inputs["RRPONTSYD"],
            )
        except Exception as error:  # noqa: BLE001
            warnings.append(f"NET_LIQ_CHG13 계산 실패({error})")
            print(f"[WARN] NET_LIQ_CHG13 계산 실패: {error}")
    else:
        warnings.append("NET_LIQ_CHG13: 순유동성 소스 일부 실패 → 기존 값 유지")
        print("[WARN] 순유동성 소스 일부 실패 → NET_LIQ_CHG13은 기존 값 유지")

    if net_liq_changes:
        previous_changes = existing_series(existing, "NET_LIQ_CHG13")
        new_first = min(net_liq_changes)
        new_latest = max(net_liq_changes)
        old_first = min(previous_changes) if previous_changes else ""
        old_latest = max(previous_changes) if previous_changes else ""
        truncated = bool(previous_changes) and (
            new_latest < old_latest or (bool(old_first) and new_first > old_first)
        )
        if truncated:
            warnings.append(
                f"NET_LIQ_CHG13: 수집 구간이 기존보다 짧음({new_first}~{new_latest}) → 기존 값 유지"
            )
            print("[WARN] NET_LIQ_CHG13 구간이 잘려 기존 값을 유지합니다.")
        else:
            collected["NET_LIQ_CHG13"] = net_liq_changes
            sources["NET_LIQ_CHG13"] = "FRED 파생 (WALCL − WTREGEN − RRPONTSYD, 13관측치 변화율)"
            print(
                f"[파생] NET_LIQ_CHG13: {len(net_liq_changes)}건, 최신 {new_latest} "
                f"({net_liq_changes[new_latest]:.2f}%, 순유동성 ${net_liq_levels[new_latest]:.1f}B)"
            )

    for derived_id in ("HY_OAS_CHG20", "CCC_HY_GAP", "VIX_TERM", "SOFR_IORB", "SOFR_IORB_MA5", "NET_LIQ_CHG13"):
        series = collected.get(derived_id) or existing_series(existing, derived_id)
        if series:
            collected[derived_id] = series
            print(f"[파생] {derived_id}: {len(series)}건, 최신 {max(series)}")
        else:
            warnings.append(f"{derived_id} 계산 불가")

    collected = {key: value for key, value in collected.items() if value}
    if not collected:
        print("[FATAL] 수집된 시리즈가 없습니다. data.json을 변경하지 않습니다.")
        return 1

    # 4) 기준일·보정·절단
    latest_day = max(max(series) for series in collected.values())
    cutoff = (date.fromisoformat(latest_day) - timedelta(days=int(365.25 * HISTORY_KEEP_YEARS))).isoformat()

    payload_series = {}
    for series_id, series in collected.items():
        calibration = build_calibration(series, series_id)
        trimmed = trim(series, cutoff)
        if not trimmed:
            warnings.append(f"{series_id}: 5년 구간에 값 없음")
            continue
        observations = [[day, round(value, 4)] for day, value in sorted(trimmed.items(), reverse=True)]
        payload_series[series_id] = {
            "observations": observations,
            "calibration": calibration,
        }

    if not payload_series:
        print("[FATAL] 저장할 시리즈가 없습니다. data.json을 변경하지 않습니다.")
        return 1

    # 5) 값 변화 검사 — 실제 지표가 바뀌지 않았으면 쓰지 않는다
    changed = existing is None or existing.get("schema") != SCHEMA
    if not changed:
        previous = existing.get("data", {})
        if set(previous) != set(payload_series):
            changed = True
        else:
            for series_id, block in payload_series.items():
                old_block = previous.get(series_id) or {}
                if old_block.get("observations") != block["observations"]:
                    changed = True
                    break
                if old_block.get("calibration") != block["calibration"]:
                    changed = True
                    break

    # 6) 신선도 검증 — 실패시키지 않고 경고만 남긴다
    for name, series_id, group, max_delay in FRED_SERIES:
        series = collected.get(series_id) or {}
        if not series:
            continue
        age = (date.fromisoformat(latest_day) - date.fromisoformat(max(series))).days
        if age > max_delay:
            message = f"{name}: 최신 관측일이 {age}일 전 ({max(series)})"
            warnings.append(message)
            print(f"[WARN] {message}")
    sofr_series = liquidity.get("SOFR") or {}
    if sofr_series:
        age = (date.fromisoformat(latest_day) - date.fromisoformat(max(sofr_series))).days
        if age > 6:
            message = f"SOFR: 최신 관측일이 {age}일 전 ({max(sofr_series)})"
            warnings.append(message)
            print(f"[WARN] {message}")
    net_liq_series = collected.get("NET_LIQ_CHG13") or {}
    if net_liq_series:
        age = (date.fromisoformat(latest_day) - date.fromisoformat(max(net_liq_series))).days
        if age > 14:
            message = f"연준 순유동성 13주 변화: 최신 관측일이 {age}일 전 ({max(net_liq_series)})"
            warnings.append(message)
            print(f"[WARN] {message}")
    if all(
        not collected.get(series_id)
        or (date.fromisoformat(latest_day) - date.fromisoformat(max(collected[series_id]))).days > 10
        for _, series_id, _, _ in FRED_SERIES
    ):
        print("[FATAL] 모든 시리즈가 10일 넘게 지연되었습니다. data.json을 변경하지 않습니다.")
        return 1

    payload = {
        "schema": SCHEMA,
        # 값이 바뀌지 않았으면 기존 갱신 시각을 그대로 둔다(무의미한 diff 방지).
        "updated_at": (
            datetime.now(timezone.utc).replace(microsecond=0).isoformat()
            if changed or not existing or not existing.get("updated_at")
            else existing["updated_at"]
        ),
        "status": "ok" if not warnings else "degraded",
        "latest_observation": latest_day,
        "history_start": min(block["observations"][-1][0] for block in payload_series.values()),
        "warnings": warnings,
        "sources": sources,
        "data": payload_series,
    }

    serialized = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))

    if changed:
        with open(data_path, "w", encoding="utf-8") as handle:
            handle.write(serialized)
        size = os.path.getsize(data_path)
        print(f"[OK] data.json 갱신: {len(payload_series)}개 시리즈, 최신 관측일 {latest_day}, {size / 1024:.0f}KB")
    else:
        print("[INFO] 지표 값 변화 없음 → data.json을 쓰지 않습니다.")

    # 스냅숏: 마지막으로 완전하게 수집된 페이로드.
    # app.js는 data.json이 불완전할 때 이 파일로 빈 지표를 메운다.
    snapshot_path = os.path.join(repo_root, "data-snapshot.json")
    try:
        with open(snapshot_path, encoding="utf-8") as handle:
            snapshot_same = handle.read() == serialized
    except OSError:
        snapshot_same = False

    if not snapshot_same:
        with open(snapshot_path, "w", encoding="utf-8") as handle:
            handle.write(serialized)
        print(f"[OK] data-snapshot.json 갱신 ({len(payload_series)}개 시리즈)")

    if warnings:
        print("[OK] 경고:", "; ".join(warnings))
    return 0


if __name__ == "__main__":
    sys.exit(main())
