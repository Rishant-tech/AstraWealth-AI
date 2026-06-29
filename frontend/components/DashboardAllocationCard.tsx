"use client";

import { useMemo } from "react";
import { buildPortfolioAllocation, DEFAULT_PORTFOLIO_AMOUNT } from "@/lib/portfolio";
import { usePortfolioAmount } from "@/lib/usePortfolioAmount";
import { AllocationChart } from "./AllocationChart";
import { Card } from "./Card";

export function DashboardAllocationCard() {
  const { amount } = usePortfolioAmount(DEFAULT_PORTFOLIO_AMOUNT);
  const allocation = useMemo(() => buildPortfolioAllocation(amount), [amount]);

  return (
    <Card title="Asset allocation">
      <AllocationChart data={allocation} />
    </Card>
  );
}
