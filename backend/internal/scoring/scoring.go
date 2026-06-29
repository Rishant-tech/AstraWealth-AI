package scoring

import (
	"math"
	"strings"

	"astrawealth-ai/backend/internal/model"
)

func Stock(stock model.Stock) (int, model.ScoreBreakdown) {
	valuation := avg(scoreLower(stock.PERatio, 12, 25, 60), scoreLower(stock.PBRatio, 1, 5, 12))
	profitability := avg(scoreHigher(stock.ROE, 8, 18, 30), scoreHigher(stock.ROCE, 8, 18, 35))
	growth := avg(scoreHigher(stock.RevenueGrowth, 2, 10, 22), scoreHigher(stock.ProfitGrowth, 2, 12, 28))
	debt := scoreLower(stock.DebtToEquity, 0, 0.6, 1.8)
	technical := technicalScore(stock.CurrentPrice, stock.MovingAverage50, stock.MovingAverage200)
	sentiment := sentimentScore(stock.NewsSentiment, stock.FIIDIITrend)

	breakdown := model.ScoreBreakdown{
		"valuation":     valuation,
		"profitability": profitability,
		"growth":        growth,
		"debt":          debt,
		"technical":     technical,
		"sentiment":     sentiment,
	}

	total := int(math.Round(float64(valuation)*0.18 + float64(profitability)*0.22 + float64(growth)*0.2 + float64(debt)*0.14 + float64(technical)*0.16 + float64(sentiment)*0.1))
	return clamp(total), breakdown
}

func Fund(fund model.Fund) (int, model.ScoreBreakdown) {
	returnConsistency := avg(scoreHigher(fund.Return3Y, 6, 12, 22), scoreHigher(fund.RollingReturn, 5, 11, 20))
	expense := scoreLower(fund.ExpenseRatio, 0.05, 0.45, 1.2)
	riskAdjusted := scoreHigher(fund.SharpeRatio, 0.35, 0.75, 1.15)
	drawdown := scoreHigher(40+fund.MaxDrawdown, 5, 18, 34)
	aum := scoreHigher(math.Log10(math.Max(fund.AUM, 1))*20, 50, 75, 95)
	suitability := categorySuitability(fund)

	breakdown := model.ScoreBreakdown{
		"returnConsistency":   returnConsistency,
		"expenseRatio":        expense,
		"riskAdjustedReturn":  riskAdjusted,
		"drawdown":            drawdown,
		"aum":                 aum,
		"categorySuitability": suitability,
	}

	total := int(math.Round(float64(returnConsistency)*0.24 + float64(expense)*0.16 + float64(riskAdjusted)*0.2 + float64(drawdown)*0.16 + float64(aum)*0.1 + float64(suitability)*0.14))
	return clamp(total), breakdown
}

func Portfolio(riskAppetite string, horizon int, allocations []model.AllocationItem, emergencyCovered bool) (int, model.ScoreBreakdown) {
	diversification := 78
	if len(allocations) >= 5 {
		diversification = 86
	}
	riskAlignment := 72
	if strings.EqualFold(riskAppetite, "Aggressive") && horizon >= 7 {
		riskAlignment = 86
	}
	if strings.EqualFold(riskAppetite, "Conservative") && horizon <= 3 {
		riskAlignment = 82
	}
	timeFit := clamp(45 + horizon*6)
	liquidity := 58
	if emergencyCovered {
		liquidity = 88
	}
	hedge := 76

	breakdown := model.ScoreBreakdown{
		"diversification": diversification,
		"riskAlignment":   riskAlignment,
		"timeHorizonFit":  timeFit,
		"liquidity":       liquidity,
		"goldDebtHedge":   hedge,
	}
	total := int(math.Round(float64(diversification)*0.24 + float64(riskAlignment)*0.24 + float64(timeFit)*0.2 + float64(liquidity)*0.18 + float64(hedge)*0.14))
	return clamp(total), breakdown
}

func Label(score int) string {
	switch {
	case score >= 75:
		return "Buy"
	case score >= 55:
		return "Hold"
	default:
		return "Avoid"
	}
}

func technicalScore(price, ma50, ma200 float64) int {
	score := 45
	if price > ma50 {
		score += 20
	}
	if ma50 > ma200 {
		score += 20
	}
	if price > ma200 {
		score += 15
	}
	return clamp(score)
}

func sentimentScore(news, flows string) int {
	text := strings.ToLower(news + " " + flows)
	score := 55
	if strings.Contains(text, "positive") || strings.Contains(text, "constructive") || strings.Contains(text, "improving") {
		score += 20
	}
	if strings.Contains(text, "cautious") || strings.Contains(text, "mixed") {
		score -= 12
	}
	if strings.Contains(text, "stable") {
		score += 8
	}
	return clamp(score)
}

func categorySuitability(fund model.Fund) int {
	switch fund.Category {
	case "Debt Liquid":
		return 84
	case "Large Cap Index", "Diversified Equity":
		return 82
	case "Large & Mid Cap", "Tax Saver":
		return 76
	case "Commodity Fund":
		return 68
	default:
		return 64
	}
}

func scoreHigher(value, low, mid, high float64) int {
	switch {
	case value <= low:
		return 35
	case value >= high:
		return 95
	case value <= mid:
		return int(35 + ((value-low)/(mid-low))*35)
	default:
		return int(70 + ((value-mid)/(high-mid))*25)
	}
}

func scoreLower(value, low, mid, high float64) int {
	switch {
	case value <= low:
		return 95
	case value >= high:
		return 30
	case value <= mid:
		return int(95 - ((value-low)/(mid-low))*25)
	default:
		return int(70 - ((value-mid)/(high-mid))*40)
	}
}

func avg(values ...int) int {
	if len(values) == 0 {
		return 0
	}
	total := 0
	for _, value := range values {
		total += value
	}
	return clamp(int(math.Round(float64(total) / float64(len(values)))))
}

func clamp(value int) int {
	if value < 0 {
		return 0
	}
	if value > 100 {
		return 100
	}
	return value
}
