const INDICATORS = [
    {
        name: "HY OAS",
        id: "BAMLH0A0HYM2",
        description: "미국 하이일드 회사채 신용스프레드",
        unit: "%",
        decimals: 2,
        group: "credit",
        weight: 17.5,
        frequency: "일간",
        staleAfterDays: 7,
        sourceMeaning: "투자부적격 등급 회사채의 국채 대비 추가 금리입니다. 값이 오르면 시장이 기업 부도 위험에 더 높은 보상을 요구한다는 뜻입니다.",
        bands: [
            { min: 8, score: 5, status: "extreme", label: "극단 위험", range: "8.00% 이상", meaning: "신용시장이 심각한 스트레스를 반영하는 구간입니다." },
            { min: 6, score: 4, status: "danger", label: "고위험", range: "6.00% 이상 ~ 8.00% 미만", meaning: "기업 신용위험과 자금조달 부담이 크게 높아진 상태입니다." },
            { min: 5, score: 3, status: "warning", label: "경계", range: "5.00% 이상 ~ 6.00% 미만", meaning: "신용 여건이 뚜렷하게 악화되는지 주의 깊게 볼 구간입니다." },
            { min: 4, score: 2, status: "caution", label: "주의", range: "4.00% 이상 ~ 5.00% 미만", meaning: "평상시보다 신용위험 프리미엄이 높아진 구간입니다." },
            { min: 3, score: 1, status: "safe", label: "보통", range: "3.00% 이상 ~ 4.00% 미만", meaning: "상대적으로 보통 수준이지만 추세 악화 여부를 확인해야 합니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "3.00% 미만", meaning: "스프레드 수준만 보면 신용 스트레스가 낮은 구간입니다." }
        ]
    },
    {
        name: "CCC OAS",
        id: "BAMLH0A3HYC",
        description: "CCC급 이하 회사채 신용스프레드",
        unit: "%",
        decimals: 2,
        group: "credit",
        weight: 17.5,
        frequency: "일간",
        staleAfterDays: 7,
        sourceMeaning: "신용등급이 가장 낮은 CCC급 이하 회사채의 추가 금리입니다. HY OAS보다 취약기업의 자금조달 스트레스에 민감할 수 있습니다.",
        bands: [
            { min: 12, score: 5, status: "extreme", label: "극단 위험", range: "12.00% 이상", meaning: "취약기업의 신용시장 접근성이 크게 악화되었을 가능성이 있습니다." },
            { min: 10, score: 4, status: "danger", label: "고위험", range: "10.00% 이상 ~ 12.00% 미만", meaning: "CCC급 기업의 부도·차환 위험이 상당히 높아진 구간입니다." },
            { min: 8, score: 3, status: "warning", label: "경계", range: "8.00% 이상 ~ 10.00% 미만", meaning: "저신용 기업의 신용 스트레스가 뚜렷해지는 구간입니다." },
            { min: 6, score: 2, status: "caution", label: "주의", range: "6.00% 이상 ~ 8.00% 미만", meaning: "취약기업 신용 여건의 악화 여부를 확인해야 합니다." },
            { min: 5, score: 1, status: "safe", label: "보통", range: "5.00% 이상 ~ 6.00% 미만", meaning: "상대적으로 보통 수준이나 HY OAS와 함께 해석해야 합니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "5.00% 미만", meaning: "현재 스프레드 수준만 보면 취약기업 신용 스트레스가 낮은 편입니다." }
        ]
    },
    {
        name: "VIX",
        id: "VIXCLS",
        description: "S&P 500 옵션 기반 기대 변동성 지수",
        unit: "",
        decimals: 2,
        group: "market",
        weight: 20,
        frequency: "일간",
        staleAfterDays: 7,
        sourceMeaning: "S&P 500 옵션 가격에서 산출한 약 30일 기대 변동성 지표입니다. 주가 방향을 예측하는 지표는 아니며 급등은 시장 불안의 신호일 수 있습니다.",
        bands: [
            { min: 40, score: 5, status: "extreme", label: "극단 위험", range: "40 이상", meaning: "시장 공포와 헤지 수요가 매우 높은 구간입니다." },
            { min: 30, score: 4, status: "danger", label: "고위험", range: "30 이상 ~ 40 미만", meaning: "변동성이 크게 확대되어 급격한 가격 변동에 대비해야 합니다." },
            { min: 25, score: 3, status: "warning", label: "경계", range: "25 이상 ~ 30 미만", meaning: "시장 스트레스가 뚜렷하게 높아진 구간입니다." },
            { min: 20, score: 2, status: "caution", label: "주의", range: "20 이상 ~ 25 미만", meaning: "평상시보다 불안이 높아졌는지 다른 지표와 확인해야 합니다." },
            { min: 15, score: 1, status: "safe", label: "보통", range: "15 이상 ~ 20 미만", meaning: "일반적인 변동성 범위로 볼 수 있지만 낮은 VIX가 위험 부재를 보장하지는 않습니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "15 미만", meaning: "옵션시장의 기대 변동성이 낮은 구간입니다. 과도한 안도감도 별도 위험이 될 수 있습니다." }
        ]
    },
    {
        name: "NFCI",
        id: "NFCI",
        description: "미국 금융여건 지수",
        unit: "",
        decimals: 2,
        group: "financial",
        weight: 20,
        frequency: "주간",
        staleAfterDays: 18,
        sourceMeaning: "금리·신용·주식시장 등 여러 금융 변수를 종합한 지수입니다. 0은 장기 평균 수준, 양수는 평균보다 긴축적인 금융여건, 음수는 평균보다 완화적인 여건을 뜻합니다.",
        bands: [
            { min: 1, score: 5, status: "extreme", label: "극단 위험", range: "1.00 이상", meaning: "금융여건이 장기 평균보다 매우 긴축적인 구간입니다." },
            { min: 0.5, score: 4, status: "danger", label: "고위험", range: "0.50 이상 ~ 1.00 미만", meaning: "자금조달과 금융시장 여건이 상당히 긴축적인 구간입니다." },
            { min: 0.25, score: 3, status: "warning", label: "경계", range: "0.25 이상 ~ 0.50 미만", meaning: "금융여건 긴축이 뚜렷해지는지 확인해야 합니다." },
            { min: 0, score: 2, status: "caution", label: "주의", range: "0.00 이상 ~ 0.25 미만", meaning: "금융여건이 평균보다 덜 완화적이거나 긴축 쪽에 위치합니다." },
            { min: -0.5, score: 1, status: "safe", label: "완화적", range: "-0.50 이상 ~ 0.00 미만", meaning: "금융여건이 장기 평균보다 완화적인 구간입니다." },
            { min: null, score: 0, status: "verylow", label: "매우 완화적", range: "-0.50 미만", meaning: "금융여건이 평균보다 상당히 완화적입니다. 다른 위험이 없다는 의미는 아닙니다." }
        ]
    },
    {
        name: "10Y - 2Y",
        id: "T10Y2Y",
        description: "미국 10년물 - 2년물 국채금리 차이",
        unit: "%",
        decimals: 2,
        group: "recession",
        weight: 12.5,
        frequency: "일간",
        staleAfterDays: 7,
        inverse: true,
        sourceMeaning: "장기 국채금리에서 단기 국채금리를 뺀 값입니다. 역전은 경기침체 위험의 역사적 신호였지만, 단독으로 시점이나 침체를 확정할 수 없습니다. 역전 해소 과정도 함께 관찰해야 합니다.",
        bands: [
            { max: -1, score: 5, status: "extreme", label: "깊은 역전", range: "-1.00% 이하", meaning: "금리차가 크게 역전된 상태입니다. 침체 시점은 이 지표만으로 판단할 수 없습니다." },
            { max: -0.5, score: 4, status: "danger", label: "강한 역전", range: "-1.00% 초과 ~ -0.50% 이하", meaning: "수익률곡선 역전이 뚜렷한 구간입니다." },
            { max: 0, score: 3, status: "warning", label: "역전", range: "-0.50% 초과 ~ 0.00% 미만", meaning: "단기금리가 장기금리보다 높은 역전 구간입니다." },
            { max: 0.25, score: 2, status: "caution", label: "역전 해소·평탄", range: "0.00% 이상 ~ 0.25% 미만", meaning: "금리차가 양수로 돌아섰거나 0 부근입니다. 역전 해소가 항상 경기 개선을 뜻하지는 않습니다." },
            { max: 0.75, score: 1, status: "safe", label: "완만한 정상화", range: "0.25% 이상 ~ 0.75% 미만", meaning: "장단기 금리차가 양수인 구간입니다. 변화 속도와 경기 데이터를 함께 봐야 합니다." },
            { max: null, score: 0, status: "verylow", label: "양의 금리차", range: "0.75% 이상", meaning: "금리차가 비교적 큰 양수입니다. 이것만으로 경기 위험이 없다고 단정할 수 없습니다." }
        ]
    },
    {
        name: "Sahm Rule",
        id: "SAHMREALTIME",
        description: "실업률 상승 기반 경기침체 지표",
        unit: "%p",
        decimals: 2,
        group: "recession",
        weight: 12.5,
        frequency: "월간",
        staleAfterDays: 50,
        sourceMeaning: "실업률 3개월 평균이 직전 12개월 최저치보다 얼마나 높아졌는지 측정합니다. 0.50%포인트 이상은 공식 Sahm Rule 경기침체 신호 기준입니다.",
        bands: [
            { min: 0.5, score: 5, status: "extreme", label: "공식 신호 기준 도달", range: "0.50%p 이상", meaning: "Sahm Rule의 대표적인 경기침체 신호 기준에 도달했습니다. 공식 NBER 판정과 동일한 것은 아닙니다." },
            { min: 0.4, score: 4, status: "danger", label: "매우 근접", range: "0.40%p 이상 ~ 0.50%p 미만", meaning: "대표 기준에 근접했으므로 고용지표의 후속 발표를 면밀히 확인해야 합니다." },
            { min: 0.3, score: 3, status: "warning", label: "상승 경계", range: "0.30%p 이상 ~ 0.40%p 미만", meaning: "실업률 상승 신호가 뚜렷해지는 구간입니다." },
            { min: 0.2, score: 2, status: "caution", label: "주의", range: "0.20%p 이상 ~ 0.30%p 미만", meaning: "고용시장 둔화 여부를 다른 노동시장 지표와 함께 확인할 구간입니다." },
            { min: 0.1, score: 1, status: "safe", label: "초기 상승", range: "0.10%p 이상 ~ 0.20%p 미만", meaning: "상승 초기 신호일 수 있으나 단독 해석은 피해야 합니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "0.10%p 미만", meaning: "현재 값은 대표적인 0.50%p 기준보다 낮습니다. 음수 값도 가능하며 그 자체로 오류는 아닙니다." }
        ]
    }
];

const PERIODS = [
    { key: "1M", label: "1개월", days: 31 },
    { key: "3M", label: "3개월", days: 92 },
    { key: "6M", label: "6개월", days: 183 },
    { key: "1Y", label: "1년", days: 365 },
    { key: "3Y", label: "3년", days: 1095 },
    { key: "5Y", label: "5년", days: 1825 },
    { key: "ALL", label: "전체", days: Infinity }
];

let marketData = null;
let currentPage = "dashboard";
let selectedPeriods = {};

window.marketDataUpdatedAt = null;


/* =========================
   기본 함수
========================= */

function getIndicator(id) {
    return INDICATORS.find(item => item.id === id);
}


function getObservations(id) {

    if (
        !marketData ||
        !marketData.data ||
        !marketData.data[id]
    ) {
        return [];
    }

    return marketData.data[id].observations || [];
}


function formatValue(value, indicator) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "—";
    }

    return Number(value).toFixed(
        indicator.decimals
    ) + indicator.unit;
}


function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    return dateString.replaceAll("-", ".");
}


function getLatestObservation(id) {

    const observations =
        getObservations(id);

    if (!observations.length) {
        return null;
    }

    return observations[0];
}


/* =========================
   위험도
========================= */

function getRiskBand(value, indicator) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) {
        return null;
    }

    const numericValue = Number(value);

    if (indicator.inverse) {
        return indicator.bands.find(band =>
            band.max === null || numericValue <= band.max
        ) || indicator.bands[indicator.bands.length - 1];
    }

    return indicator.bands.find(band =>
        band.min === null || numericValue >= band.min
    ) || indicator.bands[indicator.bands.length - 1];
}


