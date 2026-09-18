const indicators = [
    {
        name: "HY OAS",
        ticker: "BAMLH0A0HYM2",
        description: "미국 하이일드 채권 스프레드",
        unit: "%",
        decimals: 2,
        riskDirection: "higher"
    },
    {
        name: "CCC OAS",
        ticker: "BAMLH0A3HYC",
        description: "CCC 이하 채권 스프레드",
        unit: "%",
        decimals: 2,
        riskDirection: "higher"
    },
    {
        name: "VIX",
        ticker: "VIXCLS",
        description: "미국 주식시장 변동성",
        unit: "",
        decimals: 2,
        riskDirection: "higher"
    },
    {
        name: "NFCI",
        ticker: "NFCI",
        description: "미국 금융여건",
        unit: "",
        decimals: 2,
        riskDirection: "higher"
    },
    {
        name: "10Y - 2Y",
        ticker: "T10Y2Y",
        description: "미국 10년물 - 2년물 금리차",
        unit: "%",
        decimals: 2,
        riskDirection: "lower"
    },
    {
        name: "Sahm Rule",
        ticker: "SAHMREALTIME",
        description: "경기침체 조기 신호",
        unit: "%",
        decimals: 2,
        riskDirection: "higher"
    }
];

const app = document.getElementById("app");

let allData = {};

let currentView = "dashboard";

let selectedPeriods = {};

const periodOptions = [
    { key: "all", label: "전체기간" },
    { key: "10y", label: "10년" },
    { key: "5y", label: "5년" },
    { key: "1y", label: "1년" },
    { key: "6m", label: "6개월" },
    { key: "3m", label: "3개월" }
];


/* ================================
   숫자 표시
================================ */

function formatValue(value, decimals, unit) {

    if (value === null || value === undefined) {
        return "--";
    }

    return Number(value).toFixed(decimals) + unit;
}


function formatChange(value, decimals, unit) {

    if (value === null || value === undefined) {
        return "--";
    }

    const sign = value > 0 ? "+" : "";

    return sign + Number(value).toFixed(decimals) + unit;
}


/* ================================
   위험도
================================ */

function getStatus(indicator, value) {

    if (value === null || value === undefined) {
        return {
            text: "데이터 없음",
            className: "unknown"
        };
    }

    switch (indicator.ticker) {

        case "BAMLH0A0HYM2":

            if (value >= 6) {
                return { text: "위험", className: "danger" };
            }

            if (value >= 5) {
                return { text: "경계", className: "warning" };
            }

            if (value >= 4) {
                return { text: "주의", className: "caution" };
            }

            return { text: "안정", className: "safe" };


        case "BAMLH0A3HYC":

            if (value >= 10) {
                return { text: "위험", className: "danger" };
            }

            if (value >= 8) {
                return { text: "경계", className: "warning" };
            }

            if (value >= 6) {
                return { text: "주의", className: "caution" };
            }

            return { text: "안정", className: "safe" };


        case "VIXCLS":

            if (value >= 40) {
                return { text: "위험", className: "danger" };
            }

            if (value >= 30) {
                return { text: "경계", className: "warning" };
            }

            if (value >= 20) {
                return { text: "주의", className: "caution" };
            }

            return { text: "안정", className: "safe" };


        case "NFCI":

            if (value >= 1) {
                return { text: "위험", className: "danger" };
            }

            if (value >= 0.5) {
                return { text: "경계", className: "warning" };
            }

            if (value >= 0) {
                return { text: "주의", className: "caution" };
            }

            return { text: "완화", className: "safe" };


        case "T10Y2Y":

            if (value <= -1) {
                return { text: "주의", className: "caution" };
            }

            return { text: "정상", className: "safe" };


        case "SAHMREALTIME":

            if (value >= 0.5) {
                return { text: "침체 신호", className: "danger" };
            }

            return { text: "정상", className: "safe" };


        default:

            return {
                text: "확인",
                className: "unknown"
            };
    }
}


/* ================================
   위험 점수
================================ */

