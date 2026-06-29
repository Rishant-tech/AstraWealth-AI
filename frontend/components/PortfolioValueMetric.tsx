"use client";

import { IndianRupee } from "lucide-react";
import { inr } from "@/lib/format";
import { DEFAULT_PORTFOLIO_AMOUNT } from "@/lib/portfolio";
import { usePortfolioAmount } from "@/lib/usePortfolioAmount";
import { MetricCard } from "./MetricCard";

export function PortfolioValueMetric() {
  const { amount } = usePortfolioAmount(DEFAULT_PORTFOLIO_AMOUNT);
  return <MetricCard label="Total portfolio value" value={inr(amount)} delta="+11.8% modeled 1Y path" icon={IndianRupee} />;
}
