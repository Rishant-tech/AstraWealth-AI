package service

import (
	"fmt"
	"math"
	"strings"

	"astrawealth-ai/backend/internal/ai"
	"astrawealth-ai/backend/internal/model"
	"astrawealth-ai/backend/internal/projection"
	"astrawealth-ai/backend/internal/repository"
	"astrawealth-ai/backend/internal/scoring"
)

type AnalysisService struct {
	repo      repository.Repository
	explainer *ai.Explainer
}

func NewAnalysisService(repo repository.Repository, explainer *ai.Explainer) *AnalysisService {
	return &AnalysisService{repo: repo, explainer: explainer}
}

func (s *AnalysisService) SearchStocks(query string) []model.Stock {
	return s.repo.SearchStocks(query)
}

func (s *AnalysisService) StockAnalysis(symbol string) (model.StockAnalysis, error) {
	stock, err := s.repo.GetStock(symbol)
	if err != nil {
		return model.StockAnalysis{}, err
	}
	score, breakdown := scoring.Stock(stock)
	explanation, _ := s.explainer.Explain(stock.Symbol, "valuation, profitability, growth, debt, technical trend, and sentiment inputs")
	return model.StockAnalysis{
		Stock:          stock,
		Score:          score,
		Label:          scoring.Label(score),
		Breakdown:      breakdown,
		BullCase:       stockBullCase(stock),
		BearCase:       stockBearCase(stock),
		RiskFactors:    stockRisks(stock),
		TechnicalTrend: technicalTrend(stock),
		Projections:    projection.Stock(stock.CurrentPrice),
		Explanation:    explanation,
		Disclaimer:     ai.Disclaimer,
	}, nil
}

func (s *AnalysisService) SearchFunds(query string) []model.Fund {
	return s.repo.SearchFunds(query)
}

func (s *AnalysisService) FundAnalysis(id string) (model.FundAnalysis, error) {
	fund, err := s.repo.GetFund(id)
	if err != nil {
		return model.FundAnalysis{}, err
	}
	score, breakdown := scoring.Fund(fund)
	explanation, _ := s.explainer.Explain(fund.Name, "return consistency, costs, risk-adjusted return, drawdown, AUM, and category fit")
	return model.FundAnalysis{
		Fund:                   fund,
		Score:                  score,
		Breakdown:              breakdown,
		SuggestedAllocationPct: suggestedFundAllocation(fund.RiskLevel, score),
		Pros:                   fundPros(fund),
		Cons:                   fundCons(fund),
		SuitableInvestorType:   fund.SuitableFor,
		Explanation:            explanation,
		Disclaimer:             ai.Disclaimer,
	}, nil
}

func (s *AnalysisService) Commodities() model.CommoditiesAnalysis {
	return model.CommoditiesAnalysis{
		Gold: model.Commodity{
			Name:                   "Gold",
			CurrentPrice:           100000,
			Trend:                  "Constructive hedge trend with valuation sensitivity",
			Return1Y:               16.8,
			RiskScore:              42,
			SuggestedMaxAllocation: 12,
			ScenarioProjections:    projection.Commodity(100000, true),
			Notes: []string{
				"Useful as a portfolio hedge during currency or equity stress.",
				"Avoid increasing allocation only after sharp price moves.",
			},
			DataSource:  "commodity-model",
			LastUpdated: "daily model",
		},
		Silver: model.Commodity{
			Name:                   "Silver",
			CurrentPrice:           100000,
			Trend:                  "Higher volatility with industrial demand linkage",
			Return1Y:               19.2,
			RiskScore:              61,
			SuggestedMaxAllocation: 6,
			ScenarioProjections:    projection.Commodity(100000, false),
			Notes: []string{
				"Can diversify commodities exposure but drawdowns may be deeper than gold.",
				"Best treated as a smaller satellite allocation.",
			},
			DataSource:  "commodity-model",
			LastUpdated: "daily model",
		},
		FOMOWarning:            "Do not chase gold or silver after large moves. Use target allocation bands and rebalance gradually.",
		DiversificationWarning: "Commodities can reduce portfolio concentration but should not replace emergency funds, debt buffers, or diversified equity.",
		Disclaimer:             ai.Disclaimer,
	}
}

