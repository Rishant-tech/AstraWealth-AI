package repository

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"astrawealth-ai/backend/internal/model"
)

type LiveRepository struct {
	base   Repository
	client *http.Client
	cache  map[string]liveCacheEntry
	mu     sync.RWMutex
	ttl    time.Duration
}

type liveCacheEntry struct {
	stock     model.Stock
	expiresAt time.Time
}

func NewLiveRepository(base Repository) *LiveRepository {
	return &LiveRepository{
		base:   base,
		client: &http.Client{Timeout: 8 * time.Second},
		cache:  make(map[string]liveCacheEntry),
		ttl:    liveTTL(),
	}
}

func (r *LiveRepository) SearchStocks(query string) []model.Stock {
	stocks := r.base.SearchStocks(query)
	for index := range stocks {
		stocks[index] = markSeed(stocks[index])
	}
	return stocks
}

func (r *LiveRepository) GetStock(symbol string) (model.Stock, error) {
	seedStock, err := r.base.GetStock(symbol)
	if err != nil {
		return model.Stock{}, err
	}

	normalized := strings.ToUpper(strings.TrimSpace(symbol))
	if cached, ok := r.cached(normalized); ok {
		return cached, nil
	}

	liveStock, err := r.fetchYahooStock(seedStock)
	if err != nil {
		return markSeed(seedStock), nil
	}

	r.mu.Lock()
	r.cache[normalized] = liveCacheEntry{stock: liveStock, expiresAt: time.Now().Add(r.ttl)}
	r.mu.Unlock()
	return liveStock, nil
}

func (r *LiveRepository) SearchFunds(query string) []model.Fund {
	return r.base.SearchFunds(query)
}

func (r *LiveRepository) GetFund(id string) (model.Fund, error) {
	return r.base.GetFund(id)
}

func (r *LiveRepository) cached(symbol string) (model.Stock, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	entry, ok := r.cache[symbol]
	if !ok || time.Now().After(entry.expiresAt) {
		return model.Stock{}, false
	}
	return entry.stock, true
}

func (r *LiveRepository) fetchYahooStock(seedStock model.Stock) (model.Stock, error) {
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s.NS?range=1y&interval=1d", seedStock.Symbol)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return model.Stock{}, err
	}
	req.Header.Set("User-Agent", "AstraWealthAI/1.0")

	resp, err := r.client.Do(req)
	if err != nil {
		return model.Stock{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return model.Stock{}, fmt.Errorf("market data status %d", resp.StatusCode)
	}

	var payload yahooChartResponse
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return model.Stock{}, err
	}
	if len(payload.Chart.Result) == 0 {
		return model.Stock{}, fmt.Errorf("empty chart result")
	}

	result := payload.Chart.Result[0]
	if len(result.Indicators.Quote) == 0 {
		return model.Stock{}, fmt.Errorf("empty quote result")
	}

	closes := compactCloses(result.Indicators.Quote[0].Close)
	if len(closes) < 2 {
		return model.Stock{}, fmt.Errorf("not enough close data")
	}

	price := result.Meta.RegularMarketPrice
	if price <= 0 {
		price = closes[len(closes)-1]
	}

	previousClose := result.Meta.PreviousClose
	if previousClose <= 0 {
		previousClose = closes[len(closes)-2]
	}

	live := seedStock
	live.CurrentPrice = round2(price)
	live.Return1D = percentChange(price, previousClose)
	live.Return1M = periodReturn(price, closes, 21)
	live.Return6M = periodReturn(price, closes, 126)
	live.Return1Y = percentChange(price, closes[0])
	live.MovingAverage50 = movingAverage(closes, 50)
	live.MovingAverage200 = movingAverage(closes, 200)
	live.DataSource = "yahoo-finance-delayed"
	live.LastUpdated = lastUpdated(result.Meta.RegularMarketTime)
	return live, nil
}

type yahooChartResponse struct {
	Chart struct {
		Result []struct {
			Meta struct {
				RegularMarketPrice float64 `json:"regularMarketPrice"`
				PreviousClose      float64 `json:"previousClose"`
				RegularMarketTime  int64   `json:"regularMarketTime"`
			} `json:"meta"`
			Indicators struct {
				Quote []struct {
					Close []*float64 `json:"close"`
				} `json:"quote"`
			} `json:"indicators"`
		} `json:"result"`
	} `json:"chart"`
}

func markSeed(stock model.Stock) model.Stock {
	if stock.DataSource == "" {
		stock.DataSource = "mock-seed"
	}
	return stock
}

func liveTTL() time.Duration {
	raw := strings.TrimSpace(os.Getenv("LIVE_QUOTE_CACHE_TTL_SECONDS"))
	if raw == "" {
		return 60 * time.Second
	}
	seconds, err := strconv.Atoi(raw)
	if err != nil || seconds < 5 {
		return 60 * time.Second
	}
	return time.Duration(seconds) * time.Second
}

func compactCloses(values []*float64) []float64 {
	closes := make([]float64, 0, len(values))
	for _, value := range values {
		if value != nil && *value > 0 {
			closes = append(closes, *value)
		}
	}
	return closes
}

func periodReturn(current float64, closes []float64, sessions int) float64 {
	if len(closes) == 0 {
		return 0
	}
	index := len(closes) - 1 - sessions
	if index < 0 {
		index = 0
	}
	return percentChange(current, closes[index])
}

func percentChange(current, previous float64) float64 {
	if previous <= 0 {
		return 0
	}
	return round2(((current - previous) / previous) * 100)
}

func movingAverage(closes []float64, period int) float64 {
	if len(closes) == 0 {
		return 0
	}
	start := len(closes) - period
	if start < 0 {
		start = 0
	}
	total := 0.0
	for _, close := range closes[start:] {
		total += close
	}
	return round2(total / float64(len(closes[start:])))
}

func lastUpdated(epoch int64) string {
	if epoch <= 0 {
		return time.Now().UTC().Format(time.RFC3339)
	}
	return time.Unix(epoch, 0).UTC().Format(time.RFC3339)
}

func round2(value float64) float64 {
	return math.Round(value*100) / 100
}