function getStatus(value, indicator) {
    const band = getRiskBand(value, indicator);
    return band ? band.status : "unknown";
}


function statusText(status) {
    const map = {
        verylow: "매우 낮음",
        safe: "낮음·보통",
        caution: "주의",
        warning: "경계",
        danger: "고위험",
        extreme: "극단 위험",
        unknown: "데이터 없음"
    };
    return map[status] || "데이터 없음";
}


function getIndicatorRiskScore(indicator, value) {
    const band = getRiskBand(value, indicator);
    if (!band) return null;

    let score = band.score;

    // 금리차는 수준만으로 경기침체 시점을 판단할 수 없다.
    // 역전 상태에서 최근 20개 관측치 동안 빠르게 양(+) 방향으로 움직이면
    // 역전 해소 가속 신호를 별도로 반영하되, 지표 점수는 최대 5점으로 제한한다.
    if (indicator.id === "T10Y2Y") {
        const observations = getObservations(indicator.id);
        if (observations.length > 20) {
            const latest = Number(observations[0].value);
            const previous = Number(observations[20].value);
            if (Number.isFinite(latest) && Number.isFinite(previous) &&
                previous < 0 && latest - previous >= 0.50) {
                score = Math.min(5, score + 1);
            }
        }
    }

    return score;
}


