import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon?: LucideIcon;
  tone?: "teal" | "sky" | "amber" | "rose" | "violet";
};

const tones = {
  teal: "text-teal bg-teal/10 border-teal/25",
  sky: "text-sky bg-sky/10 border-sky/25",
  amber: "text-amber bg-amber/10 border-amber/25",
  rose: "text-rose bg-rose/10 border-rose/25",
  violet: "text-violet bg-violet/10 border-violet/25"
};

export function MetricCard({ label, value, delta, icon: Icon, tone = "teal" }: MetricCardProps) {
  return (
    <Card className="min-h-[132px]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon ? (
          <span className={`grid h-9 w-9 place-items-center rounded-lg border ${tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-white md:text-3xl">{value}</p>
      {delta ? <p className="mt-2 text-sm text-slate-400">{delta}</p> : null}
    </Card>
  );
}
