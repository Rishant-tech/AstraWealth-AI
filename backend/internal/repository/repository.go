package repository

import (
	"errors"
	"strings"

	"astrawealth-ai/backend/internal/model"
)

var ErrNotFound = errors.New("not found")

type Repository interface {
	SearchStocks(query string) []model.Stock
	GetStock(symbol string) (model.Stock, error)
	SearchFunds(query string) []model.Fund
	GetFund(id string) (model.Fund, error)
}

type MemoryRepository struct {
	stocks []model.Stock
	funds  []model.Fund
}

func NewMemoryRepository(stocks []model.Stock, funds []model.Fund) *MemoryRepository {
	return &MemoryRepository{stocks: stocks, funds: funds}
}

func (r *MemoryRepository) SearchStocks(query string) []model.Stock {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return r.stocks
	}

	results := make([]model.Stock, 0)
	for _, stock := range r.stocks {
		if strings.Contains(strings.ToLower(stock.Symbol), query) || strings.Contains(strings.ToLower(stock.Name), query) {
			results = append(results, stock)
		}
	}
	return results
}

func (r *MemoryRepository) GetStock(symbol string) (model.Stock, error) {
	symbol = strings.ToUpper(strings.TrimSpace(symbol))
	for _, stock := range r.stocks {
		if stock.Symbol == symbol {
			return stock, nil
		}
	}
	return model.Stock{}, ErrNotFound
}

func (r *MemoryRepository) SearchFunds(query string) []model.Fund {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return r.funds
	}

	results := make([]model.Fund, 0)
	for _, fund := range r.funds {
		haystack := strings.ToLower(fund.ID + " " + fund.Name + " " + fund.Category)
		if strings.Contains(haystack, query) {
			results = append(results, fund)
		}
	}
	return results
}

func (r *MemoryRepository) GetFund(id string) (model.Fund, error) {
	id = strings.ToLower(strings.TrimSpace(id))
	for _, fund := range r.funds {
		if fund.ID == id {
			return fund, nil
		}
	}
	return model.Fund{}, ErrNotFound
}
