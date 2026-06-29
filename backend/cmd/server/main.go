package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"astrawealth-ai/backend/internal/ai"
	"astrawealth-ai/backend/internal/api"
	"astrawealth-ai/backend/internal/repository"
	"astrawealth-ai/backend/internal/seed"
	"astrawealth-ai/backend/internal/service"
)

func main() {
	port := env("PORT", "8080")

	repo := repository.NewMemoryRepository(seed.Stocks(), seed.Funds())
	explainer := ai.NewExplainer(os.Getenv("OPENAI_API_KEY"))
	svc := service.NewAnalysisService(repo, explainer)
	router := api.NewRouter(svc)

	server := &http.Server{
		Addr:              ":" + port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("AstraWealth AI API listening on :%s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
