"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { publicApiBase } from "@/lib/api";
import type { PortfolioPlan, PortfolioPlanRequest } from "@/types/api";
import { AllocationChart } from "./AllocationChart";
import { AssetAllocationCard } from "./AssetAllocationCard";
import { Card } from "./Card";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { ProjectionChart } from "./ProjectionChart";
import { ScoreBadge } from "./ScoreBadge";

const defaultPayload: PortfolioPlanRequest = {
  totalInvestment: 1450000,
  emergencyFundRequirement: 250000,
  timeHorizonYears: 7,
  riskAppetite: "Moderate",
  goal: "Wealth creation",
  investmentMode: "Lump sum"
};

export function PlannerForm() {
  const [form, setForm] = useState(defaultPayload);
  const [plan, setPlan] = useState<PortfolioPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${publicApiBase}/api/portfolio/plan`, {
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
    <div className="grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
      <Card title="Inputs" eyebrow="Planner">
        <form onSubmit={submit} className="space-y-4">
          <NumberField label="Total investment amount" value={form.totalInvestment} onChange={(value) => setForm({ ...form, totalInvestment: value })} />
          <NumberField label="Emergency fund requirement" value={form.emergencyFundRequirement} onChange={(value) => setForm({ ...form, emergencyFundRequirement: value })} />
          <NumberField label="Time horizon years" value={form.timeHorizonYears} onChange={(value) => setForm({ ...form, timeHorizonYears: value })} />
          <SelectField label="Risk appetite" value={form.riskAppetite} options={["Conservative", "Moderate", "Aggressive"]} onChange={(value) => setForm({ ...form, riskAppetite: value })} />
          <SelectField label="Goal" value={form.goal} options={["Wealth creation", "Retirement", "House", "Emergency", "Passive income"]} onChange={(value) => setForm({ ...form, goal: value })} />
          <SelectField label="Investment mode" value={form.investmentMode} options={["Lump sum", "SIP"]} onChange={(value) => setForm({ ...form, investmentMode: value })} />
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

      <div className="space-y-6">
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
