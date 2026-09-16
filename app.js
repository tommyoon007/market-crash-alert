const indicators = [
    {
        name: "HY OAS",
        ticker: "BAMLH0A0HYM2",
        description: "미국 하이일드 채권 스프레드"
    },
    {
        name: "CCC OAS",
        ticker: "BAMLH0A3HYC",
        description: "CCC 이하 채권 스프레드"
    },
    {
        name: "VIX",
        ticker: "VIXCLS",
        description: "미국 주식시장 변동성"
    },
    {
        name: "NFCI",
        ticker: "NFCI",
        description: "미국 금융여건"
    },
    {
        name: "10Y - 2Y",
        ticker: "T10Y2Y",
        description: "미국 10년물 - 2년물 금리차"
    },
    {
        name: "Sahm Rule",
        ticker: "SAHMREALTIME",
        description: "경기침체 조기 신호"
    }
];

const app = document.getElementById("app");

app.innerHTML = `
    <div class="dashboard">
        ${indicators.map(item => `
            <div class="card">
                <div class="card-title">${item.name}</div>
                <div class="ticker">${item.ticker}</div>
                <div class="description">${item.description}</div>
                <div class="value">--</div>
                <div class="status">데이터 준비 중</div>
            </div>
        `).join("")}
    </div>
`;
