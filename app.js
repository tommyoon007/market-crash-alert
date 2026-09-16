const indicators = [
    {
        name: "HY OAS",
        ticker: "BAMLH0A0HYM2",
        description: "미국 하이일드 채권 스프레드",
        unit: "%",
        decimals: 2
    },
    {
        name: "CCC OAS",
        ticker: "BAMLH0A3HYC",
        description: "CCC 이하 채권 스프레드",
        unit: "%",
        decimals: 2
    },
    {
        name: "VIX",
        ticker: "VIXCLS",
        description: "미국 주식시장 변동성",
        unit: "",
        decimals: 2
    },
    {
        name: "NFCI",
        ticker: "NFCI",
        description: "미국 금융여건",
        unit: "",
        decimals: 2
    },
    {
        name: "10Y - 2Y",
        ticker: "T10Y2Y",
        description: "미국 10년물 - 2년물 금리차",
        unit: "%",
        decimals: 2
    },
    {
        name: "Sahm Rule",
        ticker: "SAHMREALTIME",
        description: "경기침체 조기 신호",
        unit: "%",
        decimals: 2
    }
];

const app = document.getElementById("app");

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

function createCard(indicator, data) {

    const observations = data?.observations || [];

    const latest = observations.length > 0
        ? observations[0]
        : null;

    const value = latest
        ? latest.value
        : null;

    const change5 = getChange(observations, 5);

    const change20 = getChange(observations, 20);

    const status = getStatus(
        indicator,
        value
    );

    return `
        <div class="card">

            <div class="card-title">
                ${indicator.name}
            </div>

            <div class="ticker">
                ${indicator.ticker}
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

            <div class="status ${status.className}">
                ${status.text}
            </div>

            <div class="changes">

                <div class="change-box">
                    <div class="change-label">
                        5일 변화
                    </div>

                    <div class="${getChangeClass(change5)}">
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

                    <div class="${getChangeClass(change20)}">
                        ${formatChange(
                            change20,
                            indicator.decimals,
                            indicator.unit
                        )}
                    </div>
                </div>

            </div>

            <div class="date">
                기준일:
                ${latest ? latest.date : "--"}
            </div>

        </div>
    `;
}

function calculateOverallRisk(allData) {

    let danger = 0;
    let warning = 0;
    let caution = 0;

    indicators.forEach(indicator => {

        const observations =
            allData[indicator.ticker]?.observations || [];

        if (!observations.length) {
            return;
        }

        const value =
            Number(observations[0].value);

        const status =
            getStatus(indicator, value);

        if (status.className === "danger") {
            danger++;
        }

        else if (status.className === "warning") {
            warning++;
        }

        else if (status.className === "caution") {
            caution++;
        }
    });

    if (danger >= 2) {

        return {
            text: "STRESS",
            className: "danger"
        };
    }

    if (
        danger >= 1 ||
        warning >= 2
    ) {

        return {
            text: "WARNING",
            className: "warning"
        };
    }

    if (
        caution >= 2 ||
        warning >= 1
    ) {

        return {
            text: "CAUTION",
            className: "caution"
        };
    }

    return {
        text: "NORMAL",
        className: "safe"
    };
}

async function loadData() {

    try {

        const response = await fetch(
            "data.json?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error(
                "data.json을 불러오지 못했습니다."
            );
        }

        const json =
            await response.json();

        const allData =
            json.data || {};

        const overall =
            calculateOverallRisk(allData);

        app.innerHTML = `

            <div class="overall ${overall.className}">

                <div class="overall-label">
                    종합 금융시장 위험도
                </div>

                <div class="overall-value">
                    ${overall.text}
                </div>

                <div class="overall-time">
                    데이터 업데이트:
                    ${
                        json.updated_at
                            ? new Date(
                                json.updated_at
                            ).toLocaleString("ko-KR")
                            : "--"
                    }
                </div>

            </div>

            <div class="dashboard">

                ${
                    indicators
                        .map(indicator =>
                            createCard(
                                indicator,
                                allData[indicator.ticker]
                            )
                        )
                        .join("")
                }

            </div>

            <div class="source">
                Data source:
                Federal Reserve Bank of St. Louis (FRED)
            </div>
        `;

    }

    catch (error) {

        console.error(error);

        app.innerHTML = `

            <div class="error">

                데이터를 불러오지 못했습니다.

                <br>

                잠시 후 다시 시도해주세요.

            </div>
        `;
    }
}

loadData();