function getRiskScore(indicator, value) {

    if (
        value === null ||
        value === undefined
    ) {
        return 0;
    }

    value = Number(value);

    if (Number.isNaN(value)) {
        return 0;
    }

    switch (indicator.ticker) {

        case "BAMLH0A0HYM2":

            if (value >= 6) return 3;
            if (value >= 5) return 2;
            if (value >= 4) return 1;

            return 0;


        case "BAMLH0A3HYC":

            if (value >= 10) return 3;
            if (value >= 8) return 2;
            if (value >= 6) return 1;

            return 0;


        case "VIXCLS":

            if (value >= 40) return 3;
            if (value >= 30) return 2;
            if (value >= 20) return 1;

            return 0;


        case "NFCI":

            if (value >= 1) return 3;
            if (value >= 0.5) return 2;
            if (value >= 0) return 1;

            return 0;


        case "T10Y2Y":

            if (value <= -1) return 1;

            return 0;


        case "SAHMREALTIME":

            if (value >= 0.5) return 3;

            return 0;


        default:

            return 0;
    }
}


/* ================================
   변화량
================================ */

function getChange(
    observations,
    periodsAgo
) {

    if (
        !observations ||
        observations.length <= periodsAgo
    ) {
        return null;
    }

    const latest =
        Number(observations[0].value);

    const previous =
        Number(observations[periodsAgo].value);

    if (
        Number.isNaN(latest) ||
        Number.isNaN(previous)
    ) {
        return null;
    }

    return latest - previous;
}


function getChangeClass(
    indicator,
    change
) {

    if (change === null) {
        return "change-neutral";
    }

    if (
        indicator.riskDirection === "higher"
    ) {

        if (change > 0) {
            return "change-up";
        }

        if (change < 0) {
            return "change-down";
        }
    }


    if (
        indicator.riskDirection === "lower"
    ) {

        if (change < 0) {
            return "change-up";
        }

        if (change > 0) {
            return "change-down";
        }
    }

    return "change-neutral";
}


/* ================================
   기간
================================ */

function getDateDaysAgo(days) {

    const date = new Date();

    date.setDate(
        date.getDate() - days
    );

    return date;
}


function filterObservations(
    observations,
    periodKey
) {

    if (
        !observations ||
        !observations.length
    ) {
        return [];
    }

    if (periodKey === "all") {
        return observations.slice();
    }

    let days = 0;

    switch (periodKey) {

        case "10y":
            days = 3650;
            break;

        case "5y":
            days = 1825;
            break;

        case "1y":
            days = 365;
            break;

        case "6m":
            days = 183;
            break;

        case "3m":
            days = 92;
            break;

        default:
            days = 365;
    }

    const startDate =
        getDateDaysAgo(days);

    return observations.filter(item => {

        return new Date(item.date) >= startDate;

    });
}


/* ================================
   그래프 압축
================================ */

function downsample(
    observations,
    maxPoints = 180
) {

    if (
        !observations ||
        observations.length <= maxPoints
    ) {
        return observations;
    }

    const result = [];

    const step =
        (
            observations.length - 1
        ) /
        (
            maxPoints - 1
        );

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
            observations[index]
        );
    }

    return result;
}


/* ================================
   날짜 표시
================================ */

function formatChartDate(
    dateString
) {

    if (!dateString) {
        return "--";
    }

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return (
        parts[0] +
        "-" +
        parts[1] +
        "-" +
        parts[2]
    );
}


/* ================================
   그래프
================================ */

