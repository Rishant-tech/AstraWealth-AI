import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Shell } from "@/components/Shell";
import { getFundAnalysis, safe } from "@/lib/api";
import { inr, pct, plainPct } from "@/lib/format";

export default async function FundDetailPage({ params }: { params: { id: string } }) {
  const analysis = await safe(getFundAnalysis(params.id));
  if (!analysis) notFound();
  const fund = analysis.fund;

  return (
    <Shell>
      <PageHeader eyebrow="Mutual fund analysis" title={fund.name} description={`${fund.category} · ${fund.suitableFor}`} />
      <div className="space-y-6">
        <DisclaimerBanner text={analysis.disclaimer} />
        <Card title="AI fund score" action={<ScoreBadge score={analysis.score} label="Fund" />}>
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge risk={fund.riskLevel} />
            <span className="rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              Suggested allocation {analysis.suggestedAllocationPct}%
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{analysis.explanation}</p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="NAV" value={inr(fund.nav)} delta="Latest mock NAV" />
          <MetricCard label="1Y / 3Y / 5Y" value={`${pct(fund.return1Y)} / ${pct(fund.return3Y)}`} delta={`5Y ${pct(fund.return5Y)}`} tone="sky" />
          <MetricCard label="Expense ratio" value={plainPct(fund.expenseRatio)} delta={`AUM ${inr(fund.aum)} Cr`} tone="amber" />
          <MetricCard label="Sharpe / Alpha" value={`${fund.sharpeRatio.toFixed(2)} / ${fund.alpha.toFixed(1)}`} delta={`Beta ${fund.beta.toFixed(2)}`} tone="violet" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Fund details">
            <MetricList
              items={[
                ["Rolling return", pct(fund.rollingReturn)],
                ["Max drawdown", pct(fund.maxDrawdown)],
                ["Fund manager", fund.fundManager],
                ["Suitable investor", analysis.suitableInvestorType]
              ]}
            />
          </Card>
          <Card title="Score breakdown">
            <MetricList items={Object.entries(analysis.breakdown).map(([key, value]) => [labelize(key), `${value}/100`])} />
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ListCard title="Pros" items={analysis.pros} tone="teal" />
          <ListCard title="Cons" items={analysis.cons} tone="amber" />
        </div>
      </div>
    </Shell>
  );
}

function MetricList({ items }: { items: string[][] }) {
  return (
    <div className="space-y-3">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
          <span className="text-slate-400">{label}</span>
          <span className="text-right font-medium text-white">{value}</span>
        </div>
      ))}
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "teal" | "amber" }) {
  const color = tone === "teal" ? "border-teal/25 bg-teal/10" : "border-amber/25 bg-amber/10";
  return (
    <Card title={title}>
      <div className="space-y-3">
        {items.map((item) => (
          <p key={item} className={`rounded-lg border p-3 text-sm leading-6 text-slate-200 ${color}`}>{item}</p>
        ))}
      </div>
    </Card>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
