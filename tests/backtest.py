#!/usr/bin/env python3
"""market-crash-alert 위험지수 백테스트 (로컬 검증 도구).

app.js의 실제 계산 함수를 그대로 실행해(app.js 단일 기준) 과거 5년 위험지수
시계열을 만들고, S&P 500 5% 이상 하락 구간에서 고점·저점 점수를 비교한다.
개편 전 모델(지표 6종·절대 임계 구간만 사용)도 같은 데이터로 다시 계산해
전후를 나란히 보여 준다.

준비
    python3 -m pip install --target .local/lib quickjs
실행
    PYTHONPATH=.local/lib python3 tests/backtest.py --spx ../t/src/gspc.json
"""

import argparse
import json
import os
import statistics
import sys

import quickjs

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OLD_WEIGHTS = {
    "BAMLH0A0HYM2": 17.5,
    "BAMLH0A3HYC": 17.5,
    "VIXCLS": 20.0,
    "NFCI": 20.0,
    "T10Y2Y": 12.5,
    "SAHMREALTIME": 12.5,
}

OLD_MODEL_JS = """
function oldModelScore(offsetFor) {
    let weightSum = 0, total = 0;
    const oldWeights = %s;
    for (const [id, weight] of Object.entries(oldWeights)) {
        const indicator = INDICATORS.find(item => item.id === id);
        const observations = getObservations(id);
        const offset = offsetFor ? offsetFor(indicator) : 0;
        const observation = observations[offset];
        if (!observation) continue;
        const value = Number(observation.value);
        const band = getRiskBand(value, indicator);
        if (!band) continue;
        let score = band.score;
        if (id === "T10Y2Y") {
            const previous = observations[offset + 20];
            if (previous && Number(previous.value) < 0 && value - Number(previous.value) >= 0.5) {
                score = Math.min(5, score + 1);
            }
        }
        weightSum += weight;
        total += weight * (score / 5);
    }
    if (!weightSum) return null;
    return Math.round((total / weightSum) * 100);
}
""" % json.dumps(OLD_WEIGHTS)


def load_engine(data_path):
    source = open(os.path.join(REPO, "app.js"), encoding="utf-8").read()
    payload = open(data_path, encoding="utf-8").read()

    context = quickjs.Context()
    context.eval(
        "var window = {};"
        "var document = {addEventListener(){}, getElementById(){return null},"
        "querySelectorAll(){return []}};"
        "var localStorage = {getItem(){return null}, setItem(){}};"
    )
    context.eval(source)
    context.eval(OLD_MODEL_JS)
    context.set("DATAJSON", payload)
    context.eval("marketData = normalizeMarketData(JSON.parse(DATAJSON));")
    return context


def score_series(context):
    script = """
    (function () {
        const grid = getObservations("VIXCLS");
        const dates = grid.map(item => item.date);
        const offsets = {};
        for (const indicator of INDICATORS) {
            offsets[indicator.id] = computeAsOfOffsets(dates, getObservations(indicator.id));
        }
        const out = [];
        for (let index = dates.length - 1; index >= 0; index--) {
            const state = buildRiskState(indicator => offsets[indicator.id][index]);
            const oldState = oldModelScore(indicator => offsets[indicator.id][index]);
            out.push({
                date: dates[index],
                score: state.score,
                old: oldState,
                credit: state.groups.credit ? state.groups.credit.score : null,
                market: state.groups.market ? state.groups.market.score : null,
                financial: state.groups.financial ? state.groups.financial.score : null,
                recession: state.groups.recession ? state.groups.recession.score : null
            });
        }
        return JSON.stringify(out);
    })()
    """
    return json.loads(context.eval(script))


def current_state(context):
    script = """
    (function () {
        const details = calculateRiskDetails();
        return JSON.stringify({
            score: details.score,
            base: details.base,
            momentum: details.momentum,
            availableCount: details.availableCount,
            groups: Object.fromEntries(Object.entries(details.groups).map(([key, group]) => [key, group.score])),
            indicators: details.details.map(item => ({
                id: item.indicator.id,
                name: item.indicator.name,
                value: item.value,
                date: item.observation.date,
                band: item.band ? item.band.label : null,
                score: item.score,
                percentile: item.percentile,
                contribution: item.contribution,
                momentum: item.momentum
            }))
        });
    })()
    """
    return json.loads(context.eval(script))


