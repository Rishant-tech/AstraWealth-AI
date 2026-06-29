"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BarChart3, Gem, PieChart, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { inr } from "@/lib/format";
import type { AllocationItem, ProjectionPoint } from "@/types/api";
import { AllocationChart } from "./AllocationChart";
import { Card } from "./Card";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { MetricCard } from "./MetricCard";
import { ProjectionChart } from "./ProjectionChart";
import { ScoreBadge } from "./ScoreBadge";

export function HomeExperience() {
  const [portfolioValue, setPortfolioValue] = useState(1450000);
  const safeValue = Math.max(portfolioValue, 0);
  const allocation = useMemo(() => buildAllocation(safeValue), [safeValue]);
  const projection = useMemo(() => buildProjection(safeValue), [safeValue]);
  const planHref = `/portfolio-planner?amount=${safeValue}`;

  return (
    <div className="market-grid min-h-screen bg-ink-950 pb-28 lg:pb-12">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            <Sparkles className="h-3.5 w-3.5" />
            AI investment analysis
          </p>
          <h1 className="mt-6 max-w-full break-words font-mono text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">{inr(safeValue)}</h1>
          <p className="mt-5 text-2xl font-semibold text-white sm:text-3xl">Build smarter wealth with AI</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Analyze Indian stocks, mutual funds, gold, silver, and portfolio allocation with risk scoring and scenario projections.
          </p>
          <label className="mt-6 block max-w-sm">
            <span className="text-sm text-slate-400">Portfolio amount</span>
            <input
              type="number"
              min={0}
              value={portfolioValue}
              onChange={(event) => setPortfolioValue(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-lg text-white outline-none transition focus:border-teal/50"
            />
          </label>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={planHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-teal/90">
              <PieChart className="h-4 w-4" />
              Plan My Portfolio
            </Link>
            <Link href="/stocks" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-sky/40">
              <Search className="h-4 w-4" />
              Analyze Stock
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="grid gap-4">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Portfolio health</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Balanced, with growth tilt</h2>
              </div>
              <ScoreBadge score={82} label="Health" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Market mood" value="Constructive" />
              <MiniStat label="Risk" value="Moderate" />
              <MiniStat label="Hedge" value="10% Gold" />
            </div>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Base projection" value={inr(projection[3]?.base || 0)} delta="7 year scenario, not guaranteed" icon={TrendingUp} tone="sky" />
            <MetricCard label="Risk alerts" value="3" delta="Valuation, FOMO, liquidity" icon={AlertTriangle} tone="amber" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <Card title="Recommended allocation" eyebrow="Portfolio">
            <AllocationChart data={allocation} />
          </Card>
          <Card title="Portfolio health score" action={<ScoreBadge score={82} label="AI" />}>
            <div className="space-y-3 text-sm text-slate-300">
              <Insight icon={ShieldCheck} title="Diversification" text="Equity, debt, and gold reduce single-asset dependence." />
              <Insight icon={BarChart3} title="Time horizon fit" text="Growth allocation is better suited to medium and long horizons." />
              <Insight icon={Gem} title="Hedge discipline" text="Gold is capped as a hedge, not treated as a return guarantee." />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Opportunity title="ICICIBANK" text="Strong profitability and constructive trend profile." href="/stocks/ICICIBANK" />
          <Opportunity title="Flexi Cap Fund" text="Diversified equity category for long-term allocation." href="/funds/flexi-cap" />
          <Opportunity title="Gold ETF FoF" text="Useful hedge when kept within allocation limits." href="/funds/gold-etf-fof" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card title="Future projection" eyebrow="Bear / base / bull">
            <ProjectionChart data={projection} />
          </Card>
          <Card title="Risk warnings">
            <div className="space-y-3 text-sm text-slate-300">
              {[
                "Scenario projections are estimates, not assured returns.",
                "Avoid chasing gold or silver after sharp rallies.",
                "Keep emergency funds separate from market-linked assets.",
                "Review concentration and rebalance every 6 months."
              ].map((item) => (
                <p key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">{item}</p>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function buildAllocation(amount: number): AllocationItem[] {
  const rows = [
    { asset: "Large Cap Equity", percent: 36, rationale: "Core equity", riskNote: "Market volatility" },
    { asset: "Flexi Cap", percent: 22, rationale: "Style diversification", riskNote: "Manager risk" },
    { asset: "Mid Cap", percent: 14, rationale: "Growth satellite", riskNote: "Higher drawdown" },
    { asset: "Debt / Liquid", percent: 18, rationale: "Stability", riskNote: "Lower upside" },
    { asset: "Gold", percent: 10, rationale: "Macro hedge", riskNote: "Can lag equities" }
  ];
  return rows.map((row) => ({ ...row, amount: Math.round((amount * row.percent) / 100) }));
}

function buildProjection(amount: number): ProjectionPoint[] {
  return [1, 3, 5, 7].map((year) => ({
    year,
    bear: Math.round(amount * Math.pow(1.045, year)),
    base: Math.round(amount * Math.pow(1.092, year)),
    bull: Math.round(amount * Math.pow(1.148, year))
  }));
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function Insight({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-teal" />
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function Opportunity({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <Card className="transition hover:border-teal/35">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
        Open analysis
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
