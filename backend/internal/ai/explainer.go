package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

const Disclaimer = "Educational analysis only. Scores and projections are scenario estimates, not investment advice, guarantees, or sure-shot predictions."

type Explainer struct {
	openAIKey string
	client    *http.Client
}

func NewExplainer(openAIKey string) *Explainer {
	return &Explainer{
		openAIKey: openAIKey,
		client:    &http.Client{Timeout: 8 * time.Second},
	}
}

func (e *Explainer) Explain(topic, context string) (string, string) {
	if strings.TrimSpace(e.openAIKey) != "" {
		if text, err := e.openAIExplanation(topic, context); err == nil && strings.TrimSpace(text) != "" {
			return text, "openai"
		}
	}
	return localExplanation(topic, context), "local-rules"
}

func localExplanation(topic, context string) string {
	topic = strings.TrimSpace(topic)
	context = strings.TrimSpace(context)
	if topic == "" {
		topic = "this investment"
	}
	if context == "" {
		context = "available valuation, growth, risk, and trend inputs"
	}
	return fmt.Sprintf("%s is assessed using %s. The score combines quality, risk, trend, and diversification signals, then converts them into bear, base, and bull scenarios. Treat the output as an educational decision aid, not a promise of future returns.", topic, context)
}

func (e *Explainer) openAIExplanation(topic, context string) (string, error) {
	payload := map[string]any{
		"model": "gpt-4.1-mini",
		"messages": []map[string]string{
			{"role": "system", "content": "You explain investment analysis cautiously. Never guarantee returns. Keep it under 90 words."},
			{"role": "user", "content": fmt.Sprintf("Topic: %s\nContext: %s", topic, context)},
		},
		"temperature": 0.2,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.openai.com/v1/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+e.openAIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := e.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	if len(result.Choices) == 0 {
		return "", fmt.Errorf("empty openai response")
	}
	return result.Choices[0].Message.Content, nil
}