function getTrendMetrics(indicator) {
    const observations = getObservations(indicator.id);
    if (!observations.length) {
        return { direction: "자료 부족", delta: null, persistentCount: 0, latestScore: null, oldScore: null };
    }

    const latestValue = Number(observations[0].value);
    const latestBand = getRiskBand(latestValue, indicator);
    const latestScore = latestBand ? latestBand.score : null;
    const oldIndex = Math.min(5, observations.length - 1);
    const oldValue = Number(observations[oldIndex].value);
    const oldBand = getRiskBand(oldValue, indicator);
    const oldScore = oldBand ? oldBand.score : null;
    const delta = latestScore !== null && oldScore !== null ? latestScore - oldScore : null;

    let persistentCount = 0;
    for (const observation of observations) {
        const value = Number(observation.value);
        if (!Number.isFinite(value)) break;
        const band = getRiskBand(value, indicator);
        if (!band || band.score < 3) break;
        persistentCount++;
    }

    let direction = "대체로 보합";
    if (delta !== null && delta >= 2) direction = "위험 빠르게 악화";
    else if (delta === 1) direction = "위험 악화";
    else if (delta <= -2) direction = "위험 빠르게 완화";
    else if (delta === -1) direction = "위험 완화";

    return { direction, delta, persistentCount, latestScore, oldScore };
}


function getPersistenceLabel(indicator, count) {
    if (!count) return "최근 관측치에서 3/5 이상 위험 지속 없음";
    if (indicator.frequency === "일간") return `${count}개 관측일 연속`;
    if (indicator.frequency === "주간") return `${count}개 관측주 연속`;
    return `${count}개 관측월 연속`;
}


function calculateRiskDetails() {
    const available = INDICATORS.map(indicator => {
        const latest = getLatestObservation(indicator.id);
        if (!latest || !Number.isFinite(Number(latest.value))) return null;

        const score = getIndicatorRiskScore(indicator, latest.value);
        if (score === null) return null;

        return {
            indicator,
            latest,
            score,
            weightedPoints: (score / 5) * indicator.weight
        };
    }).filter(Boolean);

    if (!available.length) {
        return { score: null, availableCount: 0, groups: {}, details: [] };
    }

    const availableWeight = available.reduce((sum, item) => sum + item.indicator.weight, 0);
    const total = available.reduce((sum, item) => sum + item.weightedPoints, 0);
    const normalizedScore = availableWeight > 0 ? (total / availableWeight) * 100 : 0;

    const groupConfig = {
        credit: { label: "신용 위험", weight: 35 },
        market: { label: "시장 스트레스", weight: 20 },
        financial: { label: "금융여건", weight: 20 },
        recession: { label: "경기침체 신호", weight: 25 }
    };

    const groups = {};
    for (const [key, config] of Object.entries(groupConfig)) {
        const items = available.filter(item => item.indicator.group === key);
        if (!items.length) {
            groups[key] = { ...config, score: null, availableCount: 0 };
            continue;
        }
        const groupWeight = items.reduce((sum, item) => sum + item.indicator.weight, 0);
        const groupRaw = items.reduce((sum, item) => sum + item.weightedPoints, 0);
        groups[key] = {
            ...config,
            score: Math.round((groupRaw / groupWeight) * 100),
            availableCount: items.length
        };
    }

    return {
        score: Math.round(Math.max(0, Math.min(100, normalizedScore))),
        availableCount: available.length,
        groups,
        details: available
    };
}


function calculateRisk() {
    return calculateRiskDetails().score;
}


function overallStatus(score) {
    if (score === null || score === undefined) return "unknown";
    if (score >= 75) return "extreme";
    if (score >= 60) return "danger";
    if (score >= 45) return "warning";
    if (score >= 30) return "caution";
    if (score >= 15) return "safe";
    return "verylow";
}


function overallStatusText(status) {
    const map = {
        verylow: "매우 낮음",
        safe: "낮음",
        caution: "주의",
        warning: "경계",
        danger: "고위험",
        extreme: "극단 위험",
        unknown: "판단 보류"
    };
    return map[status] || "판단 보류";
}


function getObservationAgeDays(dateString) {
    if (!dateString) return null;
    const observed = new Date(`${dateString}T00:00:00Z`);
    if (Number.isNaN(observed.getTime())) return null;
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.max(0, Math.floor((todayUtc - observed.getTime()) / 86400000));
}


function getFreshness(indicator, dateString) {
    const age = getObservationAgeDays(dateString);
    if (age === null) return { age: null, status: "unknown", label: "날짜 확인 불가" };
    if (age > indicator.staleAfterDays) {
        return { age, status: "stale", label: `관측 후 ${age}일 · 지연 확인` };
    }
    return { age, status: "fresh", label: `관측 후 ${age}일` };
}


function formatGroupScore(score) {
    return score === null || score === undefined ? "—" : `${score}`;
}


/* =========================
   변화량
========================= */

function getChange(id, observationCount) {

    const observations =
        getObservations(id);

    if (
        observations.length <=
        observationCount
    ) {
        return null;
    }

    const latest =
        Number(observations[0].value);

    const previous =
        Number(
            observations[observationCount].value
        );

    if (
        Number.isNaN(latest) ||
        Number.isNaN(previous)
    ) {
        return null;
    }

    return latest - previous;
}


function getChangeClass(change) {

    if (change === null) {
        return "change-neutral";
    }

    if (change > 0) {
        return "change-up";
    }

    if (change < 0) {
        return "change-down";
    }

    return "change-neutral";
}


function formatChange(change, indicator) {

    if (change === null) {
        return "—";
    }

    const sign =
        change > 0 ? "+" : "";

    return sign +
        change.toFixed(
            indicator.decimals
        ) +
        indicator.unit;
}


/* =========================
   데이터 기간 필터
========================= */

function filterByPeriod(
    observations,
    periodKey
) {

    if (!observations.length) {
        return [];
    }

    const period =
        PERIODS.find(
            item =>
                item.key === periodKey
        );

    if (
        !period ||
        period.days === Infinity
    ) {
        return [
            ...observations
        ].reverse();
    }

    const latestDate =
        new Date(
            observations[0].date +
            "T00:00:00"
        );

    const startDate =
        new Date(latestDate);

    startDate.setDate(
        startDate.getDate() -
        period.days
    );

    const filtered =
        observations.filter(
            item => {

                const date =
                    new Date(
                        item.date +
                        "T00:00:00"
                    );

                return date >= startDate;
            }
        );

    return [
        ...filtered
    ].reverse();
}


/* =========================
   그래프 데이터 축소
========================= */

function downsample(
    data,
    maxPoints = 180
) {

    if (data.length <= maxPoints) {
        return data;
    }

    const result = [];

    const step =
        (data.length - 1) /
        (maxPoints - 1);

    for (
        let i = 0;
        i < maxPoints;
        i++
    ) {

        const index =
            Math.round(
                i * step
            );

        result.push(
            data[index]
        );
    }

    return result;
}


/* =========================
   그래프
========================= */

