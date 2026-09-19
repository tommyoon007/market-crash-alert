const INDICATORS = [
    {
        name: "HY OAS",
        id: "BAMLH0A0HYM2",
        description: "미국 하이일드 회사채 신용스프레드",
        unit: "%",
        decimals: 2,
        levels: [
            { value: 6, status: "danger" },
            { value: 5, status: "warning" },
            { value: 4, status: "caution" }
        ]
    },
    {
        name: "CCC OAS",
        id: "BAMLH0A3HYC",
        description: "CCC급 회사채 신용스프레드",
        unit: "%",
        decimals: 2,
        levels: [
            { value: 10, status: "danger" },
            { value: 8, status: "warning" },
            { value: 6, status: "caution" }
        ]
    },
    {
        name: "VIX",
        id: "VIXCLS",
        description: "미국 증시 변동성 지수",
        unit: "",
        decimals: 2,
        levels: [
            { value: 40, status: "danger" },
            { value: 30, status: "warning" },
            { value: 20, status: "caution" }
        ]
    },
    {
        name: "NFCI",
        id: "NFCI",
        description: "미국 금융여건 지수",
        unit: "",
        decimals: 2,
        levels: [
            { value: 1, status: "danger" },
            { value: 0.5, status: "warning" },
            { value: 0, status: "caution" }
        ]
    },
    {
        name: "10Y - 2Y",
        id: "T10Y2Y",
        description: "미국 10년물 - 2년물 금리차",
        unit: "%",
        decimals: 2,
        levels: [
            { value: -1, status: "caution", inverse: true }
        ]
    },
    {
        name: "Sahm Rule",
        id: "SAHMREALTIME",
        description: "실업률 상승 기반 경기침체 지표",
        unit: "%",
        decimals: 2,
        levels: [
            { value: 0.5, status: "danger" }
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

function getStatus(value, indicator) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "unknown";
    }

    for (const level of indicator.levels) {

        if (level.inverse) {

            if (value <= level.value) {
                return level.status;
            }

        } else {

            if (value >= level.value) {
                return level.status;
            }
        }
    }

    return "safe";
}


function statusText(status) {

    const map = {
        safe: "NORMAL",
        caution: "CAUTION",
        warning: "WARNING",
        danger: "HIGH RISK",
        unknown: "N/A"
    };

    return map[status] || "N/A";
}


function statusScore(status) {

    const map = {
        safe: 0,
        caution: 1,
        warning: 2,
        danger: 3,
        unknown: 0
    };

    return map[status] || 0;
}


function calculateRisk() {

    let score = 0;

    for (const indicator of INDICATORS) {

        const latest =
            getLatestObservation(
                indicator.id
            );

        if (!latest) {
            continue;
        }

        const status =
            getStatus(
                latest.value,
                indicator
            );

        score += statusScore(status);
    }

    return score;
}


function overallStatus(score) {

    if (score >= 7) {
        return "danger";
    }

    if (score >= 4) {
        return "warning";
    }

    if (score >= 2) {
        return "caution";
    }

    return "safe";
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

    /*
       실제 창 높이는 렌더링 후
       왼쪽 정보 영역 높이에 맞춘다.
    */
    const baseHeight = 180;

    const paddingLeft = 8;
    const paddingRight = 8;
    const paddingTop = 3;
    const paddingBottom = 3;

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

    /*
       실제 데이터 범위를 거의 그대로 사용.
       그래프가 위아래를 최대한 꽉 채운다.
    */
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
                preserveAspectRatio="xMidYMid meet"
                data-base-height="${baseHeight}"
                data-chart-height="${baseHeight}"
            >

                <g
                    class="chart-content"
                    id="${chartId}-content"
                >

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
                            data[
                                data.length - 1
                            ].date
                        )}
                    </text>

                    <!-- 터치 정보창 -->

                    <g
                        class="chart-touch-label-bg"
                        id="${chartId}-label"
                        visibility="hidden"
                    >

                        <rect
                            id="${chartId}-label-bg"
                            x="0"
                            y="0"
                            width="180"
                            height="52"
                            rx="8"
                            fill="#07101f"
                            fill-opacity="0.97"
                            stroke="#3a9aff"
                            stroke-width="1"
                        />

                        <text
                            class="chart-touch-date"
                            id="${chartId}-date"
                            x="90"
                            y="20"
                            text-anchor="middle"
                            fill="#dcecff"
                            font-family="Arial, sans-serif"
                            font-size="16"
                            font-weight="700"
                        >
                            ${formatDate(
                                last.date
                            )}
                        </text>

                        <text
                            class="chart-touch-value"
                            id="${chartId}-value"
                            x="90"
                            y="43"
                            text-anchor="middle"
                            fill="#ffffff"
                            font-family="Arial, sans-serif"
                            font-size="19"
                            font-weight="800"
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
                        r="5"
                        fill="#ffffff"
                        stroke="#45a9ff"
                        stroke-width="2"
                        visibility="hidden"
                    />

                </g>

            </svg>

        </div>
    `;
}


/* =========================
   그래프 높이 맞추기
========================= */

function fitChartsToCards() {

    document
        .querySelectorAll(
            ".chart-wrapper"
        )
        .forEach(
            wrapper => {

                const svg =
                    wrapper.querySelector(
                        "svg.chart"
                    );

                if (!svg) {
                    return;
                }

                const card =
                    wrapper.closest(
                        ".card"
                    );

                if (!card) {
                    return;
                }

                const info =
                    card.querySelector(
                        ".card-info"
                    );

                if (!info) {
                    return;
                }

                const wrapperWidth =
                    wrapper.getBoundingClientRect()
                        .width;

                const targetHeight =
                    info.getBoundingClientRect()
                        .height;

                if (
                    wrapperWidth <= 0 ||
                    targetHeight <= 0
                ) {
                    return;
                }

                const width = 700;
                const baseHeight = 180;

                /*
                   실제 창 비율과 SVG viewBox 비율을
                   똑같이 만들어서 빈 공간이 생기지 않게 한다.
                */
                const svgHeight =
                    Math.max(
                        baseHeight,
                        width *
                        targetHeight /
                        wrapperWidth
                    );

                svg.setAttribute(
                    "viewBox",
                    `0 0 ${width} ${svgHeight}`
                );

                svg.dataset.chartHeight =
                    String(svgHeight);

                const content =
                    svg.querySelector(
                        ".chart-content"
                    );

                if (content) {

                    content.setAttribute(
                        "transform",
                        `scale(1, ${
                            svgHeight /
                            baseHeight
                        })`
                    );
                }
            }
        );
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

    const height =
        Number(
            svg.dataset.chartHeight
        ) || 180;

    const baseHeight = 180;

    const paddingLeft = 8;
    const paddingRight = 8;
    const paddingTop = 3;
    const paddingBottom = 3;

    const chartWidth =
        width -
        paddingLeft -
        paddingRight;

    const chartHeight =
        height *
        (
            (baseHeight -
                paddingTop -
                paddingBottom) /
            baseHeight
        );

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
            paddingTop *
                (height / baseHeight) +

            (max - value) *
            chartHeight /
            (max - min)
        );
    }


    function showTouch(clientX) {

        const rect =
            svg.getBoundingClientRect();

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
            paddingTop *
                (height / baseHeight)
        );

        line.setAttribute(
            "y2",
            height -
                paddingBottom *
                (height / baseHeight)
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


        /*
           문자 길이에 맞춰
           터치 정보창 폭을 자동 조절
        */
        const labelWidth =
            Math.max(
                145,
                Math.min(
                    200,
                    Math.max(
                        dateString.length * 10,
                        valueString.length * 11
                    ) + 28
                )
            );

        const labelHeight = 52;

        labelBg.setAttribute(
            "width",
            labelWidth
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


        let labelY = 4;

        const topThreshold =
            70 *
            (height / baseHeight);

        if (pointY < topThreshold) {

            labelY =
                height -
                labelHeight *
                    (height / baseHeight) -
                4;
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
        "pointermove",
        event => {

            showTouch(
                event.clientX
            );
        }
    );


    svg.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

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

    const score =
        calculateRisk();

    const maxScore = 16;

    const percentage =
        Math.min(
            100,
            Math.round(
                score /
                maxScore *
                100
            )
        );

    return `
        <div class="overall-right">

            <div class="risk-score-box">

                <div class="risk-score-label">
                    위험지수
                </div>

                <div class="risk-score-number">
                    ${score}
                    <span>/ ${maxScore}</span>
                </div>

                <div class="risk-score-bar">

                    <div
                        class="risk-score-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

            </div>

            <div class="top-update">
                업데이트 ${formatUpdateTime()}
            </div>

        </div>
    `;
}


/* =========================
   전체 위험도
========================= */

function createOverallHTML() {

    const score =
        calculateRisk();

    const status =
        overallStatus(score);

    return `
        <section
            class="overall ${status}"
        >

            <div class="overall-top">

                <div class="overall-left">

                    <div class="overall-label">
                        미국 증시 폭락 위험
                    </div>

                    <div class="overall-value">
                        ${statusText(
                            status
                        )}
                    </div>

                    ${createTopMenu()}

                </div>

                ${createRiskScoreHTML()}

            </div>

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

    return `
        <div class="dashboard">

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

function renderRiskPanel() {

    const rows =
        INDICATORS.map(
            indicator => {

                const latest =
                    getLatestObservation(
                        indicator.id
                    );

                if (!latest) {
                    return "";
                }

                const status =
                    getStatus(
                        latest.value,
                        indicator
                    );

                return `
                    <div class="risk-row">

                        <div class="risk-row-top">

                            <div>

                                <div class="risk-name">
                                    ${indicator.name}
                                </div>

                                <div class="risk-description">
                                    ${indicator.description}
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

                        <div class="risk-row-bottom">

                            <div>
                                현재값
                                <strong>
                                    ${formatValue(
                                        latest.value,
                                        indicator
                                    )}
                                </strong>
                            </div>

                            <div>
                                최근일
                                <strong>
                                    ${formatDate(
                                        latest.date
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>
                `;
            }
        ).join("");

    return `
        <div class="risk-panel">

            <div class="risk-row">

                <div class="panel-title">
                    위험도 상세
                </div>

                <div class="panel-subtitle">
                    6개 지표의 현재 위험상태를 보여줍니다.
                </div>

            </div>

            ${rows}

            <div class="source">
                위험점수는 이 앱의 휴리스틱 기준이며 공식 경기침체 판정이 아닙니다.
            </div>

        </div>
    `;
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

                return `
                    <div class="trend-card">

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
                                style="
                                    color:#7187a5;
                                    font-weight:normal;
                                "
                            >
                                · 최근 20개 관측치
                            </span>

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

    /*
       먼저 왼쪽 정보창과 그래프창의
       실제 높이를 맞춘다.
    */
    fitChartsToCards();

    setupTopMenu();
    setupPeriodButtons();
    setupAllChartEvents();
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
