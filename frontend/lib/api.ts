import type {
  CommoditiesAnalysis,
  Fund,
  FundAnalysis,
  PortfolioPlan,
  PortfolioPlanRequest,
  Stock,
  StockAnalysis
} from "@/types/api";

const serverBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const publicApiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${serverBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getStocks(query = "") {
  return apiFetch<Stock[]>(`/api/stocks/search?q=${encodeURIComponent(query)}`);
}

export async function getStockAnalysis(symbol: string) {
  return apiFetch<StockAnalysis>(`/api/stocks/${encodeURIComponent(symbol)}/analysis`);
}

export async function getFunds(query = "") {
  return apiFetch<Fund[]>(`/api/funds/search?q=${encodeURIComponent(query)}`);
}

export async function getFundAnalysis(id: string) {
  return apiFetch<FundAnalysis>(`/api/funds/${encodeURIComponent(id)}/analysis`);
}

export async function getCommodities() {
  return apiFetch<CommoditiesAnalysis>("/api/commodities/gold-silver");
}

export async function createPortfolioPlan(payload: PortfolioPlanRequest) {
  return apiFetch<PortfolioPlan>("/api/portfolio/plan", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function safe<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch {
    return null;
  }
}
