"use client";

import { useEffect, useState } from "react";
import { CalendarClock, IndianRupee, Loader2, Sparkles } from "lucide-react";
import { DEFAULT_PORTFOLIO_AMOUNT } from "@/lib/portfolio";
import { usePortfolioAmount } from "@/lib/usePortfolioAmount";
import type { PortfolioPlan, PortfolioPlanRequest } from "@/types/api";
import { AllocationChart } from "./AllocationChart";
import { AssetAllocationCard } from "./AssetAllocationCard";
import { Card } from "./Card";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { ProjectionChart } from "./ProjectionChart";
import { ScoreBadge } from "./ScoreBadge";

const defaultPayload: PortfolioPlanRequest = {
  totalInvestment: DEFAULT_PORTFOLIO_AMOUNT,
  monthlySIP: 25000,
  emergencyFundRequirement: 250000,
  timeHorizonYears: 7,
  riskAppetite: "Moderate",
  goal: "Wealth creation",
  investmentMode: "Lump sum"
};

export function PlannerForm({ initialAmount }: { initialAmount?: number }) {
  const { amount: syncedAmount, setAmount: setSyncedAmount } = usePortfolioAmount(initialAmount ?? DEFAULT_PORTFOLIO_AMOUNT, Boolean(initialAmount));
  const [form, setForm] = useState<PortfolioPlanRequest>({
    ...defaultPayload,
    totalInvestment: syncedAmount
  });
  const [plan, setPlan] = useState<PortfolioPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((current) => {
      if (current.investmentMode === "SIP") {
        return { ...current, totalInvestment: syncedAmount, monthlySIP: syncedAmount };
      }
      return { ...current, totalInvestment: syncedAmount };
    });
  }, [syncedAmount]);

  function updateInvestmentAmount(value: number) {
    setSyncedAmount(value);
    setForm((current) => ({ ...current, totalInvestment: value }));
  }

  function updateSIPAmount(value: number) {
    setSyncedAmount(value);
    setForm((current) => ({ ...current, monthlySIP: value, totalInvestment: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/portfolio/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Unable to generate plan");
      setPlan((await response.json()) as PortfolioPlan);
    } catch {
      setError("Could not reach the planner API. Start the backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
        <Card title="Inputs" eyebrow="Planner">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <span className="text-sm text-slate-400">Investment mode</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ModeButton
                  active={form.investmentMode === "Lump sum"}
                  icon={IndianRupee}
                  label="Lump sum"
                  onClick={() => setForm({ ...form, investmentMode: "Lump sum" })}
                />
                <ModeButton
                  active={form.investmentMode === "SIP"}
                  icon={CalendarClock}
                  label="Monthly SIP"
                  onClick={() => setForm({ ...form, investmentMode: "SIP" })}
                />
              </div>
            </div>
            {form.investmentMode === "SIP" ? (
              <NumberField label="Monthly SIP amount" value={form.monthlySIP} onChange={updateSIPAmount} />
            ) : (
              <NumberField label="Lump sum amount" value={form.totalInvestment} onChange={updateInvestmentAmount} />
            )}
            <NumberField label="Emergency fund requirement" value={form.emergencyFundRequirement} onChange={(value) => setForm({ ...form, emergencyFundRequirement: value })} />
            <NumberField label="Time horizon years" value={form.timeHorizonYears} onChange={(value) => setForm({ ...form, timeHorizonYears: value })} />
            <SelectField label="Risk appetite" value={form.riskAppetite} options={["Conservative", "Moderate", "Aggressive"]} onChange={(value) => setForm({ ...form, riskAppetite: value })} />
            <SelectField label="Goal" value={form.goal} options={["Wealth creation", "Retirement", "House", "Emergency", "Passive income"]} onChange={(value) => setForm({ ...form, goal: value })} />
            {error ? <p className="text-sm text-rose">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal px-4 py-3 text-sm font-semibold text-ink-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate plan
            </button>
          </form>
        </Card>
      </div>

      <div className="min-w-0 space-y-6">
        {!plan ? (
          <Card className="flex min-h-[520px] items-center justify-center text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Scenario output</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Enter assumptions to generate a scenario-based plan.</h2>
              <p className="mt-3 max-w-xl text-sm text-slate-400">The planner will return suggested allocation, phased deployment, projections, rebalancing rules, and risk explanation.</p>
            </div>
          </Card>
        ) : (
          <>
            <DisclaimerBanner text={plan.disclaimer} />
            <Card title="Suggested allocation" action={<ScoreBadge score={plan.score} label="Portfolio" />}>
              <AllocationChart data={plan.suggestedAllocation} />
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              {plan.suggestedAllocation.map((item) => (
                <AssetAllocationCard key={item.asset} item={item} />
              ))}
            </div>
            <Card title="Bear / base / bull projection">
              <ProjectionChart data={plan.projections} />
            </Card>
            <div className="grid gap-4 lg:grid-cols-3">
              <ListCard title="Deployment plan" items={plan.deploymentPlan} />
              <ListCard title="Phased schedule" items={plan.phasedSchedule} />
              <ListCard title="Rebalancing rules" items={plan.rebalancingRules} />
            </div>
            <Card title="Risk explanation">
              <p className="text-sm leading-6 text-slate-300">{plan.riskExplanation}</p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function ModeButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  icon: typeof IndianRupee;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
        active ? "border-teal/50 bg-teal/10 text-teal" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-teal/50"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-teal/50"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-ink-900">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card title={title}>
      <ul className="space-y-3 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