func (s *AnalysisService) PortfolioPlan(req model.PortfolioPlanRequest) model.PortfolioPlan {
	amount := investableAmount(req)
	allocations := buildAllocation(req.RiskAppetite, amount)
	score, breakdown := scoring.Portfolio(req.RiskAppetite, req.TimeHorizonYears, allocations, req.EmergencyFundRequirement > 0)
	projections := projection.Amount(amount, max(req.TimeHorizonYears, 1), 0.02, 0.09, 0.14)
	if strings.EqualFold(req.InvestmentMode, "SIP") {
		projections = projection.SIP(monthlySIPAmount(req), max(req.TimeHorizonYears, 1), 0.02, 0.09, 0.14)
	}

	return model.PortfolioPlan{
		Score:               score,
		SuggestedAllocation: allocations,
		DeploymentPlan:      deploymentPlan(req.InvestmentMode, req.RiskAppetite),
		PhasedSchedule:      phasedSchedule(req.InvestmentMode, amount, monthlySIPAmount(req)),
		Projections:         projections,
		RebalancingRules: []string{
			"Review allocation every 6 months or after a major life event.",
			"Rebalance when any major asset class drifts more than 5 percentage points from target.",
			"Keep emergency capital separate from market-linked investments.",
		},
		RiskExplanation: fmt.Sprintf("This %s plan for %s uses scenario ranges because market returns are uncertain. Higher equity exposure can improve long-term upside but also increases drawdown risk.", strings.ToLower(req.RiskAppetite), strings.ToLower(req.Goal)),
		ScoreBreakdown:  breakdown,
		Disclaimer:      ai.Disclaimer,
	}
}

func investableAmount(req model.PortfolioPlanRequest) float64 {
	if strings.EqualFold(req.InvestmentMode, "SIP") {
		monthly := monthlySIPAmount(req)
		return math.Max(monthly*12*float64(max(req.TimeHorizonYears, 1))-req.EmergencyFundRequirement, 0)
	}
	return math.Max(req.TotalInvestment-req.EmergencyFundRequirement, 0)
}

func monthlySIPAmount(req model.PortfolioPlanRequest) float64 {
	if req.MonthlySIP > 0 {
		return req.MonthlySIP
	}
	return math.Max(req.TotalInvestment, 0)
}

func (s *AnalysisService) Explain(req model.ExplainRequest) model.ExplainResponse {
	text, source := s.explainer.Explain(req.Topic, req.Context)
	return model.ExplainResponse{Explanation: text, Source: source, Disclaimer: ai.Disclaimer}
}

func buildAllocation(risk string, amount float64) []model.AllocationItem {
	type row struct {
		asset, rationale, risk string
		pct                    float64
	}
	var rows []row
	switch strings.ToLower(risk) {
	case "conservative":
		rows = []row{{"Large Cap Equity", "Stable growth engine", "Equity drawdowns still possible", 30}, {"Debt / Liquid", "Capital stability and liquidity", "Lower long-term return potential", 42}, {"Gold", "Crisis hedge", "Can underperform equities for long periods", 10}, {"Flexi Cap Equity", "Measured diversified growth", "Manager and valuation risk", 13}, {"Cash Buffer", "Deployment flexibility", "Inflation drag", 5}}
	case "aggressive":
		rows = []row{{"Large Cap Equity", "Core compounding base", "Market cycle risk", 32}, {"Mid / Small Cap Equity", "Higher growth potential", "High volatility and drawdown risk", 28}, {"Flexi Cap Equity", "Active diversification", "Manager risk", 20}, {"Debt / Liquid", "Shock absorber", "Lower upside", 10}, {"Gold", "Portfolio hedge", "No yield and price cycles", 10}}
	default:
		rows = []row{{"Large Cap Equity", "Core market exposure", "Equity volatility", 36}, {"Flexi Cap Equity", "Style diversification", "Manager risk", 22}, {"Mid Cap Equity", "Growth satellite", "Sharper drawdowns", 14}, {"Debt / Liquid", "Stability and liquidity", "Lower upside", 18}, {"Gold", "Macro hedge", "Can lag in risk-on markets", 10}}
	}
	items := make([]model.AllocationItem, 0, len(rows))
	for _, r := range rows {
		items = append(items, model.AllocationItem{Asset: r.asset, Percent: r.pct, Amount: round(amount * r.pct / 100), Rationale: r.rationale, RiskNote: r.risk})
	}
	return items
}

