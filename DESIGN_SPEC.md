# Figma-Style UI Design Specification

## Product Name

**AstraWealth AI**

A premium dark fintech analysis application for Indian investors. AstraWealth AI helps users compare stocks, mutual fund categories, gold, silver, and portfolio plans through probability-based scoring, risk education, and scenario projections.

## Product Principles

- Educational analysis, never guaranteed returns.
- Probability-based projections with explicit bear, base, and bull scenarios.
- Fast scanning for experienced users, clear explanations for newer investors.
- Mobile-first screens with dense, polished desktop layouts.
- Calm premium interface: high contrast, restrained color, no hype language.

## Visual Identity

### Personality

Confident, analytical, premium, and measured. The product should feel like a private investment cockpit rather than a marketing page.

### Core Visual Motifs

- Glassy dark panels with thin borders.
- Data-rich cards with compact labels and large key metrics.
- Subtle radial lighting and market-grid backgrounds.
- Cylindrical scroll on the home page, suggesting portfolio insights rotating into view.
- Risk color coding that is useful but not alarming.

## Color Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `bg-950` | `#05070B` | App background |
| `bg-900` | `#0A0F18` | Section background |
| `panel-900` | `#0F1724` | Cards and panels |
| `panel-800` | `#151F2F` | Elevated cards |
| `border` | `#223047` | Card borders |
| `text-primary` | `#F5F7FB` | Primary text |
| `text-secondary` | `#AAB6C8` | Secondary text |
| `text-muted` | `#728098` | Captions |
| `teal` | `#29D3B5` | Positive finance accent |
| `sky` | `#56B6FF` | Interactive accent |
| `amber` | `#F2B84B` | Caution and commodities |
| `rose` | `#FF6B8A` | High risk and negative alerts |
| `violet` | `#9B8CFF` | AI scoring accent |

## Typography

- Font family: `Inter`, system fallback.
- Display: 48-72px desktop, 38-52px mobile, weight 700.
- Page title: 28-40px, weight 700.
- Section title: 18-24px, weight 650.
- Metric value: 24-38px, tabular numbers.
- Body: 14-16px.
- Caption: 11-13px, uppercase labels use 0.08em letter spacing.

## Spacing System

- Base unit: 4px.
- Common spacing: 8, 12, 16, 20, 24, 32, 48, 64.
- Mobile page padding: 16px.
- Tablet page padding: 24px.
- Desktop page padding: 32px, max content width 1280px.
- Card radius: 8px.
- Button radius: 8px.

## Component System

### Card

Dark panel with 1px border, 8px radius, subtle top highlight, and hover border lift on interactive variants.

### MetricCard

Shows label, value, optional delta, and optional icon. Used in dashboards and analyzer detail pages.

### ScoreBadge

Circular or pill score indicator from 0-100.

- 80-100: strong, teal.
- 60-79: constructive, sky.
- 40-59: watch, amber.
- 0-39: weak, rose.

### RiskBadge

Pill label for Low, Moderate, High, and Very High risk. Always paired with explanatory copy on detail pages.

### AllocationChart

Recharts pie chart showing asset weights with legend and percentage labels.

### ProjectionChart

Recharts line chart for bear, base, and bull paths. Must include a disclaimer nearby.

### SearchBox

Rounded input with search icon, instant result list, loading state, empty state, and keyboard-safe spacing on mobile.

### DataTable

Responsive table that becomes stacked cards on narrow mobile when needed.

### AssetAllocationCard

Asset class, suggested percentage, rationale, and risk note.

### RecommendationCard

Compact card for stock, fund, or commodity ideas with score, label, and reasons.

### DisclaimerBanner

Always visible on analysis pages. Short copy: "Educational analysis only. Projections are scenarios, not guarantees."

### CylinderScrollSection

Home-only section system. Uses CSS perspective, `transform-style: preserve-3d`, Framer Motion scroll progress, `rotateX`, `translateZ`, opacity, and scale. Each insight is placed as a layer on a virtual vertical cylinder.

## Motion System