function createChart(
    observations,
    indicator,
    chartId
) {

    if (!observations.length) {

        return `
            <div class="chart-empty">
                데이터 없음
            </div>
        `;
    }

    const data =
        downsample(observations);

    const width = 700;
    const baseHeight = 300;

    const paddingLeft = 8;
    const paddingRight = 8;
    const paddingTop = 12;
    const paddingBottom = 12;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        baseHeight -
        paddingTop -
        paddingBottom;

    const values =
        data.map(
            item =>
                Number(item.value)
        );

    let min =
        Math.min(...values);

    let max =
        Math.max(...values);

    if (min === max) {
        min -= 1;
        max += 1;
    }

    const range =
        max - min;

    min -= range * 0.005;
    max += range * 0.005;


    function x(index) {

        if (data.length === 1) {
            return width / 2;
        }

        return (
            paddingLeft +
            index *
            chartWidth /
            (data.length - 1)
        );
    }


    function y(value) {

        return (
            paddingTop +
            (max - value) *
            chartHeight /
            (max - min)
        );
    }


    const points =
        data
            .map(
                (item, index) =>
                    `${x(index)},${y(
                        Number(item.value)
                    )}`
            )
            .join(" ");


    const last =
        data[data.length - 1];

    const lastX =
        x(data.length - 1);

    const lastY =
        y(
            Number(last.value)
        );


    return `
        <div
            class="chart-wrapper"
            data-chart-id="${chartId}"
        >

            <svg
                class="chart chart-touch-area"
                id="${chartId}"
                viewBox="0 0 ${width} ${baseHeight}"
                preserveAspectRatio="none"
                data-chart-height="${baseHeight}"
            >

                <g class="chart-content">

                    <line
                        x1="${paddingLeft}"
                        y1="${paddingTop}"
                        x2="${width - paddingRight}"
                        y2="${paddingTop}"
                        stroke="#263b59"
                        stroke-width="1"
                    />

                    <line
                        x1="${paddingLeft}"
                        y1="${baseHeight - paddingBottom}"
                        x2="${width - paddingRight}"
                        y2="${baseHeight - paddingBottom}"
                        stroke="#263b59"
                        stroke-width="1"
                    />

                    <polyline
                        points="${points}"
                        fill="none"
                        stroke="#45a9ff"
                        stroke-width="2.5"
                        vector-effect="non-scaling-stroke"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                    />

                    <circle
                        cx="${lastX}"
                        cy="${lastY}"
                        r="3.5"
                        fill="#ffffff"
                        stroke="#45a9ff"
                        stroke-width="2"
                    />

                    <text
                        x="${paddingLeft}"
                        y="${baseHeight - 4}"
                        fill="#7187a5"
                        font-size="8"
                        font-family="Arial, sans-serif"
                    >
                        ${formatDate(
                            data[0].date
                        )}
                    </text>

                    <text
                        x="${width - paddingRight}"
                        y="${baseHeight - 4}"
                        text-anchor="end"
                        fill="#7187a5"
                        font-size="8"
                        font-family="Arial, sans-serif"
                    >
                        ${formatDate(
                            data[data.length - 1].date
                        )}
                    </text>

                    <rect
                        class="chart-interaction-area"
                        x="0"
                        y="0"
                        width="${width}"
                        height="${baseHeight}"
                        fill="transparent"
                    />

                    <g
                        class="chart-touch-label-bg"
                        id="${chartId}-label"
                        visibility="hidden"
                    >

                        <rect
                            id="${chartId}-label-bg"
                            x="0"
                            y="0"
                            width="190"
                            height="40"
                            rx="7"
                            fill="#07101f"
                            fill-opacity="0.97"
                            stroke="#3a9aff"
                            stroke-width="1"
                        />

                        <text
                            class="chart-touch-date"
                            id="${chartId}-date"
                            x="95"
                            y="15"
                            text-anchor="middle"
                            fill="#dcecff"
                            font-family="Arial, sans-serif"
                            font-size="13"
                            font-weight="700"
                            textLength="135"
                            lengthAdjust="spacingAndGlyphs"
                        >
                            ${formatDate(
                                last.date
                            )}
                        </text>

                        <text
                            class="chart-touch-value"
                            id="${chartId}-value"
                            x="95"
                            y="33"
                            text-anchor="middle"
                            fill="#ffffff"
                            font-family="Arial, sans-serif"
                            font-size="16"
                            font-weight="800"
                            textLength="72"
                            lengthAdjust="spacingAndGlyphs"
                        >
                            ${formatValue(
                                last.value,
                                indicator
                            )}
                        </text>

                    </g>

                    <line
                        class="chart-touch-line"
                        id="${chartId}-line"
                        x1="${lastX}"
                        y1="${paddingTop}"
                        x2="${lastX}"
                        y2="${baseHeight - paddingBottom}"
                        stroke="#8ecbff"
                        stroke-width="1"
                        stroke-dasharray="4 4"
                        visibility="hidden"
                    />

                    <circle
                        class="chart-touch-point"
                        id="${chartId}-point"
                        cx="${lastX}"
                        cy="${lastY}"
                        r="6"
                        fill="#ffffff"
                        stroke="#45a9ff"
                        stroke-width="2.5"
                        visibility="hidden"
                    />

                </g>

            </svg>

        </div>
    `;
}


/* =========================
   그래프 터치
========================= */