function createChart(
    indicator,
    observations,
    periodKey
) {

    const filtered =
        filterObservations(
            observations,
            periodKey
        );

    if (!filtered.length) {

        return `
            <div class="chart-empty">
                데이터 없음
            </div>
        `;
    }


    const ordered =
        filtered
            .slice()
            .reverse();


    const points =
        downsample(
            ordered,
            180
        );


    const values =
        points.map(
            item => Number(item.value)
        );


    const width = 700;
    const height = 210;

    const paddingLeft = 42;
    const paddingRight = 8;
    const paddingTop = 12;
    const paddingBottom = 28;


    const chartWidth =
        width -
        paddingLeft -
        paddingRight;


    const chartHeight =
        height -
        paddingTop -
        paddingBottom;


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


    min -= range * 0.08;
    max += range * 0.08;


    const finalRange =
        max - min;


    const coords =
        points.map(
            (item, index) => {

                const x =
                    paddingLeft +
                    (
                        index /
                        Math.max(
                            points.length - 1,
                            1
                        )
                    ) *
                    chartWidth;


                const value =
                    Number(item.value);


                const y =
                    paddingTop +
                    (
                        1 -
                        (
                            value - min
                        ) /
                        finalRange
                    ) *
                    chartHeight;


                return {
                    x,
                    y,
                    value,
                    date: item.date
                };

            }
        );


    const linePath =
        coords
            .map(
                (point, index) => {

                    return index === 0
                        ? `M ${point.x} ${point.y}`
                        : `L ${point.x} ${point.y}`;

                }
            )
            .join(" ");


    const areaPath =
        linePath +
        ` L ${coords[coords.length - 1].x} ${height - paddingBottom}` +
        ` L ${coords[0].x} ${height - paddingBottom}` +
        ` Z`;


    const first =
        coords[0];

    const middle =
        coords[
            Math.floor(
                coords.length / 2
            )
        ];

    const latest =
        coords[
            coords.length - 1
        ];


    function axisValue(value) {

        return Number(value)
            .toFixed(
                indicator.decimals
            );
    }


    const axisTop = max;

    const axisMiddle =
        min +
        (
            max - min
        ) /
        2;

    const axisBottom = min;


    return `

        <div
            class="chart-wrapper"
            data-ticker="${indicator.ticker}"
            data-period="${periodKey}"
        >

            <svg
                class="chart"
                viewBox="0 0 ${width} ${height}"
                preserveAspectRatio="none"
            >

                <line
                    x1="${paddingLeft}"
                    y1="${paddingTop}"
                    x2="${width - paddingRight}"
                    y2="${paddingTop}"
                    stroke="#263957"
                    stroke-width="1"
                />

                <line
                    x1="${paddingLeft}"
                    y1="${height / 2}"
                    x2="${width - paddingRight}"
                    y2="${height / 2}"
                    stroke="#263957"
                    stroke-width="1"
                />

                <line
                    x1="${paddingLeft}"
                    y1="${height - paddingBottom}"
                    x2="${width - paddingRight}"
                    y2="${height - paddingBottom}"
                    stroke="#263957"
                    stroke-width="1"
                />


                <text
                    x="2"
                    y="${paddingTop + 4}"
                    fill="#8da2c2"
                    font-size="10"
                >
                    ${axisValue(axisTop)}
                </text>


                <text
                    x="2"
                    y="${height / 2 + 4}"
                    fill="#8da2c2"
                    font-size="10"
                >
                    ${axisValue(axisMiddle)}
                </text>


                <text
                    x="2"
                    y="${height - paddingBottom + 4}"
                    fill="#8da2c2"
                    font-size="10"
                >
                    ${axisValue(axisBottom)}
                </text>


                <path
                    d="${areaPath}"
                    fill="rgba(59,130,246,0.10)"
                    stroke="none"
                />


                <path
                    d="${linePath}"
                    fill="none"
                    stroke="#55a5ff"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />


                <circle
                    class="chart-latest-point"
                    cx="${latest.x}"
                    cy="${latest.y}"
                    r="4"
                    fill="#7ab8ff"
                />


                <text
                    x="${first.x}"
                    y="${height - 6}"
                    fill="#7d92b1"
                    font-size="9"
                    text-anchor="start"
                >
                    ${first.date}
                </text>


                <text
                    x="${middle.x}"
                    y="${height - 6}"
                    fill="#7d92b1"
                    font-size="9"
                    text-anchor="middle"
                >
                    ${middle.date}
                </text>


                <text
                    x="${latest.x}"
                    y="${height - 6}"
                    fill="#7d92b1"
                    font-size="9"
                    text-anchor="end"
                >
                    ${latest.date}
                </text>


                <!-- 터치 영역 -->

                <rect
                    class="chart-touch-area"
                    x="0"
                    y="0"
                    width="${width}"
                    height="${height}"
                    fill="transparent"
                />


                <!-- 터치 세로선 -->

                <line
                    class="chart-touch-line"
                    x1="${paddingLeft}"
                    y1="${paddingTop}"
                    x2="${paddingLeft}"
                    y2="${height - paddingBottom}"
                    stroke="#ffffff"
                    stroke-width="1.5"
                    stroke-dasharray="4 4"
                    opacity="0"
                    pointer-events="none"
                />


                <!-- 터치점 -->

                <circle
                    class="chart-touch-point"
                    cx="${paddingLeft}"
                    cy="${paddingTop}"
                    r="6"
                    fill="#ffffff"
                    stroke="#1685ff"
                    stroke-width="2"
                    opacity="0"
                    pointer-events="none"
                />


                <!-- 넓은 터치 날짜 박스 -->

                <rect
                    class="chart-touch-label-bg"
                    x="0"
                    y="0"
                    width="210"
                    height="58"
                    rx="9"
                    fill="#07101f"
                    stroke="#1685ff"
                    stroke-width="1.5"
                    opacity="0"
                    pointer-events="none"
                />


                <text
                    class="chart-touch-date"
                    x="0"
                    y="0"
                    fill="#d5e3f5"
                    font-size="13"
                    font-weight="bold"
                    opacity="0"
                    pointer-events="none"
                >
                    날짜
                </text>


                <text
                    class="chart-touch-value"
                    x="0"
                    y="0"
                    fill="#ffffff"
                    font-size="17"
                    font-weight="bold"
                    opacity="0"
                    pointer-events="none"
                >
                    값
                </text>

            </svg>

        </div>
    `;
}


