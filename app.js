const INDICATORS = [
    {
        name: "HY OAS",
        id: "BAMLH0A0HYM2",
        description: "미국 하이일드 회사채 신용스프레드",
        unit: "%",
        decimals: 2,
        group: "credit",
        weight: 28,
        frequency: "일간",
        staleAfterDays: 3,
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
        weight: 18,
        frequency: "일간",
        staleAfterDays: 3,
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
        name: "HY OAS 20일 변화",
        id: "HY_OAS_CHG20",
        description: "하이일드 스프레드의 최근 20관측치 변화폭",
        unit: "%p",
        decimals: 2,
        group: "credit",
        weight: 27,
        frequency: "일간",
        staleAfterDays: 3,
        source: "FRED 파생",
        noMomentum: true,
        sourceMeaning: "HY OAS가 20관측치 전보다 얼마나 벌어졌는지 봅니다. 스프레드의 수준이 아니라 벌어지는 속도입니다. 신용 경색은 수준이 높아지기 전에 속도가 먼저 빨라지는 경우가 있습니다.",
        bands: [
            { min: 0.75, score: 5, status: "extreme", label: "급격한 확대", range: "0.75%p 이상", meaning: "신용스프레드가 20관측치 만에 크게 벌어진 구간입니다." },
            { min: 0.4, score: 4, status: "danger", label: "빠른 확대", range: "0.40%p 이상 ~ 0.75%p 미만", meaning: "신용 경색이 빠르게 진행되는 구간입니다." },
            { min: 0.2, score: 3, status: "warning", label: "확대 경계", range: "0.20%p 이상 ~ 0.40%p 미만", meaning: "스프레드 확대가 뚜렷해지는 구간입니다." },
            { min: 0.08, score: 2, status: "caution", label: "주의", range: "0.08%p 이상 ~ 0.20%p 미만", meaning: "평소보다 확대 속도가 빠른지 확인할 구간입니다." },
            { min: 0, score: 1, status: "safe", label: "보합", range: "0.00%p 이상 ~ 0.08%p 미만", meaning: "스프레드가 거의 변하지 않은 구간입니다." },
            { min: null, score: 0, status: "verylow", label: "축소", range: "0.00%p 미만", meaning: "스프레드가 좁아져 신용 스트레스가 완화되는 구간입니다." }
        ]
    },
    {
        name: "CCC − HY 격차",
        id: "CCC_HY_GAP",
        description: "CCC OAS에서 HY OAS를 뺀 취약기업 할증",
        unit: "%p",
        decimals: 2,
        group: "credit",
        weight: 27,
        frequency: "일간",
        staleAfterDays: 3,
        source: "FRED 파생",
        sourceMeaning: "CCC급과 하이일드 전체의 스프레드 차이입니다. 격차가 벌어지면 신용시장 안에서도 가장 취약한 기업만 따로 버티기 어려워진다는 뜻이며, HY OAS 평균에 가려진 스트레스를 드러냅니다.",
        bands: [
            { min: 9, score: 5, status: "extreme", label: "극단 위험", range: "9.00%p 이상", meaning: "최취약 기업의 자금조달 여건이 시장 평균과 크게 벌어진 구간입니다." },
            { min: 7.5, score: 4, status: "danger", label: "고위험", range: "7.50%p 이상 ~ 9.00%p 미만", meaning: "저신용 기업만의 스트레스가 뚜렷하게 커진 구간입니다." },
            { min: 6.5, score: 3, status: "warning", label: "경계", range: "6.50%p 이상 ~ 7.50%p 미만", meaning: "신용시장 내부의 양극화가 진행되는지 볼 구간입니다." },
            { min: 5.5, score: 2, status: "caution", label: "주의", range: "5.50%p 이상 ~ 6.50%p 미만", meaning: "평상시보다 격차가 다소 벌어진 구간입니다." },
            { min: 4.75, score: 1, status: "safe", label: "보통", range: "4.75%p 이상 ~ 5.50%p 미만", meaning: "격차가 평범한 범위에 있는 구간입니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "4.75%p 미만", meaning: "취약기업 할증이 오히려 좁은 구간입니다." }
        ]
    },
    {
        name: "VIX",
        id: "VIXCLS",
        description: "S&P 500 옵션 기반 기대 변동성 지수",
        unit: "",
        decimals: 2,
        group: "market",
        weight: 50,
        frequency: "일간",
        staleAfterDays: 3,
        source: "FRED · CBOE",
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
        name: "VIX 기간구조(3M/1M)",
        id: "VIX_TERM",
        description: "3개월 VIX를 1개월 VIX로 나눈 기간구조 비율",
        unit: "",
        decimals: 2,
        group: "market",
        weight: 50,
        frequency: "일간",
        staleAfterDays: 3,
        source: "CBOE",
        inverse: true,
        sourceMeaning: "3개월 기대변동성(VIX3M)을 1개월 기대변동성(VIX)으로 나눈 값입니다. 평상시에는 3개월이 더 높아 1을 넘지만(콘탱고), 단기 스트레스가 커지면 1 아래로 내려갑니다(역전). 역전은 시장이 먼 미래보다 당장의 위험을 더 크게 보고 있다는 뜻입니다.",
        bands: [
            { max: 0.85, score: 5, status: "extreme", label: "깊은 역전", range: "0.85 이하", meaning: "단기 기대변동성이 3개월보다 크게 높은 급성 스트레스 구간입니다." },
            { max: 0.93, score: 4, status: "danger", label: "강한 역전", range: "0.85 초과 ~ 0.93 이하", meaning: "기간구조가 뚜렷하게 역전되어 단기 위험 회피가 강한 구간입니다." },
            { max: 1, score: 3, status: "warning", label: "역전 임박", range: "0.93 초과 ~ 1.00 이하", meaning: "1개월 변동성이 3개월에 근접했거나 역전된 구간입니다." },
            { max: 1.06, score: 2, status: "caution", label: "평탄", range: "1.00 초과 ~ 1.06 이하", meaning: "기간구조가 평탄해져 단기 불안이 커지는지 확인할 구간입니다." },
            { max: 1.18, score: 1, status: "safe", label: "보통", range: "1.06 초과 ~ 1.18 이하", meaning: "일반적인 콘탱고 범위입니다." },
            { max: null, score: 0, status: "verylow", label: "가파른 콘탱고", range: "1.18 초과", meaning: "단기 불안이 낮아 기간구조가 가파른 구간입니다." }
        ]
    },
    {
        name: "NFCI",
        id: "NFCI",
        description: "미국 금융여건 지수",
        unit: "",
        decimals: 2,
        group: "financial",
        weight: 60,
        frequency: "주간",
        staleAfterDays: 10,
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
        name: "SOFR − IORB (5일 평균)",
        id: "SOFR_IORB_MA5",
        description: "미국 단기 자금조달 금리(SOFR)와 정책금리(IORB)의 5일 평균 격차",
        unit: "bp",
        decimals: 1,
        group: "financial",
        weight: 40,
        frequency: "일간",
        staleAfterDays: 3,
        source: "FRED 파생",
        sourceMeaning: "지급준비금 잔액에 붙는 이자율(IORB)과 익일물 환매조건부 거래 금리(SOFR)의 차이입니다. 평상시에는 SOFR이 조금 낮아 음수로 유지되는데, 양수로 벌어지면 은행들이 준비금을 담보로 자금을 빌려야 할 만큼 단기 유동성 수요가 커졌다는 뜻입니다. 월말·분기말 하루 이틀짜리 튐을 거르려고 5관측치 평균을 씁니다.",
        bands: [
            { min: 20, score: 5, status: "extreme", label: "극단 위험", range: "20bp 이상", meaning: "자금조달 금리가 정책금리를 크게 웃돌아 단기 유동성 경색이 뚜렷한 구간입니다." },
            { min: 10, score: 4, status: "danger", label: "고위험", range: "10bp 이상 ~ 20bp 미만", meaning: "유동성 수요가 강해져 자금시장 경색 위험이 커진 구간입니다." },
            { min: 5, score: 3, status: "warning", label: "경계", range: "5bp 이상 ~ 10bp 미만", meaning: "자금조달 금리가 정책금리 위로 벌어져 유동성 여건이 조여드는 구간입니다." },
            { min: 2, score: 2, status: "caution", label: "주의", range: "2bp 이상 ~ 5bp 미만", meaning: "평상시보다 조금 높은 구간입니다. 월말·분기말 자금 수요인지 추세인지 확인해야 합니다." },
            { min: 0, score: 1, status: "safe", label: "보통", range: "0bp 이상 ~ 2bp 미만", meaning: "정책금리 아래 또는 바로 위에서 보통 범위로 움직이는 구간입니다." },
            { min: null, score: 0, status: "verylow", label: "낮음", range: "0bp 미만", meaning: "자금이 남아도는 구간입니다. 지표 수준만 보면 유동성 스트레스가 낮습니다." }
        ]
    },
    {
        name: "10Y - 2Y",
        id: "T10Y2Y",
        description: "미국 10년물 - 2년물 국채금리 차이",
        unit: "%p",
        decimals: 2,
        group: "recession",
        weight: 30,
        frequency: "일간",
        staleAfterDays: 3,
        inverse: true,
        sourceMeaning: "장기 국채금리에서 단기 국채금리를 뺀 값입니다. 역전은 경기침체 위험의 역사적 신호였지만, 단독으로 시점이나 침체를 확정할 수 없습니다. 역전 해소 과정도 함께 관찰해야 합니다.",
        bands: [
            { max: -1, score: 5, status: "extreme", label: "깊은 역전", range: "-1.00%p 이하", meaning: "금리차가 크게 역전된 상태입니다. 침체 시점은 이 지표만으로 판단할 수 없습니다." },
            { max: -0.5, score: 4, status: "danger", label: "강한 역전", range: "-1.00%p 초과 ~ -0.50%p 이하", meaning: "수익률곡선 역전이 뚜렷한 구간입니다." },
            { max: 0, score: 3, status: "warning", label: "역전", range: "-0.50%p 초과 ~ 0.00%p 미만", meaning: "단기금리가 장기금리보다 높은 역전 구간입니다." },
            { max: 0.25, score: 2, status: "caution", label: "역전 해소·평탄", range: "0.00%p 이상 ~ 0.25%p 미만", meaning: "금리차가 양수로 돌아섰거나 0 부근입니다. 역전 해소가 항상 경기 개선을 뜻하지는 않습니다." },
            { max: 0.75, score: 1, status: "safe", label: "완만한 정상화", range: "0.25%p 이상 ~ 0.75%p 미만", meaning: "장단기 금리차가 양수인 구간입니다. 변화 속도와 경기 데이터를 함께 봐야 합니다." },
            { max: null, score: 0, status: "verylow", label: "양의 금리차", range: "0.75%p 이상", meaning: "금리차가 비교적 큰 양수입니다. 이것만으로 경기 위험이 없다고 단정할 수 없습니다." }
        ]
    },
    {
        name: "10Y - 3M",
        id: "T10Y3M",
        description: "미국 10년물 - 3개월물 국채금리 차이",
        unit: "%p",
        decimals: 2,
        group: "recession",
        weight: 30,
        frequency: "일간",
        staleAfterDays: 3,
        inverse: true,
        sourceMeaning: "뉴욕 연준의 경기침체 확률 모형에 쓰이는 장단기 금리차입니다. 2년물보다 단기인 3개월물과 비교하므로 역전과 해소가 조금 더 빠르게 나타나는 경우가 있습니다.",
        bands: [
            { max: -1, score: 5, status: "extreme", label: "깊은 역전", range: "-1.00%p 이하", meaning: "3개월물이 10년물보다 크게 높은 역전 상태입니다." },
            { max: -0.5, score: 4, status: "danger", label: "강한 역전", range: "-1.00%p 초과 ~ -0.50%p 이하", meaning: "단기금리 급등으로 금리차 역전이 뚜렷한 구간입니다." },
            { max: 0, score: 3, status: "warning", label: "역전", range: "-0.50%p 초과 ~ 0.00%p 미만", meaning: "금리차가 역전된 구간입니다." },
            { max: 0.25, score: 2, status: "caution", label: "역전 해소·평탄", range: "0.00%p 이상 ~ 0.25%p 미만", meaning: "0 부근이거나 막 양수로 돌아선 구간입니다." },
            { max: 1.0, score: 1, status: "safe", label: "완만한 정상화", range: "0.25%p 이상 ~ 1.00%p 미만", meaning: "금리차가 양수인 구간입니다." },
            { max: null, score: 0, status: "verylow", label: "양의 금리차", range: "1.00%p 이상", meaning: "금리차가 비교적 큰 양수입니다. 단독으로 경기 위험이 없다고 단정할 수 없습니다." }
        ]
    },
    {
        name: "Sahm Rule",
        id: "SAHMREALTIME",
        description: "실업률 상승 기반 경기침체 지표",
        unit: "%p",
        decimals: 2,
        group: "recession",
        weight: 40,
        frequency: "월간",
        staleAfterDays: 45,
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

const GROUP_CONFIG = {
    credit: { label: "신용 위험", weight: 32 },
    market: { label: "시장 스트레스", weight: 22 },
    financial: { label: "금융여건", weight: 16 },
    recession: { label: "경기침체 신호", weight: 30 }
};

/*
   위험지수 구성
   - 수준(level): 절대 임계 구간(bands) 점수
   - 상대수준(percentile): 5~20년 이력에서의 백분위
   - 속도(momentum): 5·20관측치 변화량을 이력 표준편차로 나눈 z값
*/
const RISK_MODEL = {
    levelWeight: 0.55,
    percentileWeight: 0.45,
    percentileLow: 0.60,
    percentileHigh: 0.95,
    momentumWeight: 0.10,
    momentumCap: 2.5,
    momentumSteps: [
        { step: 5, weight: 0.50 },
        { step: 20, weight: 0.35 }
    ]
};

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


function getLatestObservation(id, offset = 0) {

    const observations =
        getObservations(id);

    if (!observations.length) {
        return null;
    }

    return observations[offset] || null;
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


// 지표별 표시 점수는 절대 임계 구간(0~5점)만 사용한다.
// 상대 백분위와 변화 속도는 전체 위험지수 계산에 반영한다(아래 getIndicatorContribution).
function getIndicatorRiskScore(indicator, value) {
    const band = getRiskBand(value, indicator);
    return band ? band.score : null;
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


function getCalibration(id) {
    if (!marketData || !marketData.data || !marketData.data[id]) return null;
    const calibration = marketData.data[id].calibration;
    if (!calibration || !Array.isArray(calibration.quantiles) || calibration.quantiles.length < 2) {
        return null;
    }
    return calibration;
}


function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}


// 보정용 분위값(quantiles)으로 현재 값의 위치를 0~1 백분위로 환산한다.
function percentileOf(calibration, value) {
    const points = calibration.quantiles;
    if (!Number.isFinite(value) || !points || points.length < 2) return null;
    if (value <= points[0][1]) return 0.005;
    if (value >= points[points.length - 1][1]) return 0.995;

    for (let index = 1; index < points.length; index++) {
        if (value <= points[index][1]) {
            const [lowP, lowV] = points[index - 1];
            const [highP, highV] = points[index];
            const span = highV - lowV;
            const ratio = span === 0 ? 0.5 : (value - lowV) / span;
            return lowP + (highP - lowP) * ratio;
        }
    }

    return 0.995;
}


// 위험 방향 백분위. inverse 지표는 백분위를 뒤집는다.
function riskPercentile(indicator, value) {
    const calibration = getCalibration(indicator.id);
    if (!calibration) return null;
    const raw = percentileOf(calibration, Number(value));
    if (raw === null) return null;
    return indicator.inverse ? 1 - raw : raw;
}


function normalizePercentile(percentile) {
    const span = RISK_MODEL.percentileHigh - RISK_MODEL.percentileLow;
    if (!span) return 0;
    return clamp01((percentile - RISK_MODEL.percentileLow) / span);
}


// 5·20관측치 변화가 이력 표준편차 대비 얼마나 큰지(z). 위험 방향이 양수.
function momentumZ(indicator, offset = 0) {
    // 이미 "변화량"인 지표는 속도를 다시 계산하지 않는다(이중 계산 방지).
    if (indicator.noMomentum) return 0;

    const observations = getObservations(indicator.id);
    const calibration = getCalibration(indicator.id);
    const latest = observations[offset];
    if (!latest) return 0;

    const latestValue = Number(latest.value);
    if (!Number.isFinite(latestValue)) return 0;

    const direction = indicator.inverse ? -1 : 1;
    const changes = (calibration && calibration.change) || {};
    let weighted = 0;
    let weightUsed = 0;

    for (const { step, weight } of RISK_MODEL.momentumSteps) {
        const previous = observations[offset + step];
        if (!previous) continue;
        const previousValue = Number(previous.value);
        if (!Number.isFinite(previousValue)) continue;
        const stats = changes[String(step)];
        const deviation = Number(stats && stats.std);
        if (!Number.isFinite(deviation) || deviation <= 0) continue;
        weighted += weight * ((direction * (latestValue - previousValue)) / deviation);
        weightUsed += weight;
    }

    if (!weightUsed) return 0;
    const z = weighted / weightUsed;
    return Math.max(-RISK_MODEL.momentumCap, Math.min(RISK_MODEL.momentumCap, z));
}


// 지표 하나의 위험 기여도(0~1) = 수준 55% + 상대 백분위 45%.
function getIndicatorContribution(indicator, offset = 0) {
    const observations = getObservations(indicator.id);
    const observation = observations[offset];
    if (!observation) return null;

    const value = Number(observation.value);
    if (!Number.isFinite(value)) return null;

    const band = getRiskBand(value, indicator);
    const level = band ? band.score / 5 : null;
    const percentile = riskPercentile(indicator, value);
    const relative = percentile === null ? null : normalizePercentile(percentile);

    let contribution;
    if (level !== null && relative !== null) {
        contribution = RISK_MODEL.levelWeight * level + RISK_MODEL.percentileWeight * relative;
    } else if (level !== null) {
        contribution = level;
    } else if (relative !== null) {
        contribution = relative;
    } else {
        return null;
    }

    return {
        indicator,
        observation,
        latest: observation,
        value,
        band,
        score: band ? band.score : null,
        level,
        percentile,
        contribution: clamp01(contribution),
        momentum: momentumZ(indicator, offset)
    };
}


function applyMomentum(base, momentum) {
    const value = 100 * base * (1 + RISK_MODEL.momentumWeight * momentum);
    return Math.round(Math.max(0, Math.min(100, value)));
}


function blendItems(items) {
    let weightSum = 0;
    let contributionSum = 0;
    let momentumSum = 0;

    for (const item of items) {
        const weight = Number(item.indicator.weight) || 1;
        weightSum += weight;
        contributionSum += weight * item.contribution;
        momentumSum += weight * item.momentum;
    }

    if (!weightSum) return { base: 0, momentum: 0, score: 0 };

    const base = contributionSum / weightSum;
    const momentum = momentumSum / weightSum;
    return { base, momentum, score: applyMomentum(base, momentum) };
}


function buildRiskState(offsetFor) {
    const items = [];

    for (const indicator of INDICATORS) {
        const offset = offsetFor ? offsetFor(indicator) : 0;
        if (offset === null || offset === undefined) continue;
        const item = getIndicatorContribution(indicator, offset);
        if (item) items.push(item);
    }

    if (!items.length) {
        return { score: null, base: null, momentum: 0, availableCount: 0, groups: {}, details: [] };
    }

    const groups = {};
    for (const [key, config] of Object.entries(GROUP_CONFIG)) {
        const groupItems = items.filter(item => item.indicator.group === key);
        if (!groupItems.length) {
            groups[key] = { ...config, base: null, momentum: 0, score: null, availableCount: 0 };
            continue;
        }
        const blended = blendItems(groupItems);
        groups[key] = {
            ...config,
            base: blended.base,
            momentum: blended.momentum,
            score: blended.score,
            availableCount: groupItems.length
        };
    }

    let weightSum = 0;
    let baseSum = 0;
    let momentumSum = 0;
    for (const [key, config] of Object.entries(GROUP_CONFIG)) {
        const group = groups[key];
        if (!group || group.score === null) continue;
        weightSum += config.weight;
        baseSum += config.weight * group.base;
        momentumSum += config.weight * group.momentum;
    }

    if (!weightSum) {
        return { score: null, base: null, momentum: 0, availableCount: items.length, groups, details: items };
    }

    const base = baseSum / weightSum;
    const momentum = momentumSum / weightSum;

    return {
        score: applyMomentum(base, momentum),
        base,
        momentum,
        availableCount: items.length,
        groups,
        details: items
    };
}


function calculateRiskDetails(offsetFor) {
    return buildRiskState(offsetFor);
}


function calculateRisk() {
    return calculateRiskDetails().score;
}


function overallStatus(score) {
    if (score === null || score === undefined) return "unknown";
    if (score >= 75) return "extreme";
    if (score >= 62) return "danger";
    if (score >= 48) return "warning";
    if (score >= 34) return "caution";
    if (score >= 20) return "safe";
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
                    ${details.availableCount}/${INDICATORS.length}개 지표 사용
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
                                ${indicator.source || "FRED"} · ${indicator.id}
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
   전체 위험지수 기록 (data.json 이력으로 계산)
========================= */
let riskHistoryCache = null;


// 각 지표에서 "해당 날짜까지 알려진 마지막 값"의 인덱스(최신순 배열 기준).
function computeAsOfOffsets(gridDates, observations) {
    const offsets = new Array(gridDates.length).fill(null);
    if (!observations.length) return offsets;

    let pointer = observations.length - 1;

    for (let index = gridDates.length - 1; index >= 0; index--) {
        const day = gridDates[index];
        while (pointer > 0 && observations[pointer - 1].date <= day) {
            pointer--;
        }
        offsets[index] = observations[pointer].date <= day ? pointer : null;
    }

    return offsets;
}


// 과거 5년의 위험지수를 매일 같은 규칙으로 다시 계산한다.
// 기기 저장소에 의존하지 않으므로 설치 직후에도 7일·30일 변화가 나온다.
function computeRiskHistory() {
    if (riskHistoryCache) return riskHistoryCache;

    const grid = getObservations("VIXCLS").length
        ? getObservations("VIXCLS")
        : INDICATORS.length ? getObservations(INDICATORS[0].id) : [];

    if (!grid.length) {
        riskHistoryCache = [];
        return riskHistoryCache;
    }

    const gridDates = grid.map(item => item.date);
    const offsets = {};
    for (const indicator of INDICATORS) {
        offsets[indicator.id] = computeAsOfOffsets(gridDates, getObservations(indicator.id));
    }

    const history = [];

    for (let index = gridDates.length - 1; index >= 0; index--) {
        const state = buildRiskState(indicator => offsets[indicator.id][index]);
        if (state.score === null) continue;
        history.push({ date: gridDates[index], score: state.score });
    }

    riskHistoryCache = history;
    return history;
}


function getHistoryChange(history, days) {
    if (history.length < 2) return null;
    const latest = history[history.length - 1];
    const target = new Date(`${latest.date}T12:00:00Z`);
    target.setUTCDate(target.getUTCDate() - days);
    const targetString = target.toISOString().slice(0, 10);
    const previous = [...history].reverse().find(item => item.date <= targetString);
    if (!previous || previous.date === latest.date) return null;
    const elapsed = (new Date(`${latest.date}T12:00:00Z`) - new Date(`${previous.date}T12:00:00Z`)) / 86400000;
    if (elapsed < Math.max(1, days - 3)) return null;
    return { delta: Number(latest.score) - Number(previous.score), fromDate: previous.date, toDate: latest.date };
}

function formatRiskDelta(change) {
    if (!change) return "기록 축적 중";
    const sign = change.delta > 0 ? "+" : "";
    const label = change.delta > 0 ? "위험 상승" : change.delta < 0 ? "위험 하락" : "변화 없음";
    return `${sign}${change.delta}점 · ${label}`;
}

function renderRiskHistoryHTML(score) {
    const history = computeRiskHistory();
    const last = history[history.length - 1];
    const c7 = getHistoryChange(history, 7);
    const c30 = getHistoryChange(history, 30);
    let sparkline = "";
    if (history.length >= 2) {
        const points = history.slice(-90);
        const vals = points.map(p => Number(p.score));
        const min = Math.min(...vals), max = Math.max(...vals);
        const range = Math.max(1, max - min);
        const coords = vals.map((v,i) => `${8 + i * (284 / Math.max(1, vals.length-1))},${48 - ((v-min)/range)*38}`).join(" ");
        sparkline = `<svg class="risk-history-chart" viewBox="0 0 300 56" role="img" aria-label="최근 위험지수 기록 그래프"><polyline points="${coords}" fill="none" stroke="#f0c75e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="49" x2="292" y2="49" stroke="#31435e" stroke-width="1"/></svg>`;
    }
    return `
        <section class="risk-history-card">
            <div class="risk-history-title">전체 위험지수 추적</div>
            <div class="risk-history-scoreline"><strong>${score === null ? "—" : score}</strong><span>/100</span><small>${last ? `기준일 ${formatDate(last.date)}` : "기록 대기"}</small></div>
            ${sparkline || `<p class="risk-history-note">위험지수 추세를 계산할 이력이 부족합니다.</p>`}
            <div class="risk-history-grid">
                <div><span>최근 7일 변화</span><strong>${formatRiskDelta(c7)}</strong></div>
                <div><span>최근 30일 변화</span><strong>${formatRiskDelta(c30)}</strong></div>
            </div>
            <p class="risk-history-note">이 기록은 data.json의 5년 이력에 지금과 같은 계산 규칙을 적용해 매번 다시 계산합니다. 기기와 관계없이 같은 값이 보이며, 변화는 폭락 확률이나 매매 신호가 아닙니다.</p>
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
                <div><span>최근 5개 관측치 기준 악화</span><strong>${worsening.length}/${INDICATORS.length}개</strong></div>
                <div><span>위험등급 3/5 이상 3회 연속</span><strong>${persistent.length}/${INDICATORS.length}개</strong></div>
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
                        <div class="risk-ticker">${indicator.source || "FRED"} · ${indicator.id} · ${indicator.frequency}</div>
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
                    전체 가중치: 신용 32% · 시장 스트레스 22% · 금융여건 16% · 경기침체 신호 30%.
                    지표별 점수는 절대 임계 구간의 0~5점이며, 전체 위험지수는 여기에
                    5~20년 이력 백분위를 45% 비중으로 더한 기본 점수에
                    5·20관측치 변화 속도로 최대 ±25%를 가감해 만듭니다.
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

        let payload =
            normalizeMarketData(
                await fetchJson("./data.json")
            );

        if (!hasAllSeries(payload)) {
            try {
                const snapshot =
                    normalizeMarketData(
                        await fetchJson("./data-snapshot.json")
                    );
                payload = mergePayload(payload, snapshot);
            } catch (error) {
                console.warn("스냅숏 데이터를 읽지 못했습니다:", error);
            }
        }

        marketData = payload;

        window.marketDataUpdatedAt =
            marketData.updated_at;

        riskHistoryCache = null;

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
   데이터 형식 정규화
========================= */

async function fetchJson(url) {

    const response =
        await fetch(
            url,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );
    }

    return response.json();
}


// 모든 지표(관측치·백분위 보정값)가 들어 있는지 확인한다.
function hasAllSeries(payload) {

    if (!payload || !payload.data) return false;

    return INDICATORS.every(indicator => {

        const block = payload.data[indicator.id];
        const observations = block && block.observations;

        if (!Array.isArray(observations) || observations.length < 30) {
            return false;
        }

        return Boolean(block.calibration && Array.isArray(block.calibration.quantiles));
    });
}


// 기본 데이터에 빠진 지표는 마지막 완전 수집분(data-snapshot.json)으로 메운다.
function mergePayload(primary, snapshot) {

    if (!snapshot || !snapshot.data) return primary;

    const merged = Object.assign({}, snapshot, primary);

    merged.data = Object.assign({}, snapshot.data);

    for (const [id, block] of Object.entries(primary.data || {})) {
        const fallback = snapshot.data[id];
        if (!fallback) {
            merged.data[id] = block;
            continue;
        }
        merged.data[id] = Object.assign({}, fallback, block);
        if (!block.calibration && fallback.calibration) {
            merged.data[id].calibration = fallback.calibration;
        }
    }

    return merged;
}


/*
   data.json v2는 관측치를 ["YYYY-MM-DD", 값] 배열로 저장한다(전송량 절감).
   예전 형식({"date":…,"value":…})도 그대로 읽을 수 있게 맞춰 준다.
*/
function normalizeMarketData(payload) {

    if (!payload || typeof payload !== "object") {
        return payload;
    }

    const data = payload.data || {};

    for (const id of Object.keys(data)) {

        const block = data[id];
        if (!block || !Array.isArray(block.observations)) continue;

        block.observations = block.observations
            .map(item => {
                if (Array.isArray(item)) {
                    return { date: item[0], value: Number(item[1]) };
                }
                if (item && typeof item === "object") {
                    return { date: item.date, value: Number(item.value) };
                }
                return null;
            })
            .filter(item => item && item.date && Number.isFinite(item.value))
            .sort((a, b) => b.date.localeCompare(a.date));
    }

    return payload;
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