function setupChartTouchEvents(
    chartId,
    data,
    indicator
) {

    const svg =
        document.getElementById(
            chartId
        );

    if (
        !svg ||
        !data.length
    ) {
        return;
    }

    const label =
        document.getElementById(
            `${chartId}-label`
        );

    const labelBg =
        document.getElementById(
            `${chartId}-label-bg`
        );

    const line =
        document.getElementById(
            `${chartId}-line`
        );

    const point =
        document.getElementById(
            `${chartId}-point`
        );

    const dateText =
        document.getElementById(
            `${chartId}-date`
        );

    const valueText =
        document.getElementById(
            `${chartId}-value`
        );

    const width = 700;
    const height = 300;

    const paddingLeft = 8;
    const paddingRight = 8;
    const paddingTop = 12;
    const paddingBottom = 12;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        height -
        paddingTop -
        paddingBottom;

    const values =
        data.map(
            item =>
                Number(item.value)
        );

    let min =
        Math.min(...values);

    let max =
        Math.max(...values);

    if (min === max) {
        min -= 1;
        max += 1;
    }

    const range =
        max - min;

    min -= range * 0.005;
    max += range * 0.005;


    function y(value) {

        return (
            paddingTop +
            (max - value) *
            chartHeight /
            (max - min)
        );
    }


    function getClientX(event) {

        if (
            event.touches &&
            event.touches.length
        ) {
            return event.touches[0].clientX;
        }

        if (
            event.changedTouches &&
            event.changedTouches.length
        ) {
            return event.changedTouches[0].clientX;
        }

        if (
            event.clientX !== undefined
        ) {
            return event.clientX;
        }

        return null;
    }


    function showTouch(clientX) {

        if (
            clientX === null ||
            clientX === undefined
        ) {
            return;
        }

        const rect =
            svg.getBoundingClientRect();

        if (
            !rect.width ||
            !rect.height
        ) {
            return;
        }

        let relativeX =
            clientX -
            rect.left;

        relativeX =
            Math.max(
                0,
                Math.min(
                    rect.width,
                    relativeX
                )
            );

        const svgX =
            relativeX /
            rect.width *
            width;

        let index;

        if (data.length === 1) {

            index = 0;

        } else {

            index =
                Math.round(
                    (svgX -
                        paddingLeft) /
                    chartWidth *
                    (data.length - 1)
                );

            index =
                Math.max(
                    0,
                    Math.min(
                        data.length - 1,
                        index
                    )
                );
        }

        const item =
            data[index];

        if (!item) {
            return;
        }

        const pointX =
            data.length === 1
                ? width / 2
                : paddingLeft +
                  index *
                  chartWidth /
                  (data.length - 1);

        const pointY =
            y(
                Number(
                    item.value
                )
            );


        const dateString =
            formatDate(
                item.date
            );

        const valueString =
            formatValue(
                item.value,
                indicator
            );


        dateText.textContent =
            dateString;

        valueText.textContent =
            valueString;

        dateText.setAttribute(
            "textLength",
            "135"
        );

        dateText.setAttribute(
            "lengthAdjust",
            "spacingAndGlyphs"
        );

        valueText.setAttribute(
            "textLength",
            "72"
        );

        valueText.setAttribute(
            "lengthAdjust",
            "spacingAndGlyphs"
        );


        line.setAttribute(
            "x1",
            pointX
        );

        line.setAttribute(
            "x2",
            pointX
        );

        line.setAttribute(
            "y1",
            paddingTop
        );

        line.setAttribute(
            "y2",
            height - paddingBottom
        );

        line.setAttribute(
            "visibility",
            "visible"
        );


        point.setAttribute(
            "cx",
            pointX
        );

        point.setAttribute(
            "cy",
            pointY
        );

        point.setAttribute(
            "visibility",
            "visible"
        );


        const labelWidth = 190;
        const labelHeight = 40;

        labelBg.setAttribute(
            "width",
            labelWidth
        );

        labelBg.setAttribute(
            "height",
            labelHeight
        );

        dateText.setAttribute(
            "x",
            labelWidth / 2
        );

        valueText.setAttribute(
            "x",
            labelWidth / 2
        );


        let labelX =
            pointX -
            labelWidth / 2;

        if (labelX < 4) {
            labelX = 4;
        }

        if (
            labelX +
                labelWidth >
            width - 4
        ) {
            labelX =
                width -
                labelWidth -
                4;
        }


        let labelY = 5;

        if (
            pointY <
            height * 0.30
        ) {

            labelY =
                height -
                labelHeight -
                5;
        }


        label.setAttribute(
            "transform",
            `translate(${labelX},${labelY})`
        );

        label.setAttribute(
            "visibility",
            "visible"
        );
    }


    svg.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            try {
                svg.setPointerCapture(
                    event.pointerId
                );
            } catch (error) {}

            showTouch(
                event.clientX
            );
        }
    );


    svg.addEventListener(
        "pointermove",
        event => {

            showTouch(
                event.clientX
            );
        }
    );


    svg.addEventListener(
        "pointerup",
        event => {

            try {

                if (
                    svg.hasPointerCapture(
                        event.pointerId
                    )
                ) {
                    svg.releasePointerCapture(
                        event.pointerId
                    );
                }

            } catch (error) {}
        }
    );


    svg.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            showTouch(
                getClientX(event)
            );
        },
        {
            passive: false
        }
    );


    svg.addEventListener(
        "touchmove",
        event => {

            event.preventDefault();

            showTouch(
                getClientX(event)
            );
        },
        {
            passive: false
        }
    );


    svg.addEventListener(
        "click",
        event => {

            showTouch(
                event.clientX
            );
        }
    );
}


/* =========================
   상단 메뉴
========================= */

function createTopMenu() {

    return `
        <div class="top-menu-row">

            <div class="top-menu">

                <button
                    class="top-menu-button ${
                        currentPage === "dashboard"
                            ? "active"
                            : ""
                    }"
                    data-page="dashboard"
                >
                    대시보드
                </button>

                <button
                    class="top-menu-button ${
                        currentPage === "risk"
                            ? "active"
                            : ""
                    }"
                    data-page="risk"
                >
                    위험도
                </button>

                <button
                    class="top-menu-button ${
                        currentPage === "trend"
                            ? "active"
                            : ""
                    }"
                    data-page="trend"
                >
                    추세
                </button>

            </div>

        </div>
    `;
}


function formatUpdateTime() {

    if (
        !window.marketDataUpdatedAt
    ) {
        return "—";
    }

    const date =
        new Date(
            window.marketDataUpdatedAt
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleString(
        "ko-KR",
        {
            timeZone: "Asia/Seoul",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
    );
}


function setupTopMenu() {

    document
        .querySelectorAll(
            ".top-menu-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentPage =
                            button.dataset.page;

                        render();
                    }
                );
            }
        );
}


/* =========================
   위험도 점수
========================= */

function createRiskScoreHTML() {
    const details = calculateRiskDetails();
    const score = details.score;
    const percentage = score === null ? 0 : score;
    const status = overallStatus(score);

    return `
        <div class="overall-right">
            <div class="risk-score-box">
                <div class="risk-score-label">위험지수</div>
                <div class="risk-score-number">
                    ${score === null ? "—" : score}
                    <span>/ 100</span>
                </div>
                <div class="risk-score-bar">
                    <div class="risk-score-fill ${status}" style="width:${percentage}%"></div>
                </div>
                <div class="risk-score-foot">
                    ${details.availableCount}/6개 지표 사용
                </div>
            </div>
            <div class="top-update">데이터 갱신 ${formatUpdateTime()}</div>
        </div>
    `;
}


function createGroupSummaryHTML() {
    const details = calculateRiskDetails();
    if (!details.groups || !Object.keys(details.groups).length) return "";

    const ordered = [
        ["credit", "신용"],
        ["market", "시장"],
        ["financial", "금융여건"],
        ["recession", "경기침체"]
    ];

    return `
        <div class="group-summary">
            ${ordered.map(([key, label]) => {
                const group = details.groups[key];
                const status = overallStatus(group.score);
                return `
                    <div class="group-score ${status}">
                        <span>${label}</span>
                        <strong>${formatGroupScore(group.score)}<small>/100</small></strong>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}


/* =========================
   전체 위험도
========================= */

function createOverallHTML() {
    const score = calculateRisk();
    const status = overallStatus(score);

    return `
        <section class="overall ${status}">
            <div class="overall-top">
                <div class="overall-left">
                    <div class="overall-label">미국 증시 폭락 위험</div>
                    <div class="overall-value">${overallStatusText(status)}</div>
                    ${createTopMenu()}
                </div>
                ${createRiskScoreHTML()}
            </div>
            ${createGroupSummaryHTML()}
        </section>
    `;
}


