import type { AllocationItem } from "@/types/api";
import { inr } from "@/lib/format";
import { Card } from "./Card";

export function AssetAllocationCard({ item }: { item: AllocationItem }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-white">{item.asset}</h3>
          <p className="mt-2 break-words text-sm text-slate-400">{item.rationale}</p>
        </div>
        <div className="flex-none text-right">
          <p className="font-mono text-2xl font-semibold text-teal">{item.percent}%</p>
          <p className="max-w-28 break-words text-xs text-slate-500">{inr(item.amount)}</p>
        </div>
      </div>
      <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">{item.riskNote}</p>
    </Card>
  );
}