func deploymentPlan(mode, risk string) []string {
	if strings.EqualFold(mode, "SIP") {
		return []string{"Deploy through monthly SIPs aligned to income cycle.", "Review top-up capacity every quarter.", "Use lump-sum additions only after allocation drift or major corrections."}
	}
	return []string{"Deploy 40% immediately into low-volatility buckets.", "Deploy 30% over the next 3 months.", "Keep 30% for staggered equity entries or rebalancing opportunities."}
}

func phasedSchedule(mode string, amount float64, monthlySIP float64) []string {
	if strings.EqualFold(mode, "SIP") {
		monthly := monthlySIP
		if monthly <= 0 {
			monthly = amount / 12
		}
		return []string{fmt.Sprintf("Monthly SIP: ₹%.0f", monthly), "Prioritize core index and flexi-cap allocations first.", "Step up SIP annually only if income and emergency buffer allow it."}
	}
	return []string{fmt.Sprintf("Month 1: ₹%.0f", amount*0.4), fmt.Sprintf("Months 2-4: ₹%.0f per month", amount*0.1), fmt.Sprintf("Opportunistic reserve: ₹%.0f", amount*0.3)}
}

func stockBullCase(stock model.Stock) []string {
	return []string{
		fmt.Sprintf("%s has %0.1f%% profit growth in the seed data.", stock.Symbol, stock.ProfitGrowth),
		"Price is evaluated against medium and long moving averages for trend strength.",
		"Institutional and news sentiment inputs are treated as supporting signals, not predictions.",
	}
}

func stockBearCase(stock model.Stock) []string {
	return []string{
		fmt.Sprintf("Valuation risk exists at %.1f PE and %.1f PB.", stock.PERatio, stock.PBRatio),
		"Earnings disappointment can compress both price and score.",
		"Macro or sector-specific shocks may override current trend signals.",
	}
}

func stockRisks(stock model.Stock) []string {
	risks := []string{"Market risk and liquidity risk apply to all listed equities.", "Scenario projections are sensitive to earnings and valuation assumptions."}
	if stock.DebtToEquity > 1 {
		risks = append(risks, "Debt-to-equity is elevated versus lower-leverage peers.")
	}
	if stock.PERatio > 45 {
		risks = append(risks, "High valuation leaves less room for execution mistakes.")
	}
	return risks
}

func technicalTrend(stock model.Stock) string {
	if stock.CurrentPrice > stock.MovingAverage50 && stock.MovingAverage50 > stock.MovingAverage200 {
		return "Positive: price is above 50DMA and 50DMA is above 200DMA."
	}
	if stock.CurrentPrice < stock.MovingAverage50 && stock.MovingAverage50 < stock.MovingAverage200 {
		return "Weak: price is below key moving averages."
	}
	return "Mixed: trend confirmation is incomplete."
}

func suggestedFundAllocation(risk string, score int) int {
	base := 10
	switch strings.ToLower(risk) {
	case "low":
		base = 20
	case "moderate":
		base = 16
	case "high":
		base = 12
	case "very high":
		base = 7
	}
	if score >= 80 {
		base += 4
	}
	return base
}

func fundPros(fund model.Fund) []string {
	return []string{
		fmt.Sprintf("Five-year return profile is %.1f%% in the model universe.", fund.Return5Y),
		fmt.Sprintf("Expense ratio of %.2f%% supports cost-aware comparison.", fund.ExpenseRatio),
		"Score includes drawdown and risk-adjusted return estimates.",
	}
}

func fundCons(fund model.Fund) []string {
	return []string{
		fmt.Sprintf("Max drawdown estimate is %.1f%%, so position sizing matters.", fund.MaxDrawdown),
		"Past returns and rolling return estimates do not guarantee future outcomes.",
		"Category suitability depends on investor horizon and risk appetite.",
	}
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func round(value float64) float64 {
	return math.Round(value*100) / 100
}
