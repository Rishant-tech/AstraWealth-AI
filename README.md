# AstraWealth AI

A full-stack AI-powered investment analysis demo for Indian stocks, mutual fund categories, gold, silver, portfolio allocation, and scenario projections.

The app uses deterministic scoring, rule-based AI explanations, and seeded fundamentals. By default Docker runs `DATA_MODE=live`, which refreshes Indian stock quotes and historical returns from Yahoo Finance's chart endpoint with mock fallback. If `OPENAI_API_KEY` is configured, the backend can use OpenAI for short explanations. If it is missing, the app still works fully.

## Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Recharts
- Backend: Go REST API, clean package separation, seeded repository, scoring, projection, AI explanation layer
- Infrastructure: Docker Compose, PostgreSQL, Redis

## Run Locally

Requires Docker Engine with Docker Compose v2.

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8080/health

Optional AI explanations:

```bash
OPENAI_API_KEY=your_key docker compose up --build
```

Force mock-only market data:

```bash
DATA_MODE=mock docker compose up --build
```

## Project Structure

```text
AstraWealth-AI/
  DESIGN_SPEC.md
  README.md
  docker-compose.yml
  frontend/
  backend/
    cmd/server/main.go
    internal/
      api/
      service/
      model/
      repository/
      scoring/
      projection/
      ai/
      seed/
```

## Frontend Routes

- `/`
- `/dashboard`
- `/portfolio-planner`
- `/stocks`
- `/stocks/[symbol]`
- `/funds`
- `/funds/[id]`
- `/gold-silver`
- `/watchlist`
- `/settings`

## API Docs

### Health

`GET /health`

### Stocks

`GET /api/stocks/search?q=`

Returns the seeded Indian stock universe. In `DATA_MODE=live`, stock detail requests refresh quote, 1D/1M/6M/1Y returns, and moving averages from the live-enabled provider.

`GET /api/stocks/{symbol}/analysis`

Returns price, returns, PE, PB, ROE, ROCE, debt-to-equity, growth, promoter holding, FII/DII placeholder, news sentiment placeholder, technical trend, AI score, label, bull case, bear case, risks, and 1Y/3Y/5Y scenarios. The response includes `dataSource` and `lastUpdated` when live quote refresh succeeds.

Seeded symbols:

`RELIANCE`, `TCS`, `HDFCBANK`, `INFY`, `ICICIBANK`, `LT`, `ITC`, `SBIN`, `BHARTIARTL`, `HINDUNILVR`

### Mutual Funds

`GET /api/funds/search?q=`

Returns seeded mutual fund category matches.

`GET /api/funds/{id}/analysis`

Returns category, NAV, returns, expense ratio, AUM, risk, Sharpe, alpha, beta, rolling return, drawdown, manager placeholder, score, suggested allocation, pros, cons, and suitability.

Seeded fund IDs:

`nifty-50-index`, `nifty-next-50-index`, `flexi-cap`, `large-mid-cap`, `mid-cap`, `small-cap`, `elss`, `gold-etf-fof`, `silver-etf-fof`, `liquid`

### Commodities

`GET /api/commodities/gold-silver`

Returns gold and silver trends, 1Y returns, risk scores, max allocations, FOMO warning, diversification warning, and scenarios.

### Portfolio Planner

`POST /api/portfolio/plan`

Example body:

```json
{
  "totalInvestment": 1450000,
  "emergencyFundRequirement": 250000,
  "timeHorizonYears": 7,
  "riskAppetite": "Moderate",
  "goal": "Wealth creation",
  "investmentMode": "Lump sum"
}
```

Returns suggested allocation, deployment plan, phased schedule, bear/base/bull projections, rebalancing rules, score breakdown, and risk explanation.

### AI Explanation

`POST /api/ai/explain`

Example body:

```json
{
  "topic": "Portfolio risk",
  "context": "Moderate investor with 7 year horizon"
}
```

Returns local rule-based explanation unless `OPENAI_API_KEY` is available and the OpenAI call succeeds.

## Scoring Logic

Stock score includes valuation, profitability, growth, debt, technical, and sentiment components.

Mutual fund score includes return consistency, expense ratio, risk-adjusted return, drawdown, AUM, and category suitability.

Portfolio score includes diversification, risk alignment, time horizon fit, liquidity, and gold/debt hedge.

## Limitations

- Stock fundamentals and the searchable universe are seeded. In `DATA_MODE=live`, quote, return, and moving-average fields are refreshed from Yahoo Finance's unofficial chart endpoint and may be delayed or unavailable.
- For licensed production real-time NSE/BSE redistribution, connect an authorized market data vendor such as Global Datafeeds, TrueData, or an approved broker/vendor API.
- FII/DII, news sentiment, Sharpe, alpha, beta, rolling return, drawdown, and fund manager fields are placeholders.
- PostgreSQL and Redis are included for full-stack infrastructure readiness, while the current repository implementation serves seeded in-memory data.
- Projections are simplified scenarios for product demonstration.

## Disclaimer

Educational analysis only. Scores and projections are scenario estimates, not investment advice, guarantees, or sure-shot predictions. Markets are uncertain, and users should consult qualified professionals before making financial decisions.