/* ================================
   그래프 터치 이벤트
================================ */

function setupChartTouchEvents() {

    document
        .querySelectorAll(
            ".chart-wrapper"
        )
        .forEach(wrapper => {

            const ticker =
                wrapper.dataset.ticker;

            const period =
                wrapper.dataset.period;


            const indicator =
                indicators.find(
                    item =>
                        item.ticker === ticker
                );


            if (!indicator) {
                return;
            }


            const observations =
                allData[ticker]?.observations || [];


            const filtered =
                filterObservations(
                    observations,
                    period
                );


            if (!filtered.length) {
                return;
            }


            const ordered =
                filtered
                    .slice()
                    .reverse();


            const points =
                downsample(
                    ordered,
                    180
                );


            const svg =
                wrapper.querySelector(
                    ".chart"
                );


            const touchArea =
                wrapper.querySelector(
                    ".chart-touch-area"
                );


            const touchLine =
                wrapper.querySelector(
                    ".chart-touch-line"
                );


            const touchPoint =
                wrapper.querySelector(
                    ".chart-touch-point"
                );


            const labelBg =
                wrapper.querySelector(
                    ".chart-touch-label-bg"
                );


            const dateText =
                wrapper.querySelector(
                    ".chart-touch-date"
                );


            const valueText =
                wrapper.querySelector(
                    ".chart-touch-value"
                );


            if (
                !svg ||
                !touchArea ||
                !touchLine ||
                !touchPoint ||
                !labelBg ||
                !dateText ||
                !valueText
            ) {
                return;
            }


            const width = 700;
            const height = 210;

            const paddingLeft = 42;
            const paddingRight = 8;
            const paddingTop = 12;
            const paddingBottom = 28;


            const chartWidth =
                width -
                paddingLeft -
                paddingRight;


            const chartHeight =
                height -
                paddingTop -
                paddingBottom;


            const values =
                points.map(
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


            min -= range * 0.08;
            max += range * 0.08;


            const finalRange =
                max - min;


            function showPoint(event) {

                let clientX;


                if (
                    event.touches &&
                    event.touches.length
                ) {

                    clientX =
                        event.touches[0].clientX;

                } else {

                    clientX =
                        event.clientX;
                }


                if (
                    typeof clientX !== "number" ||
                    Number.isNaN(clientX)
                ) {
                    return;
                }


                const rect =
                    svg.getBoundingClientRect();


                let svgX =
                    (
                        clientX -
                        rect.left
                    ) /
                    rect.width *
                    width;


                svgX =
                    Math.max(
                        paddingLeft,
                        Math.min(
                            width -
                            paddingRight,
                            svgX
                        )
                    );


                let ratio =
                    (
                        svgX -
                        paddingLeft
                    ) /
                    chartWidth;


                ratio =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            ratio
                        )
                    );


                let index =
                    Math.round(
                        ratio *
                        (
                            points.length - 1
                        )
                    );


                index =
                    Math.max(
                        0,
                        Math.min(
                            points.length - 1,
                            index
                        )
                    );


                const point =
                    points[index];


                const pointX =
                    paddingLeft +
                    (
                        index /
                        Math.max(
                            points.length - 1,
                            1
                        )
                    ) *
                    chartWidth;


                const pointY =
                    paddingTop +
                    (
                        1 -
                        (
                            Number(point.value) -
                            min
                        ) /
                        finalRange
                    ) *
                    chartHeight;


                /* 세로선 */

                touchLine.setAttribute(
                    "x1",
                    pointX
                );

                touchLine.setAttribute(
                    "x2",
                    pointX
                );

                touchLine.setAttribute(
                    "opacity",
                    "1"
                );


                /* 점 */

                touchPoint.setAttribute(
                    "cx",
                    pointX
                );

                touchPoint.setAttribute(
                    "cy",
                    pointY
                );

                touchPoint.setAttribute(
                    "opacity",
                    "1"
                );


                /* 날짜 */

                dateText.textContent =
                    formatChartDate(
                        point.date
                    );


                dateText.setAttribute(
                    "opacity",
                    "1"
                );


                /* 값 */

                valueText.textContent =
                    formatValue(
                        point.value,
                        indicator.decimals,
                        indicator.unit
                    );


                valueText.setAttribute(
                    "opacity",
                    "1"
                );


                /*
                 * 가로로 넓은 박스
                 */

                const labelWidth = 210;
                const labelHeight = 58;


                let labelX =
                    pointX -
                    labelWidth / 2;


                labelX =
                    Math.max(
                        paddingLeft,
                        Math.min(
                            width -
                            paddingRight -
                            labelWidth,
                            labelX
                        )
                    );


                /*
                 * 기본적으로 그래프 위쪽에 표시
                 */

                let labelY = 8;


                /*
                 * 터치점이 위쪽에 있으면
                 * 터치점 아래에 표시
                 */

                if (
                    pointY <
                    75
                ) {

                    labelY =
                        Math.min(
                            pointY + 12,
                            height -
                            paddingBottom -
                            labelHeight
                        );
                }


                labelBg.setAttribute(
                    "x",
                    labelX
                );

                labelBg.setAttribute(
                    "y",
                    labelY
                );

                labelBg.setAttribute(
                    "width",
                    labelWidth
                );

                labelBg.setAttribute(
                    "height",
                    labelHeight
                );

                labelBg.setAttribute(
                    "opacity",
                    "0.97"
                );


                /*
                 * 날짜 글씨
                 */

                dateText.setAttribute(
                    "x",
                    labelX + 12
                );

                dateText.setAttribute(
                    "y",
                    labelY + 21
                );


                /*
                 * 값 글씨
                 */

                valueText.setAttribute(
                    "x",
                    labelX + 12
                );

                valueText.setAttribute(
                    "y",
                    labelY + 46
                );

            }


            /*
             * 손가락 터치 시작
             */

            touchArea.addEventListener(
                "pointerdown",
                event => {

                    if (
                        event.pointerType === "mouse" &&
                        event.button !== 0
                    ) {
                        return;
                    }


                    try {

                        touchArea.setPointerCapture(
                            event.pointerId
                        );

                    } catch (error) {
                    }


                    event.preventDefault();

                    showPoint(event);

                },
                {
                    passive: false
                }
            );


            /*
             * 손가락 이동
             */

            touchArea.addEventListener(
                "pointermove",
                event => {

                    if (
                        event.pointerType === "mouse" &&
                        event.buttons === 0
                    ) {
                        return;
                    }


                    event.preventDefault();

                    showPoint(event);

                },
                {
                    passive: false
                }
            );


            /*
             * 마우스 클릭
             */

            touchArea.addEventListener(
                "click",
                event => {

                    showPoint(event);

                }
            );

        });
}


