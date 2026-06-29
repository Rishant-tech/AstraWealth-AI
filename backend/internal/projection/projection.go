package projection

import (
	"math"

	"astrawealth-ai/backend/internal/model"
)

func Amount(start float64, years int, bearRate, baseRate, bullRate float64) []model.ProjectionPoint {
	if years < 1 {
		years = 1
	}
	if years > 30 {
		years = 30
	}

	points := make([]model.ProjectionPoint, 0, years)
	for year := 1; year <= years; year++ {
		points = append(points, model.ProjectionPoint{
			Year: year,
			Bear: round(start * math.Pow(1+bearRate, float64(year))),
			Base: round(start * math.Pow(1+baseRate, float64(year))),
			Bull: round(start * math.Pow(1+bullRate, float64(year))),
		})
	}
	return points
}

func Stock(price float64) []model.ProjectionPoint {
	return []model.ProjectionPoint{
		{Year: 1, Bear: round(price * 0.82), Base: round(price * 1.1), Bull: round(price * 1.24)},
		{Year: 3, Bear: round(price * 0.95), Base: round(price * 1.36), Bull: round(price * 1.85)},
		{Year: 5, Bear: round(price * 1.08), Base: round(price * 1.72), Bull: round(price * 2.55)},
	}
}

func Commodity(start float64, defensive bool) []model.ProjectionPoint {
	if defensive {
		return Amount(start, 5, -0.02, 0.07, 0.13)
	}
	return Amount(start, 5, -0.06, 0.08, 0.18)
}

func round(value float64) float64 {
	return math.Round(value*100) / 100
}
