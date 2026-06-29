import type { AllocationItem, ProjectionPoint } from "@/types/api";

export const DEFAULT_PORTFOLIO_AMOUNT = 1450000;

export function normalizePortfolioAmount(value: number) {
  return Number.isFinite(value) ? Math.max(Math.round(value), 0) : DEFAULT_PORTFOLIO_AMOUNT;
}

export function buildPortfolioAllocation(amount: number): AllocationItem[] {
  const rows = [
    { asset: "Large Cap Equity", percent: 36, rationale: "Core equity", riskNote: "Market volatility" },
    { asset: "Flexi Cap", percent: 22, rationale: "Style diversification", riskNote: "Manager risk" },
    { asset: "Mid Cap", percent: 14, rationale: "Growth satellite", riskNote: "Higher drawdown" },
    { asset: "Debt / Liquid", percent: 18, rationale: "Stability", riskNote: "Lower upside" },
    { asset: "Gold", percent: 10, rationale: "Macro hedge", riskNote: "Can lag equities" }
  ];
  return rows.map((row) => ({ ...row, amount: Math.round((amount * row.percent) / 100) }));
}

export function buildPortfolioProjection(amount: number): ProjectionPoint[] {
  return [1, 3, 5, 7].map((year) => ({
    year,
    bear: Math.round(amount * Math.pow(1.045, year)),
    base: Math.round(amount * Math.pow(1.092, year)),
    bull: Math.round(amount * Math.pow(1.148, year))
  }));
}