def load_spx(path):
    payload = json.load(open(path, encoding="utf-8"))
    result = payload["chart"]["result"][0]
    import datetime

    days = [
        datetime.datetime.fromtimestamp(stamp, datetime.timezone.utc).date().isoformat()
        for stamp in result["timestamp"]
    ]
    closes = result["indicators"]["quote"][0]["close"]
    series = [(day, close) for day, close in zip(days, closes) if close is not None]
    return series


def drawdowns(series, threshold=0.05):
    """5% 이상 하락 구간(고점→저점)을 뽑는다."""
    episodes = []
    peak_day, peak_value = series[0]
    trough_day, trough_value = series[0]
    in_drawdown = False

    for day, value in series[1:]:
        if value >= peak_value:
            if in_drawdown:
                episodes.append((peak_day, peak_value, trough_day, trough_value))
                in_drawdown = False
            peak_day, peak_value = day, value
            trough_day, trough_value = day, value
            continue

        if value < trough_value:
            trough_day, trough_value = day, value

        if (peak_value - value) / peak_value >= threshold:
            in_drawdown = True

    if in_drawdown:
        episodes.append((peak_day, peak_value, trough_day, trough_value))

    return episodes


def describe(values):
    ordered = sorted(values)
    def pick(p):
        return ordered[min(len(ordered) - 1, int(round(p * (len(ordered) - 1))))]
    return {
        "min": ordered[0],
        "p25": pick(0.25),
        "p50": pick(0.50),
        "p75": pick(0.75),
        "p90": pick(0.90),
        "p99": pick(0.99),
        "max": ordered[-1],
        "mean": round(statistics.fmean(values), 1),
    }


def score_on(series, day, key):
    candidates = [item for item in series if item["date"] <= day]
    if not candidates:
        return None
    return candidates[-1][key]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default=os.path.join(REPO, "data.json"))
    parser.add_argument("--spx", default=os.path.join(REPO, "..", "t", "src", "gspc.json"))
    parser.add_argument("--json-out")
    args = parser.parse_args()

    context = load_engine(args.data)
    series = score_series(context)
    state = current_state(context)

    news = [item["score"] for item in series if item["score"] is not None]
    olds = [item["old"] for item in series if item["old"] is not None]

    print("== 위험지수 분포 (2021-11 ~) ==")
    print("신규:", describe(news))
    print("기존:", describe(olds))
    print("구간별 일수 — 신규: >=50 %d일, >=65 %d일, >=80 %d일" % (
        sum(1 for v in news if v >= 50), sum(1 for v in news if v >= 65), sum(1 for v in news if v >= 80)))
    print("구간별 일수 — 기존: >=50 %d일, >=65 %d일, >=80 %d일" % (
        sum(1 for v in olds if v >= 50), sum(1 for v in olds if v >= 65), sum(1 for v in olds if v >= 80)))

    print()
    print("== 현재 ==")
    print(json.dumps(state, ensure_ascii=False, indent=2))

    if os.path.exists(args.spx):
        print()
        print("== S&P 500 5% 이상 하락 구간 ==")
        print("| 고점 | 저점 | 하락률 | 기존 고점→저점 | 신규 고점→저점 | 신규 최대(구간) |")
        print("|---|---|---|---|---|---|")
        spx = load_spx(args.spx)
        for peak_day, peak_value, trough_day, trough_value in drawdowns(spx):
            old_peak = score_on(series, peak_day, "old")
            old_trough = score_on(series, trough_day, "old")
            new_peak = score_on(series, peak_day, "score")
            new_trough = score_on(series, trough_day, "score")
            inside = [
                item["score"] for item in series
                if item["score"] is not None and peak_day <= item["date"] <= trough_day
            ]
            print("| %s | %s | %.1f%% | %s → %s | %s → %s | %s |" % (
                peak_day, trough_day, (trough_value / peak_value - 1) * 100,
                old_peak, old_trough, new_peak, new_trough,
                max(inside) if inside else "-"))

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as handle:
            json.dump({"series": series, "current": state}, handle, ensure_ascii=False)
        print("\nsaved:", args.json_out)


if __name__ == "__main__":
    main()
