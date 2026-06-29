package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"astrawealth-ai/backend/internal/model"
	"astrawealth-ai/backend/internal/repository"
	"astrawealth-ai/backend/internal/service"
)

type Router struct {
	service *service.AnalysisService
}

func NewRouter(service *service.AnalysisService) http.Handler {
	router := &Router{service: service}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", router.health)
	mux.HandleFunc("/api/stocks/search", router.searchStocks)
	mux.HandleFunc("/api/stocks/", router.stockAnalysis)
	mux.HandleFunc("/api/funds/search", router.searchFunds)
	mux.HandleFunc("/api/funds/", router.fundAnalysis)
	mux.HandleFunc("/api/commodities/gold-silver", router.commodities)
	mux.HandleFunc("/api/portfolio/plan", router.portfolioPlan)
	mux.HandleFunc("/api/ai/explain", router.explain)
	return cors(mux)
}

func (r *Router) health(w http.ResponseWriter, req *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":    "ok",
		"service":   "astrawealth-ai-api",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func (r *Router) searchStocks(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, r.service.SearchStocks(req.URL.Query().Get("q")))
}

func (r *Router) stockAnalysis(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	symbol := strings.TrimPrefix(req.URL.Path, "/api/stocks/")
	symbol = strings.TrimSuffix(symbol, "/analysis")
	if symbol == "" || strings.Contains(symbol, "/") {
		writeError(w, http.StatusNotFound, "stock route not found")
		return
	}
	analysis, err := r.service.StockAnalysis(symbol)
	if err != nil {
		handleServiceError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, analysis)
}

func (r *Router) searchFunds(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, r.service.SearchFunds(req.URL.Query().Get("q")))
}

func (r *Router) fundAnalysis(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	id := strings.TrimPrefix(req.URL.Path, "/api/funds/")
	id = strings.TrimSuffix(id, "/analysis")
	if id == "" || strings.Contains(id, "/") {
		writeError(w, http.StatusNotFound, "fund route not found")
		return
	}
	analysis, err := r.service.FundAnalysis(id)
	if err != nil {
		handleServiceError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, analysis)
}

func (r *Router) commodities(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, r.service.Commodities())
}

func (r *Router) portfolioPlan(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var body model.PortfolioPlanRequest
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	if body.TotalInvestment <= 0 || body.TimeHorizonYears <= 0 {
		writeError(w, http.StatusBadRequest, "totalInvestment and timeHorizonYears are required")
		return
	}
	writeJSON(w, http.StatusOK, r.service.PortfolioPlan(body))
}

func (r *Router) explain(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var body model.ExplainRequest
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	writeJSON(w, http.StatusOK, r.service.Explain(body))
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		if req.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, req)
	})
}

func handleServiceError(w http.ResponseWriter, err error) {
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	writeError(w, http.StatusInternalServerError, "internal server error")
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
