import { Activity, AlertTriangle, Gem, TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { DashboardAllocationCard } from "@/components/DashboardAllocationCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { PortfolioValueMetric } from "@/components/PortfolioValueMetric";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Shell } from "@/components/Shell";
import { getCommodities, getFundAnalysis, getStockAnalysis, safe } from "@/lib/api";
import { pct } from "@/lib/format";

export default async function DashboardPage() {
  const [sbin, icici, flexi, commodities] = await Promise.all([
    safe(getStockAnalysis("SBIN")),
    safe(getStockAnalysis("ICICIBANK")),
    safe(getFundAnalysis("flexi-cap")),
    safe(getCommodities())
  ]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Dashboard"
        title="Investment cockpit"
        description="A compact overview of portfolio health, allocation, opportunities, market mood, and risk alerts."
      />
      <div className="space-y-6">
        <DisclaimerBanner />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PortfolioValueMetric />
          <MetricCard label="Market mood" value="Constructive" delta="Momentum positive, valuation watch" icon={Activity} tone="sky" />
          <MetricCard label="Gold/silver trend" value="Hedge bid" delta={commodities ? `Gold ${pct(commodities.gold.return1Y)} 1Y` : "API unavailable"} icon={Gem} tone="amber" />
          <MetricCard label="Risk alerts" value="3" delta="Concentration, FOMO, liquidity" icon={AlertTriangle} tone="rose" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <DashboardAllocationCard />
          <Card title="AI portfolio score" action={<ScoreBadge score={82} label="Health" />}>
            <p className="text-sm leading-6 text-slate-300">
              Diversified across core equity, debt, and gold. Main improvement area is staged deployment and keeping emergency capital separate.
            </p>
            <div className="mt-5 grid gap-3">
              {["Diversification 86", "Risk alignment 78", "Liquidity 82"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {icici ? <RecommendationCard title={icici.stock.symbol} subtitle={icici.stock.name} score={icici.score} label={icici.label} href="/stocks/ICICIBANK" /> : null}
          {sbin ? <RecommendationCard title={sbin.stock.symbol} subtitle={sbin.stock.name} score={sbin.score} label={sbin.label} href="/stocks/SBIN" /> : null}
          {flexi ? <RecommendationCard title={flexi.fund.name} subtitle={flexi.fund.category} score={flexi.score} label="Fund" href="/funds/flexi-cap" /> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Watchlist">
            <div className="space-y-3 text-sm text-slate-300">
              {["RELIANCE: trend constructive, valuation fair", "TCS: quality high, growth moderate", "Gold ETF FoF: hedge allocation near target"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">{item}</div>
              ))}
            </div>
          </Card>
          <Card title="Risk alerts">
            <div className="space-y-3 text-sm text-slate-300">
              <p className="rounded-lg border border-rose/25 bg-rose/10 p-3">Avoid increasing commodities only because prices recently moved up.</p>
              <p className="rounded-lg border border-amber/25 bg-amber/10 p-3">Mid/small cap exposure should stay within a planned allocation band.</p>
              <p className="rounded-lg border border-sky/25 bg-sky/10 p-3">Keep liquid emergency funds outside market-linked assets.</p>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