- Default transition: 180-260ms ease.
- Page section entrance: 280ms, 12px vertical offset.
- Chart animation: 500-700ms.
- Button press: scale 0.98.
- Cylinder hero:
  - Scroll snap sections.
  - Sticky viewport container.
  - Layer rotation calculated from scroll progress.
  - Active layer: opacity 1, scale 1, `rotateX(0deg)`.
  - Previous/next layers: opacity 0.22-0.55, scale 0.82-0.94.
  - Far layers: opacity 0, pointer events disabled.
  - Respect reduced motion by stacking sections normally.

## Screen Layouts

### Home

1. Portfolio Value Hero: large centered `₹14,50,000`, subtitle, two CTAs.
2. Recommended Allocation: allocation chart and concise allocation cards.
3. Portfolio Health Score: score, drivers, improvement suggestions.
4. Best Opportunities: stocks, funds, commodities, watchlist suggestions.
5. Future Projection: bear/base/bull paths.
6. Risk Warnings: concentration, liquidity, valuation, FOMO warnings.

### Dashboard

Top metrics row, allocation chart, AI portfolio score, market mood, watchlist, ideas, commodity trend, and risk alerts. Mobile stacks metrics first, then score and allocation.

### Portfolio Planner

Left/top input form, right/bottom generated plan. Desktop uses two-column workbench. Mobile uses a sticky submit button and stacked result cards.

### Stock Analyzer

Search first. Results/detail show price metrics, fundamentals, technical trend, score breakdown, recommendation label, bull/bear cases, risk factors, and scenario chart.

### Mutual Fund Analyzer

Search first. Results/detail show NAV, returns, costs, AUM, risk, manager placeholder, score breakdown, allocation suggestion, pros, cons, and suitability.

### Gold/Silver

Two commodity cards, trend chart, risk score, max allocation, FOMO warning, scenario projections, and diversification note.

### Watchlist

Tracked stocks and funds with current score, label, recent movement placeholder, and quick navigation.

### Settings

Profile assumptions, default risk appetite, API status, disclaimer, and optional OpenAI key instructions.

## Mobile Wireframes

### Home Mobile

```
[Sticky cylinder viewport]
  ₹14,50,000
  Build smarter wealth with AI
  [Plan My Portfolio] [Analyze Stock]

[scroll snaps through full-height insight layers]
```

### Dashboard Mobile

```
Header
Metric card
Metric card
Score card
Allocation chart
Watchlist
Ideas
Alerts
Bottom nav-safe spacing
```

### Analyzer Mobile

```
Header
Search box
Disclaimer
Score summary
Metric cards
Charts
Cases
Risks
```

## Desktop Wireframes

### Dashboard Desktop

```
Sidebar/Nav
Header
[Metric][Metric][Metric][Metric]
[Allocation chart] [Score + market mood]
[Watchlist] [Top stock ideas] [Top fund ideas]
[Commodity trend] [Risk alerts]
```

### Planner Desktop

```
Sidebar/Nav
[Form column 35%] [Generated allocation and projections 65%]
```

### Analyzer Desktop

```
Sidebar/Nav
Search + headline score
[Metrics grid]
[Score breakdown] [Projection chart]
[Bull case] [Bear case] [Risk factors]
```

## Loading States

- Skeleton cards with shimmer for metrics.
- Search box shows inline spinner.
- Charts reserve fixed height to avoid layout shift.
- Planner submit button shows loading copy and disabled state.

## Empty States

- Search: "Start with a symbol, fund name, or category."
- No result: "No matching mock instrument found."
- Watchlist: "Add stocks or funds from analyzer pages."
- Planner: "Enter assumptions to generate a scenario-based plan."

## Error States

- API unavailable: show resilient local fallback copy where possible.
- Form validation: inline field message.
- Analyzer fetch error: retry button and educational disclaimer remains visible.

## Disclaimers And Safety

All analysis screens must state:

"Educational analysis only. Scores and projections are scenario estimates, not investment advice, guarantees, or sure-shot predictions."

Recommendation labels are limited to:

- Buy: attractive scenario-adjusted profile, still risky.
- Hold: balanced or fairly valued.
- Avoid: risk/reward or data quality concerns.

No screen may claim guaranteed returns.