/* ================================
   기간 버튼
================================ */

function createPeriodButtons(
    indicator,
    selectedPeriod
) {

    return `

        <div
            class="period-buttons"
            data-ticker="${indicator.ticker}"
        >

            ${
                periodOptions
                    .map(option => {

                        const active =
                            option.key ===
                            selectedPeriod
                                ? "active"
                                : "";


                        return `

                            <button
                                class="period-button ${active}"
                                data-period="${option.key}"
                                data-ticker="${indicator.ticker}"
                            >
                                ${option.label}
                            </button>

                        `;

                    })
                    .join("")
            }

        </div>

    `;
}


/* ================================
   카드
================================ */

function createCard(
    indicator,
    data,
    selectedPeriod = "all"
) {

    const observations =
        data?.observations || [];


    const latest =
        observations.length
            ? observations[0]
            : null;


    const value =
        latest
            ? latest.value
            : null;


    const change5 =
        getChange(
            observations,
            5
        );


    const change20 =
        getChange(
            observations,
            20
        );


    const status =
        getStatus(
            indicator,
            value
        );


    return `

        <div
            class="card"
            data-card="${indicator.ticker}"
        >

            <div class="card-main">

                <div class="card-info">

                    <div class="card-header">

                        <div>

                            <div class="card-title">
                                ${indicator.name}
                            </div>

                            <div class="ticker">
                                ${indicator.ticker}
                            </div>

                        </div>


                        <div
                            class="status ${status.className}"
                        >
                            ${status.text}
                        </div>

                    </div>


                    <div class="description">
                        ${indicator.description}
                    </div>


                    <div class="value">
                        ${formatValue(
                            value,
                            indicator.decimals,
                            indicator.unit
                        )}
                    </div>


                    <div class="changes">

                        <div class="change-box">

                            <div class="change-label">
                                5일 변화
                            </div>

                            <div
                                class="${getChangeClass(
                                    indicator,
                                    change5
                                )}"
                            >
                                ${formatChange(
                                    change5,
                                    indicator.decimals,
                                    indicator.unit
                                )}
                            </div>

                        </div>


                        <div class="change-box">

                            <div class="change-label">
                                20일 변화
                            </div>

                            <div
                                class="${getChangeClass(
                                    indicator,
                                    change20
                                )}"
                            >
                                ${formatChange(
                                    change20,
                                    indicator.decimals,
                                    indicator.unit
                                )}
                            </div>

                        </div>

                    </div>

                </div>


                <div class="card-chart">

                    ${createChart(
                        indicator,
                        observations,
                        selectedPeriod
                    )}

                </div>

            </div>


            <div class="card-bottom">

                ${createPeriodButtons(
                    indicator,
                    selectedPeriod
                )}


                <div class="date">

                    기준일:
                    ${latest
                        ? latest.date
                        : "--"}

                </div>

            </div>

        </div>

    `;
}