/* =========================
   대시보드 카드
========================= */

function createCard(
    indicator,
    periodKey
) {

    const latest =
        getLatestObservation(
            indicator.id
        );

    if (!latest) {

        return `
            <div class="card">

                <div class="card-title">
                    ${indicator.name}
                </div>

                <div class="chart-empty">
                    데이터 없음
                </div>

            </div>
        `;
    }

    const status =
        getStatus(
            latest.value,
            indicator
        );

    const change5 =
        getChange(
            indicator.id,
            5
        );

    const change20 =
        getChange(
            indicator.id,
            20
        );

    const observations =
        filterByPeriod(
            getObservations(
                indicator.id
            ),
            periodKey
        );

    const chartId =
        `chart-${indicator.id.replace(
            /[^a-zA-Z0-9]/g,
            ""
        )}`;

    const chart =
        createChart(
            observations,
            indicator,
            chartId
        );

    return `
        <article class="card">

            <div class="card-main">

                <div class="card-info">

                    <div class="card-header">

                        <div>

                            <div class="card-title">
                                ${indicator.name}
                            </div>

                            <div class="ticker">
                                FRED · ${indicator.id}
                            </div>

                        </div>

                        <div
                            class="status ${status}"
                        >
                            ${statusText(
                                status
                            )}
                        </div>

                    </div>

                    <div class="description">
                        ${indicator.description}
                    </div>

                    <div class="value">
                        ${formatValue(
                            latest.value,
                            indicator
                        )}
                    </div>

                    <div class="changes">

                        <div class="change-box">

                            <div class="change-label">
                                최근 5개 관측치
                            </div>

                            <div
                                class="${getChangeClass(
                                    change5
                                )}"
                            >
                                ${
                                    change5 !== null &&
                                    change5 > 0
                                        ? "▲ "
                                        : change5 !== null &&
                                          change5 < 0
                                        ? "▼ "
                                        : ""
                                }

                                ${formatChange(
                                    change5,
                                    indicator
                                )}
                            </div>

                        </div>

                        <div class="change-box">

                            <div class="change-label">
                                최근 20개 관측치
                            </div>

                            <div
                                class="${getChangeClass(
                                    change20
                                )}"
                            >
                                ${
                                    change20 !== null &&
                                    change20 > 0
                                        ? "▲ "
                                        : change20 !== null &&
                                          change20 < 0
                                        ? "▼ "
                                        : ""
                                }

                                ${formatChange(
                                    change20,
                                    indicator
                                )}
                            </div>

                        </div>

                    </div>

                </div>

                <div class="card-chart">
                    ${chart}
                </div>

            </div>

            <div class="card-bottom">

                <div class="period-buttons">

                    ${PERIODS.map(
                        period => `
                            <button
                                class="period-button ${
                                    period.key ===
                                    periodKey
                                        ? "active"
                                        : ""
                                }"
                                data-indicator="${indicator.id}"
                                data-period="${period.key}"
                            >
                                ${period.label}
                            </button>
                        `
                    ).join("")}

                </div>

                <div class="date">
                    최근 데이터:
                    ${formatDate(
                        latest.date
                    )}
                </div>

            </div>

        </article>
    `;
}



/* =========================
   전체 위험지수 기록 (설치 이후 누적)
========================= */
const RISK_HISTORY_KEY = "marketCrashRiskHistoryV1";

function loadRiskHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem(RISK_HISTORY_KEY) || "[]");
        return Array.isArray(parsed) ? parsed.filter(item => item && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(Number(item.score))) : [];
    } catch (_) {
        return [];
    }
}

function recordRiskHistory(score) {
    if (!Number.isFinite(Number(score))) return loadRiskHistory();
    const history = loadRiskHistory();
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    const entry = { date, score: Math.round(Number(score)), updatedAt: now.toISOString() };
    const index = history.findIndex(item => item.date === date);
    if (index >= 0) history[index] = entry;
    else history.push(entry);
    history.sort((a,b) => a.date.localeCompare(b.date));
    const trimmed = history.slice(-400);
    try { localStorage.setItem(RISK_HISTORY_KEY, JSON.stringify(trimmed)); } catch (_) {}
    return trimmed;
}

function getHistoryChange(history, days) {
    if (!history.length) return null;
    const latest = history[history.length - 1];
    const target = new Date(`${latest.date}T12:00:00`);
    target.setDate(target.getDate() - days);
    const targetString = `${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,"0")}-${String(target.getDate()).padStart(2,"0")}`;
    const previous = [...history].reverse().find(item => item.date <= targetString);
    if (!previous || previous.date === latest.date) return null;
    const elapsed = (new Date(`${latest.date}T12:00:00`) - new Date(`${previous.date}T12:00:00`)) / 86400000;
    if (elapsed < Math.max(1, days - 2)) return null;
    return { delta: Number(latest.score) - Number(previous.score), fromDate: previous.date, toDate: latest.date };
}

function formatRiskDelta(change) {
    if (!change) return "기록 축적 중";
    const sign = change.delta > 0 ? "+" : "";
    const label = change.delta > 0 ? "위험 상승" : change.delta < 0 ? "위험 하락" : "변화 없음";
    return `${sign}${change.delta}점 · ${label}`;
}

function renderRiskHistoryHTML(score) {
    const history = recordRiskHistory(score);
    const last = history[history.length - 1];
    const c7 = getHistoryChange(history, 7);
    const c30 = getHistoryChange(history, 30);
    let sparkline = "";
    if (history.length >= 2) {
        const points = history.slice(-30);
        const vals = points.map(p => Number(p.score));
        const min = Math.min(...vals), max = Math.max(...vals);
        const range = Math.max(1, max - min);
        const coords = vals.map((v,i) => `${8 + i * (284 / Math.max(1, vals.length-1))},${48 - ((v-min)/range)*38}`).join(" ");
        sparkline = `<svg class="risk-history-chart" viewBox="0 0 300 56" role="img" aria-label="최근 위험지수 기록 그래프"><polyline points="${coords}" fill="none" stroke="#f0c75e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="49" x2="292" y2="49" stroke="#31435e" stroke-width="1"/></svg>`;
    }
    return `
        <section class="risk-history-card">
            <div class="risk-history-title">전체 위험지수 추적</div>
            <div class="risk-history-scoreline"><strong>${score === null ? "—" : score}</strong><span>/100</span><small>${last ? `기록 ${last.date}` : "기록 대기"}</small></div>
            ${sparkline || `<p class="risk-history-note">기록을 축적하는 중입니다. 첫 기록 이후 추세 그래프가 나타납니다.</p>`}
            <div class="risk-history-grid">
                <div><span>최근 7일 변화</span><strong>${formatRiskDelta(c7)}</strong></div>
                <div><span>최근 30일 변화</span><strong>${formatRiskDelta(c30)}</strong></div>
            </div>
            <p class="risk-history-note">이 기록은 이 기기의 브라우저에 저장되며 기능 설치 이후부터 쌓입니다. 과거 점수를 소급 생성하지 않으며, 앱 데이터 삭제·기기 변경 시 기록이 사라질 수 있습니다. 변화는 폭락 확률이나 매매 신호가 아닙니다.</p>
        </section>
    `;
}


