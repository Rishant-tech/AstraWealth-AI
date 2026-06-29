package model

type Stock struct {
	Symbol           string  `json:"symbol"`
	Name             string  `json:"name"`
	CurrentPrice     float64 `json:"currentPrice"`
	Return1D         float64 `json:"return1D"`
	Return1M         float64 `json:"return1M"`
	Return6M         float64 `json:"return6M"`
	Return1Y         float64 `json:"return1Y"`
	PERatio          float64 `json:"peRatio"`
	PBRatio          float64 `json:"pbRatio"`
	ROE              float64 `json:"roe"`
	ROCE             float64 `json:"roce"`
	DebtToEquity     float64 `json:"debtToEquity"`
	RevenueGrowth    float64 `json:"revenueGrowth"`
	ProfitGrowth     float64 `json:"profitGrowth"`
	PromoterHolding  float64 `json:"promoterHolding"`
	FIIDIITrend      string  `json:"fiiDiiTrend"`
	NewsSentiment    string  `json:"newsSentiment"`
	MovingAverage50  float64 `json:"movingAverage50"`
	MovingAverage200 float64 `json:"movingAverage200"`
	Sector           string  `json:"sector"`
	DataSource       string  `json:"dataSource,omitempty"`
	LastUpdated      string  `json:"lastUpdated,omitempty"`
}

type Fund struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Category      string  `json:"category"`
	NAV           float64 `json:"nav"`
	Return1Y      float64 `json:"return1Y"`
	Return3Y      float64 `json:"return3Y"`
	Return5Y      float64 `json:"return5Y"`
	ExpenseRatio  float64 `json:"expenseRatio"`
	AUM           float64 `json:"aum"`
	RiskLevel     string  `json:"riskLevel"`
	SharpeRatio   float64 `json:"sharpeRatio"`
	Alpha         float64 `json:"alpha"`
	Beta          float64 `json:"beta"`
	RollingReturn float64 `json:"rollingReturn"`
	MaxDrawdown   float64 `json:"maxDrawdown"`
	FundManager   string  `json:"fundManager"`
	SuitableFor   string  `json:"suitableFor"`
}

type ScoreBreakdown map[string]int

type ProjectionPoint struct {
	Year int     `json:"year"`
	Bear float64 `json:"bear"`
	Base float64 `json:"base"`
	Bull float64 `json:"bull"`
}

type StockAnalysis struct {
	Stock          Stock             `json:"stock"`
	Score          int               `json:"score"`
	Label          string            `json:"label"`
	Breakdown      ScoreBreakdown    `json:"breakdown"`
	BullCase       []string          `json:"bullCase"`
	BearCase       []string          `json:"bearCase"`
	RiskFactors    []string          `json:"riskFactors"`
	TechnicalTrend string            `json:"technicalTrend"`
	Projections    []ProjectionPoint `json:"projections"`
	Explanation    string            `json:"explanation"`
	Disclaimer     string            `json:"disclaimer"`
}

type FundAnalysis struct {
	Fund                   Fund           `json:"fund"`
	Score                  int            `json:"score"`
	Breakdown              ScoreBreakdown `json:"breakdown"`
	SuggestedAllocationPct int            `json:"suggestedAllocationPct"`
	Pros                   []string       `json:"pros"`
	Cons                   []string       `json:"cons"`
	SuitableInvestorType   string         `json:"suitableInvestorType"`
	Explanation            string         `json:"explanation"`
	Disclaimer             string         `json:"disclaimer"`
}

type Commodity struct {
	Name                   string            `json:"name"`
	Trend                  string            `json:"trend"`
	Return1Y               float64           `json:"return1Y"`
	RiskScore              int               `json:"riskScore"`
	SuggestedMaxAllocation int               `json:"suggestedMaxAllocation"`
	ScenarioProjections    []ProjectionPoint `json:"scenarioProjections"`
	Notes                  []string          `json:"notes"`
}

type CommoditiesAnalysis struct {
	Gold                   Commodity `json:"gold"`
	Silver                 Commodity `json:"silver"`
	FOMOWarning            string    `json:"fomoWarning"`
	DiversificationWarning string    `json:"diversificationWarning"`
	Disclaimer             string    `json:"disclaimer"`
}

type PortfolioPlanRequest struct {
	TotalInvestment          float64 `json:"totalInvestment"`
	EmergencyFundRequirement float64 `json:"emergencyFundRequirement"`
	TimeHorizonYears         int     `json:"timeHorizonYears"`
	RiskAppetite             string  `json:"riskAppetite"`
	Goal                     string  `json:"goal"`
	InvestmentMode           string  `json:"investmentMode"`
}

type AllocationItem struct {
	Asset     string  `json:"asset"`
	Percent   float64 `json:"percent"`
	Amount    float64 `json:"amount"`
	Rationale string  `json:"rationale"`
	RiskNote  string  `json:"riskNote"`
}

type PortfolioPlan struct {
	Score               int               `json:"score"`
	SuggestedAllocation []AllocationItem  `json:"suggestedAllocation"`
	DeploymentPlan      []string          `json:"deploymentPlan"`
	PhasedSchedule      []string          `json:"phasedSchedule"`
	Projections         []ProjectionPoint `json:"projections"`
	RebalancingRules    []string          `json:"rebalancingRules"`
	RiskExplanation     string            `json:"riskExplanation"`
	ScoreBreakdown      ScoreBreakdown    `json:"scoreBreakdown"`
	Disclaimer          string            `json:"disclaimer"`
}

type ExplainRequest struct {
	Topic   string `json:"topic"`
	Context string `json:"context"`
}

type ExplainResponse struct {
	Explanation string `json:"explanation"`
	Source      string `json:"source"`
	Disclaimer  string `json:"disclaimer"`
}
