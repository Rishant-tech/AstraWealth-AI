import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { ProjectionChart } from "@/components/ProjectionChart";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Shell } from "@/components/Shell";
import { getStockAnalysis, safe } from "@/lib/api";
import { inr, pct, plainPct } from "@/lib/format";

export default async function StockDetailPage({ params }: { params: { symbol: string } }) {
  const analysis = await safe(getStockAnalysis(params.symbol));
  if (!analysis) notFound();
  const stock = analysis.stock;

  return (
    <Shell>
      <PageHeader eyebrow="Stock analysis" title={`${stock.symbol} · ${stock.name}`} description={stock.sector} />
      <div className="space-y-6">
        <DisclaimerBanner text={analysis.disclaimer} />
        <div className="rounded-lg border border-sky/25 bg-sky/10 p-4 text-sm text-sky">
          Quote source: {stock.dataSource || "mock-seed"}
          {stock.lastUpdated ? ` · Last updated ${new Date(stock.lastUpdated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}` : ""}
        </div>
        <Card title="AI recommendation" action={<ScoreBadge score={analysis.score} label={analysis.label} />}>
          <p className="text-sm leading-6 text-slate-300">{analysis.explanation}</p>
          <p className="mt-4 rounded-lg border border-sky/25 bg-sky/10 p-3 text-sm text-sky">{analysis.technicalTrend}</p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Current price" value={inr(stock.currentPrice)} delta={`1D ${pct(stock.return1D)}`} />
          <MetricCard label="Returns" value={pct(stock.return1Y)} delta={`1M ${pct(stock.return1M)} · 6M ${pct(stock.return6M)}`} tone="sky" />
          <MetricCard label="PE / PB" value={`${stock.peRatio.toFixed(1)} / ${stock.pbRatio.toFixed(1)}`} delta="Valuation context" tone="amber" />
          <MetricCard label="ROE / ROCE" value={`${plainPct(stock.roe)} / ${plainPct(stock.roce)}`} delta="Profitability quality" tone="violet" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Fundamentals">
            <MetricList
              items={[
                ["Debt-to-equity", stock.debtToEquity.toFixed(2)],
                ["Revenue growth", pct(stock.revenueGrowth)],
                ["Profit growth", pct(stock.profitGrowth)],
                ["Promoter holding", plainPct(stock.promoterHolding)],
                ["FII/DII trend", stock.fiiDiiTrend],
                ["News sentiment", stock.newsSentiment]
              ]}
            />
          </Card>
          <Card title="Score breakdown">
            <MetricList items={Object.entries(analysis.breakdown).map(([key, value]) => [labelize(key), `${value}/100`])} />
          </Card>
        </div>

        <Card title="1Y / 3Y / 5Y scenario projections">
          <ProjectionChart data={analysis.projections} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <ListCard title="Bull case" items={analysis.bullCase} tone="teal" />
          <ListCard title="Bear case" items={analysis.bearCase} tone="amber" />
          <ListCard title="Risk factors" items={analysis.riskFactors} tone="rose" />
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

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "teal" | "amber" | "rose" }) {
  const color = tone === "teal" ? "border-teal/25 bg-teal/10" : tone === "amber" ? "border-amber/25 bg-amber/10" : "border-rose/25 bg-rose/10";
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