/* =========================
   대시보드
========================= */

function renderDashboard() {

    const cards =
        INDICATORS.map(
            indicator => {

                if (
                    !selectedPeriods[
                        indicator.id
                    ]
                ) {
                    selectedPeriods[
                        indicator.id
                    ] = "1Y";
                }

                return createCard(
                    indicator,
                    selectedPeriods[
                        indicator.id
                    ]
                );
            }
        ).join("");

    const overallScore = calculateRisk();
    const historyPanel = renderRiskHistoryHTML(overallScore);

    return `
        <div class="dashboard">

            ${historyPanel}

            ${cards}

            <div class="source">
                Source: Federal Reserve Bank of St. Louis · FRED
            </div>

        </div>
    `;
}


/* =========================
   위험도 상세
========================= */

function createTrendSummaryHTML() {
    const metrics = INDICATORS.map(indicator => {
        const latest = getLatestObservation(indicator.id);
        if (!latest) return null;
        return { indicator, ...getTrendMetrics(indicator) };
    }).filter(Boolean);

    const worsening = metrics.filter(item => item.delta !== null && item.delta >= 1);
    const fastWorsening = metrics.filter(item => item.delta !== null && item.delta >= 2);
    const persistent = metrics.filter(item => item.persistentCount >= 3);
    const headline = fastWorsening.length
        ? `${fastWorsening.length}개 지표에서 위험등급이 빠르게 악화`
        : worsening.length
            ? `${worsening.length}개 지표에서 위험등급 악화`
            : "위험등급의 뚜렷한 상승 신호 없음";

    return `
        <section class="trend-summary">
            <div class="trend-summary-title">위험 가속도 · 지속성</div>
            <div class="trend-summary-headline">${headline}</div>
            <div class="trend-summary-grid">
                <div><span>최근 5개 관측치 기준 악화</span><strong>${worsening.length}/6개</strong></div>
                <div><span>위험등급 3/5 이상 3회 연속</span><strong>${persistent.length}/6개</strong></div>
            </div>
            <p>변화는 최신 점수와 5개 관측치 전 점수의 차이로 계산합니다. 지속성은 각 지표의 발표 주기를 기준으로 연속 관측치를 셉니다. 이는 보조 신호이며 폭락 확률이나 매매 신호가 아닙니다.</p>
        </section>
    `;
}


function renderRiskPanel() {
    const details = calculateRiskDetails();
    const historyPanel = renderRiskHistoryHTML(details.score);

    const rows = INDICATORS.map(indicator => {
        const latest = getLatestObservation(indicator.id);
        if (!latest) {
            return `
                <article class="risk-row">
                    <div class="risk-name">${indicator.name}</div>
                    <div class="risk-description">데이터를 사용할 수 없습니다.</div>
                </article>
            `;
        }

        const band = getRiskBand(latest.value, indicator);
        const score = getIndicatorRiskScore(indicator, latest.value);
        const freshness = getFreshness(indicator, latest.date);
        const trendMetrics = getTrendMetrics(indicator);
        const change5 = getChange(indicator.id, 5);
        const change20 = getChange(indicator.id, 20);
        const detailId = `range-${indicator.id.replace(/[^a-zA-Z0-9]/g, "")}`;

        const rangeRows = indicator.bands.map(item => {
            const current = band === item;
            return `
                <div class="band-row ${current ? "current" : ""}">
                    <div class="band-row-main">
                        <span class="band-label">${item.label}</span>
                        <span class="band-range">${item.range}</span>
                    </div>
                    <p>${item.meaning}</p>
                    ${current ? `<div class="band-current">현재 위치 · ${formatValue(latest.value, indicator)}</div>` : ""}
                </div>
            `;
        }).join("");

        const trendLabel = indicator.id === "T10Y2Y"
            ? (change20 !== null && change20 >= 0.50 ? "역전 해소 가속 주의" : "수준과 변화 속도를 함께 확인")
            : (change20 !== null && change20 > 0 ? "최근 20개 관측치 상승" :
               change20 !== null && change20 < 0 ? "최근 20개 관측치 하락" : "변화 판단 자료 제한");

        return `
            <article class="risk-row">
                <div class="risk-row-top">
                    <div class="risk-heading">
                        <div class="risk-name">${indicator.name}</div>
                        <div class="risk-description">${indicator.description}</div>
                        <div class="risk-ticker">FRED · ${indicator.id} · ${indicator.frequency}</div>
                    </div>
                    <div class="risk-status-stack">
                        <div class="status ${band ? band.status : "unknown"}">${band ? band.label : "데이터 없음"}</div>
                        <div class="indicator-score">${score === null ? "—" : `${score}/5`}</div>
                    </div>
                </div>

                <div class="risk-current-line">
                    <div class="risk-current-value">${formatValue(latest.value, indicator)}</div>
                    <div class="risk-current-date">관측일 ${formatDate(latest.date)}</div>
                </div>

                <div class="risk-metrics">
                    <div class="risk-metric">
                        <span>최근 5개 관측치 변화</span>
                        <strong>${formatChange(change5, indicator)}</strong>
                    </div>
                    <div class="risk-metric">
                        <span>최근 20개 관측치 변화</span>
                        <strong>${formatChange(change20, indicator)}</strong>
                    </div>
                </div>
                <div class="risk-trend-note">${trendLabel}</div>
                <div class="trend-persistence">
                    <div><span>위험 변화</span><strong class="trend-direction ${trendMetrics.delta !== null && trendMetrics.delta > 0 ? "worsening" : trendMetrics.delta !== null && trendMetrics.delta < 0 ? "improving" : "stable"}">${trendMetrics.direction}</strong></div>
                    <div><span>위험 지속성</span><strong>${getPersistenceLabel(indicator, trendMetrics.persistentCount)}</strong></div>
                </div>

                <div class="freshness ${freshness.status}">
                    데이터 상태: ${freshness.label} · ${indicator.frequency} 지표
                </div>

                <button
                    class="range-toggle"
                    type="button"
                    data-target="${detailId}"
                    aria-expanded="false"
                >구간 설명 보기 <span aria-hidden="true">＋</span></button>

                <div class="range-panel" id="${detailId}" hidden>
                    <div class="range-intro">${indicator.sourceMeaning}</div>
                    <div class="range-current-summary">
                        현재 점수 <strong>${score === null ? "—" : `${score}/5`}</strong>
                        · 현재 구간 <strong>${band ? band.label : "판단 불가"}</strong>
                    </div>
                    <div class="band-list">${rangeRows}</div>
                    <div class="range-caveat">
                        구간은 조기경보용 휴리스틱 기준이며 공식 경기침체 판정이나 매매 신호가 아닙니다.
                        지표의 발표 주기와 수정 가능성을 고려해 다른 지표와 함께 해석하세요.
                    </div>
                </div>
            </article>
        `;
    }).join("");

    return `
        <div class="risk-panel">
            ${historyPanel}
            <div class="risk-panel-intro">
                <div class="panel-title">위험도 상세 분석</div>
                <div class="panel-subtitle">
                    전체 위험지수는 0~100점입니다. 지표별 점수는 0~5점이며,
                    서로 다른 발표 주기를 고려해 최신 관측일을 함께 표시합니다.
                </div>
                <div class="risk-method-note">
                    전체 가중치: 신용 35% · 시장 스트레스 20% · 금융여건 20% · 경기침체 신호 25%.
                    과거 데이터로 정식 백테스트한 예측모형이 아닌 휴리스틱 조기경보 점수입니다.
                </div>
            </div>
            ${createTrendSummaryHTML()}
            ${rows}
            <div class="source">
                Source: Federal Reserve Bank of St. Louis · FRED.
                공식 경기침체 판정이 아닌 위험 모니터링 도구입니다.
            </div>
        </div>
    `;
}


