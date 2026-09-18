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
    { key: "all", label: "전체" },
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
   개별 위험 점수
================================ */

function getRiskScore(indicator, value) {

    if (value === null || value === undefined) {
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

function getChange(observations, periodsAgo) {

    if (!observations || observations.length <= periodsAgo) {
        return null;
    }

    const latest = Number(observations[0].value);
    const previous = Number(observations[periodsAgo].value);

    if (
        Number.isNaN(latest) ||
        Number.isNaN(previous)
    ) {
        return null;
    }

    return latest - previous;
}


function getChangeClass(indicator, change) {

    if (change === null) {
        return "change-neutral";
    }

    if (indicator.riskDirection === "higher") {

        if (change > 0) {
            return "change-down";
        }

        if (change < 0) {
            return "change-up";
        }
    }

    if (indicator.riskDirection === "lower") {

        if (change < 0) {
            return "change-down";
        }

        if (change > 0) {
            return "change-up";
        }
    }

    return "change-neutral";
}


/* ================================
   날짜
================================ */

function getDateDaysAgo(days) {

    const date = new Date();

    date.setDate(date.getDate() - days);

    return date;
}


function filterObservations(observations, periodKey) {

    if (!observations || !observations.length) {
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
    }

    const startDate = getDateDaysAgo(days);

    return observations.filter(item => {
        return new Date(item.date) >= startDate;
    });
}


/* ================================
   그래프 데이터 압축
================================ */

function downsample(observations, maxPoints = 180) {

    if (!observations || observations.length <= maxPoints) {
        return observations;
    }

    const result = [];

    const step =
        (observations.length - 1) /
        (maxPoints - 1);

    for (let i = 0; i < maxPoints; i++) {

        const index =
            Math.round(i * step);

        result.push(observations[index]);
    }

    return result;
}


/* ================================
   SVG 그래프
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
        filtered.slice().reverse();

    const points =
        downsample(ordered, 180);

    const values =
        points.map(item => Number(item.value));

    const width = 700;
    const height = 180;

    const paddingLeft = 38;
    const paddingRight = 8;
    const paddingTop = 10;
    const paddingBottom = 22;

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

    const range = max - min;

    min -= range * 0.08;
    max += range * 0.08;

    const finalRange = max - min;

    const coords = points.map((item, index) => {

        const x =
            paddingLeft +
            (
                index /
                Math.max(points.length - 1, 1)
            ) *
            chartWidth;

        const value =
            Number(item.value);

        const y =
            paddingTop +
            (
                1 -
                (value - min) /
                finalRange
            ) *
            chartHeight;

        return {
            x,
            y,
            value,
            date: item.date
        };
    });


    const linePath =
        coords.map((point, index) => {

            return index === 0
                ? `M ${point.x} ${point.y}`
                : `L ${point.x} ${point.y}`;

        }).join(" ");


    const areaPath =
        `${linePath}
         L ${coords[coords.length - 1].x} ${height - paddingBottom}
         L ${coords[0].x} ${height - paddingBottom}
         Z`;


    const latest =
        coords[coords.length - 1];

    const first =
        coords[0];

    const middle =
        coords[
            Math.floor(coords.length / 2)
        ];


    const formatAxisValue = value => {
        return Number(value).toFixed(
            indicator.decimals
        );
    };


    const axisTop = max;

    const axisMiddle =
        min + (max - min) / 2;

    const axisBottom = min;


    return `
        <div class="chart-wrapper">

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
                    stroke="#24344e"
                    stroke-width="1"
                />

                <line
                    x1="${paddingLeft}"
                    y1="${height / 2}"
                    x2="${width - paddingRight}"
                    y2="${height / 2}"
                    stroke="#24344e"
                    stroke-width="1"
                />

                <line
                    x1="${paddingLeft}"
                    y1="${height - paddingBottom}"
                    x2="${width - paddingRight}"
                    y2="${height - paddingBottom}"
                    stroke="#24344e"
                    stroke-width="1"
                />

                <text
                    x="2"
                    y="${paddingTop + 4}"
                    fill="#657a99"
                    font-size="10"
                >
                    ${formatAxisValue(axisTop)}
                </text>

                <text
                    x="2"
                    y="${height / 2 + 4}"
                    fill="#657a99"
                    font-size="10"
                >
                    ${formatAxisValue(axisMiddle)}
                </text>

                <text
                    x="2"
                    y="${height - paddingBottom + 4}"
                    fill="#657a99"
                    font-size="10"
                >
                    ${formatAxisValue(axisBottom)}
                </text>

                <path
                    d="${areaPath}"
                    fill="rgba(59,130,246,0.07)"
                    stroke="none"
                />

                <path
                    d="${linePath}"
                    fill="none"
                    stroke="#4f9cff"
                    stroke-width="2.2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />

                <circle
                    cx="${latest.x}"
                    cy="${latest.y}"
                    r="3.5"
                    fill="#63a8ff"
                />

                <text
                    x="${first.x}"
                    y="${height - 5}"
                    fill="#657a99"
                    font-size="9"
                    text-anchor="start"
                >
                    ${first.date}
                </text>

                <text
                    x="${middle.x}"
                    y="${height - 5}"
                    fill="#657a99"
                    font-size="9"
                    text-anchor="middle"
                >
                    ${middle.date}
                </text>

                <text
                    x="${latest.x}"
                    y="${height - 5}"
                    fill="#657a99"
                    font-size="9"
                    text-anchor="end"
                >
                    ${latest.date}
                </text>

            </svg>

        </div>
    `;
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
                periodOptions.map(option => {

                    const active =
                        option.key === selectedPeriod
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

                }).join("")
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
        observations.length > 0
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

                        <div class="status ${status.className}">
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
                                5일
                            </div>

                            <div class="${getChangeClass(
                                indicator,
                                change5
                            )}">
                                ${formatChange(
                                    change5,
                                    indicator.decimals,
                                    indicator.unit
                                )}
                            </div>

                        </div>


                        <div class="change-box">

                            <div class="change-label">
                                20일
                            </div>

                            <div class="${getChangeClass(
                                indicator,
                                change20
                            )}">
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
                    ${latest ? latest.date : "--"}
                </div>

            </div>

        </div>
    `;
}


/* ================================
   전체 위험도
================================ */

function calculateOverallRisk(data) {

    let score = 0;

    indicators.forEach(indicator => {

        const observations =
            data[indicator.ticker]?.observations || [];

        if (!observations.length) {
            return;
        }

        const value =
            Number(observations[0].value);

        score += getRiskScore(
            indicator,
            value
        );

    });


    if (score >= 7) {
        return {
            text: "HIGH RISK",
            className: "danger",
            score: score
        };
    }

    if (score >= 4) {
        return {
            text: "WARNING",
            className: "warning",
            score: score
        };
    }

    if (score >= 2) {
        return {
            text: "CAUTION",
            className: "caution",
            score: score
        };
    }

    return {
        text: "NORMAL",
        className: "safe",
        score: score
    };
}


/* ================================
   대시보드 화면
================================ */

function renderDashboard() {

    const overall =
        calculateOverallRisk(
            allData
        );


    app.innerHTML = `

        <div class="overall ${overall.className}">

            <div class="overall-label">
                종합 금융시장 위험도
            </div>

            <div class="overall-value">
                ${overall.text}
            </div>

            <div class="overall-time">
                위험 점수:
                ${overall.score}
            </div>

            <div class="overall-time">
                데이터 업데이트:
                ${
                    window.marketDataUpdatedAt
                        ? new Date(
                            window.marketDataUpdatedAt
                        ).toLocaleString("ko-KR")
                        : "--"
                }
            </div>

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

    attachDashboardEvents();
}


/* ================================
   위험도 화면
================================ */

function renderRiskView() {

    const overall =
        calculateOverallRisk(
            allData
        );


    const rows =
        indicators.map(indicator => {

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

                        <div class="status ${status.className}">
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

        }).join("");


    app.innerHTML = `

        <div class="overall ${overall.className}">

            <div class="overall-label">
                현재 종합 위험도
            </div>

            <div class="overall-value">
                ${overall.text}
            </div>

            <div class="overall-time">
                총 위험 점수:
                ${overall.score}
            </div>

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
}


/* ================================
   추세 화면
================================ */

function renderTrendView() {

    const overall =
        calculateOverallRisk(
            allData
        );


    const trendCards =
        indicators.map(indicator => {

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

                        <div class="status ${status.className}">
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

        }).join("");


    app.innerHTML = `

        <div class="overall ${overall.className}">

            <div class="overall-label">
                시장 추세
            </div>

            <div class="overall-value">
                ${overall.text}
            </div>

            <div class="overall-time">
                기본 추세 기간: 1년
            </div>

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
}


/* ================================
   화면 전환
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
   대시보드 이벤트
================================ */

function attachDashboardEvents() {

    document
        .querySelectorAll(".period-button")
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
   하단 메뉴
================================ */

function setupBottomNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach((item, index) => {

        item.addEventListener(
            "click",
            () => {

                navItems.forEach(nav => {
                    nav.classList.remove("active");
                });

                item.classList.add("active");


                if (index === 0) {
                    currentView = "dashboard";
                }

                if (index === 1) {
                    currentView = "risk";
                }

                if (index === 2) {
                    currentView = "trend";
                }


                renderCurrentView();

            }
        );

    });
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

setupBottomNavigation();

loadData();