/* ================================
   전체 위험도
================================ */

function calculateOverallRisk(
    data
) {

    let score = 0;


    indicators.forEach(
        indicator => {

            const observations =
                data[
                    indicator.ticker
                ]?.observations || [];


            if (!observations.length) {
                return;
            }


            const value =
                Number(
                    observations[0].value
                );


            score +=
                getRiskScore(
                    indicator,
                    value
                );

        }
    );


    if (score >= 7) {

        return {
            text: "HIGH RISK",
            className: "danger",
            score
        };

    }


    if (score >= 4) {

        return {
            text: "WARNING",
            className: "warning",
            score
        };

    }


    if (score >= 2) {

        return {
            text: "CAUTION",
            className: "caution",
            score
        };

    }


    return {
        text: "NORMAL",
        className: "safe",
        score
    };
}


/* ================================
   이전 위험점수
================================ */

function calculatePreviousRisk(
    data
) {

    let score = 0;


    indicators.forEach(
        indicator => {

            const observations =
                data[
                    indicator.ticker
                ]?.observations || [];


            if (observations.length < 2) {
                return;
            }


            const value =
                Number(
                    observations[1].value
                );


            score +=
                getRiskScore(
                    indicator,
                    value
                );

        }
    );


    return score;
}


/* ================================
   상단 메뉴
================================ */