function setupRiskRangeButtons() {
    document.querySelectorAll(".range-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const panel = document.getElementById(targetId);
            if (!panel) return;

            const isOpen = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!isOpen));
            panel.hidden = isOpen;

            const symbol = button.querySelector("span");
            button.firstChild.textContent = isOpen ? "구간 설명 보기 " : "구간 설명 접기 ";
            if (symbol) symbol.textContent = isOpen ? "＋" : "－";
        });
    });
}


/* =========================
   추세 화면
========================= */

function renderTrendPanel() {

    const cards =
        INDICATORS.map(
            indicator => {

                const observations =
                    getObservations(
                        indicator.id
                    );

                if (
                    !observations.length
                ) {
                    return "";
                }

                const latest =
                    observations[0];

                const old =
                    observations[
                        Math.min(
                            observations.length - 1,
                            20
                        )
                    ];

                const change =
                    Number(
                        latest.value
                    ) -
                    Number(
                        old.value
                    );

                const trendObservations =
                    filterByPeriod(
                        observations,
                        "1Y"
                    );

                const chartId =
                    `trend-chart-${indicator.id.replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                    )}`;

                const chart =
                    createChart(
                        trendObservations,
                        indicator,
                        chartId
                    );

                return `
                    <div class="trend-card">

                        <div class="trend-card-main">

                            <div class="trend-info">

                                <div class="trend-header">

                                    <div>

                                        <div class="trend-name">
                                            ${indicator.name}
                                        </div>

                                        <div class="trend-ticker">
                                            ${indicator.id}
                                        </div>

                                    </div>

                                    <div
                                        class="status ${
                                            getStatus(
                                                latest.value,
                                                indicator
                                            )
                                        }"
                                    >
                                        ${statusText(
                                            getStatus(
                                                latest.value,
                                                indicator
                                            )
                                        )}
                                    </div>

                                </div>

                                <div class="trend-value">
                                    ${formatValue(
                                        latest.value,
                                        indicator
                                    )}
                                </div>

                                <div
                                    class="${getChangeClass(
                                        change
                                    )}"
                                >
                                    ${
                                        change > 0
                                            ? "▲ "
                                            : change < 0
                                            ? "▼ "
                                            : ""
                                    }

                                    ${formatChange(
                                        change,
                                        indicator
                                    )}

                                    <span
                                        class="trend-change-label"
                                    >
                                        · 최근 20개 관측치
                                    </span>

                                </div>

                            </div>

                            <div class="trend-chart">
                                ${chart}
                            </div>

                        </div>

                    </div>
                `;
            }
        ).join("");

    return `
        <div class="trend-panel">

            <div class="trend-card">

                <div class="panel-title">
                    지표 추세
                </div>

                <div class="panel-subtitle">
                    각 지표의 최근 변화 방향을 확인합니다.
                </div>

            </div>

            ${cards}

        </div>
    `;
}


/* =========================
   기간 버튼 이벤트
========================= */

function setupPeriodButtons() {

    document
        .querySelectorAll(
            ".period-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const indicatorId =
                            button.dataset
                                .indicator;

                        const period =
                            button.dataset
                                .period;

                        selectedPeriods[
                            indicatorId
                        ] = period;

                        render();
                    }
                );
            }
        );
}


/* =========================
   그래프 이벤트
========================= */

function setupAllChartEvents() {

    /*
       대시보드 그래프
    */

    for (
        const indicator of
        INDICATORS
    ) {

        const periodKey =
            selectedPeriods[
                indicator.id
            ] || "1Y";

        const observations =
            filterByPeriod(
                getObservations(
                    indicator.id
                ),
                periodKey
            );

        const data =
            downsample(
                observations
            );

        const chartId =
            `chart-${indicator.id.replace(
                /[^a-zA-Z0-9]/g,
                ""
            )}`;

        setupChartTouchEvents(
            chartId,
            data,
            indicator
        );
    }


    /*
       추세 화면 그래프
       항상 1년 데이터
    */

    if (
        currentPage === "trend"
    ) {

        for (
            const indicator of
            INDICATORS
        ) {

            const observations =
                filterByPeriod(
                    getObservations(
                        indicator.id
                    ),
                    "1Y"
                );

            const data =
                downsample(
                    observations
                );

            const chartId =
                `trend-chart-${indicator.id.replace(
                    /[^a-zA-Z0-9]/g,
                    ""
                )}`;

            setupChartTouchEvents(
                chartId,
                data,
                indicator
            );
        }
    }
}


/* =========================
   전체 렌더링
========================= */

function render() {

    const app =
        document.getElementById(
            "app"
        );

    if (
        !app ||
        !marketData
    ) {
        return;
    }

    let content = "";

    if (
        currentPage ===
        "dashboard"
    ) {

        content =
            renderDashboard();

    } else if (
        currentPage ===
        "risk"
    ) {

        content =
            renderRiskPanel();

    } else if (
        currentPage ===
        "trend"
    ) {

        content =
            renderTrendPanel();
    }

    app.innerHTML =
        createOverallHTML() +
        content;

    setupTopMenu();
    setupPeriodButtons();
    setupAllChartEvents();
    setupRiskRangeButtons();
}


/* =========================
   데이터 불러오기
========================= */

async function loadData() {

    const app =
        document.getElementById(
            "app"
        );

    try {

        const response =
            await fetch(
                `./data.json?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        marketData =
            await response.json();

        window.marketDataUpdatedAt =
            marketData.updated_at;

        render();

    } catch (error) {

        console.error(
            "데이터 로딩 오류:",
            error
        );

        app.innerHTML = `
            <div class="error">

                데이터를 불러오지 못했습니다.

                <br><br>

                ${error.message}

            </div>
        `;
    }
}


/* =========================
   시작
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadData();
    }
);