function createTopMenu() {

    return `

        <div class="top-menu-row">

            <div class="top-menu">

                <button
                    class="top-menu-button ${
                        currentView === "dashboard"
                            ? "active"
                            : ""
                    }"
                    data-view="dashboard"
                >
                    대시보드
                </button>


                <button
                    class="top-menu-button ${
                        currentView === "risk"
                            ? "active"
                            : ""
                    }"
                    data-view="risk"
                >
                    위험도
                </button>


                <button
                    class="top-menu-button ${
                        currentView === "trend"
                            ? "active"
                            : ""
                    }"
                    data-view="trend"
                >
                    추세
                </button>

            </div>


            <div class="top-update">

                업데이트
                ${
                    window.marketDataUpdatedAt
                        ? new Date(
                            window.marketDataUpdatedAt
                        ).toLocaleString(
                            "ko-KR",
                            {
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )
                        : "--"
                }

            </div>

        </div>

    `;
}


/* ================================
   위험지수 박스
================================ */

function createRiskScoreHTML(
    overall,
    previousScore
) {

    const maxScore = 16;


    const percentage =
        Math.min(
            100,
            Math.round(
                (
                    overall.score /
                    maxScore
                ) *
                100
            )
        );


    const difference =
        overall.score -
        previousScore;


    let differenceText = "0";


    if (difference > 0) {

        differenceText =
            `▲ +${difference}`;

    }

    else if (difference < 0) {

        differenceText =
            `▼ ${difference}`;

    }


    return `

        <div class="risk-score-box">

            <div class="risk-score-label">
                위험 지수
            </div>


            <div class="risk-score-number">

                <strong>
                    ${overall.score}
                </strong>

                <span>
                    / ${maxScore}
                </span>

            </div>


            <div class="risk-score-bar">

                <div
                    class="risk-score-fill"
                    style="width:${percentage}%"
                ></div>

            </div>


            <div class="risk-score-change">

                이전 대비

                <strong>
                    ${differenceText}
                </strong>

            </div>

        </div>

    `;
}


/* ================================
   대시보드
================================ */

function renderDashboard() {

    const overall =
        calculateOverallRisk(
            allData
        );


    const previousScore =
        calculatePreviousRisk(
            allData
        );


    app.innerHTML = `

        <div
            class="overall ${overall.className}"
        >

            <div class="overall-top">

                <div class="overall-left">

                    <div class="overall-label">
                        종합 금융시장 위험도
                    </div>


                    <div class="overall-value">
                        ${overall.text}
                    </div>

                </div>


                ${createRiskScoreHTML(
                    overall,
                    previousScore
                )}

            </div>


            ${createTopMenu()}

        </div>


        <div class="dashboard">

            ${
                indicators
                    .map(indicator => {

                        const period =
                            selectedPeriods[
                                indicator.ticker
                            ] || "all";


                        return createCard(
                            indicator,
                            allData[
                                indicator.ticker
                            ],
                            period
                        );

                    })
                    .join("")
            }

        </div>


        <div class="source">

            Data source:
            Federal Reserve Bank of St. Louis (FRED)

        </div>

    `;


    attachTopMenuEvents();

    attachDashboardEvents();

    setupChartTouchEvents();
}


/* ================================
   위험도 화면
================================ */

function renderRiskView() {

    const overall =
        calculateOverallRisk(
            allData
        );


    const previousScore =
        calculatePreviousRisk(
            allData
        );


    const rows =
        indicators
            .map(indicator => {

                const observations =
                    allData[
                        indicator.ticker
                    ]?.observations || [];


                const latest =
                    observations.length
                        ? observations[0]
                        : null;


                const value =
                    latest
                        ? Number(latest.value)
                        : null;


                const status =
                    getStatus(
                        indicator,
                        value
                    );


                const score =
                    getRiskScore(
                        indicator,
                        value
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
                                class="status ${status.className}"
                            >
                                ${status.text}
                            </div>

                        </div>


                        <div class="risk-row-bottom">

                            <span>
                                현재값
                                <strong>
                                    ${formatValue(
                                        value,
                                        indicator.decimals,
                                        indicator.unit
                                    )}
                                </strong>
                            </span>


                            <span>
                                위험점수
                                <strong>
                                    ${score}
                                </strong>
                            </span>


                            <span>
                                기준일
                                <strong>
                                    ${latest
                                        ? latest.date
                                        : "--"}
                                </strong>
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");


    app.innerHTML = `

        <div
            class="overall ${overall.className}"
        >

            <div class="overall-top">

                <div class="overall-left">

                    <div class="overall-label">
                        현재 종합 위험도
                    </div>


                    <div class="overall-value">
                        ${overall.text}
                    </div>

                </div>


                ${createRiskScoreHTML(
                    overall,
                    previousScore
                )}

            </div>


            ${createTopMenu()}

        </div>


        <div class="risk-panel">

            <div class="panel-title">
                지표별 위험도
            </div>


            <div class="panel-subtitle">
                현재 데이터 기준
            </div>


            ${rows}

        </div>


        <div class="source">

            Data source:
            Federal Reserve Bank of St. Louis (FRED)

        </div>

    `;


    attachTopMenuEvents();
}


/* ================================
   추세 화면
================================ */

function renderTrendView() {

    const overall =
        calculateOverallRisk(
            allData
        );


    const previousScore =
        calculatePreviousRisk(
            allData
        );


    const trendCards =
        indicators
            .map(indicator => {

                const observations =
                    allData[
                        indicator.ticker
                    ]?.observations || [];


                const period =
                    selectedPeriods[
                        indicator.ticker
                    ] || "1y";


                const latest =
                    observations.length
                        ? observations[0]
                        : null;


                const value =
                    latest
                        ? latest.value
                        : null;


                const status =
                    getStatus(
                        indicator,
                        value
                    );


                return `

                    <div class="trend-card">

                        <div class="trend-header">

                            <div>

                                <div class="trend-name">
                                    ${indicator.name}
                                </div>

                                <div class="trend-ticker">
                                    ${indicator.ticker}
                                </div>

                            </div>


                            <div
                                class="status ${status.className}"
                            >
                                ${status.text}
                            </div>

                        </div>


                        <div class="trend-value">

                            ${formatValue(
                                value,
                                indicator.decimals,
                                indicator.unit
                            )}

                        </div>


                        ${createChart(
                            indicator,
                            observations,
                            period
                        )}

                    </div>

                `;

            })
            .join("");


    app.innerHTML = `

        <div
            class="overall ${overall.className}"
        >

            <div class="overall-top">

                <div class="overall-left">

                    <div class="overall-label">
                        시장 추세
                    </div>


                    <div class="overall-value">
                        ${overall.text}
                    </div>

                </div>


                ${createRiskScoreHTML(
                    overall,
                    previousScore
                )}

            </div>


            ${createTopMenu()}

        </div>


        <div class="trend-panel">

            <div class="panel-title">
                주요 위험지표 추세
            </div>


            <div class="panel-subtitle">
                최근 1년
            </div>


            ${trendCards}

        </div>


        <div class="source">

            Data source:
            Federal Reserve Bank of St. Louis (FRED)

        </div>

    `;


    attachTopMenuEvents();

    setupChartTouchEvents();
}


/* ================================
   상단 메뉴 이벤트
================================ */

function attachTopMenuEvents() {

    document
        .querySelectorAll(
            ".top-menu-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentView =
                        button.dataset.view;

                    renderCurrentView();

                }
            );

        });
}


/* ================================
   기간 버튼 이벤트
================================ */

function attachDashboardEvents() {

    document
        .querySelectorAll(
            ".period-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const ticker =
                        button.dataset.ticker;


                    const period =
                        button.dataset.period;


                    selectedPeriods[ticker] =
                        period;


                    renderDashboard();

                }
            );

        });
}


/* ================================
   현재 화면
================================ */

function renderCurrentView() {

    if (currentView === "risk") {

        renderRiskView();

        return;
    }


    if (currentView === "trend") {

        renderTrendView();

        return;
    }


    renderDashboard();
}


/* ================================
   데이터 로딩
================================ */

async function loadData() {

    try {

        const response =
            await fetch(
                "data.json?t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "data.json을 불러오지 못했습니다."
            );

        }


        const json =
            await response.json();


        allData =
            json.data || {};


        window.marketDataUpdatedAt =
            json.updated_at || null;


        renderCurrentView();

    }

    catch (error) {

        console.error(error);


        app.innerHTML = `

            <div class="error">

                데이터를 불러오지 못했습니다.

                <br><br>

                잠시 후 다시 시도해주세요.

            </div>

        `;

    }
}


/* ================================
   시작
================================ */

loadData();
