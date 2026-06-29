import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PageHeader } from "@/components/PageHeader";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Shell } from "@/components/Shell";
import { getFundAnalysis, getStockAnalysis, safe } from "@/lib/api";

export default async function WatchlistPage() {
  const [reliance, tcs, hdfc, gold] = await Promise.all([
    safe(getStockAnalysis("RELIANCE")),
    safe(getStockAnalysis("TCS")),
    safe(getStockAnalysis("HDFCBANK")),
    safe(getFundAnalysis("gold-etf-fof"))
  ]);

  return (
    <Shell>
      <PageHeader eyebrow="Watchlist" title="Tracked ideas" description="A practical watchlist for reviewing scores, labels, and risk-aware next steps." />
      <div className="space-y-6">
        <DisclaimerBanner />
        <div className="grid gap-4 lg:grid-cols-2">
          {reliance ? <RecommendationCard title={reliance.stock.symbol} subtitle={reliance.stock.name} score={reliance.score} label={reliance.label} href="/stocks/RELIANCE" /> : null}
          {tcs ? <RecommendationCard title={tcs.stock.symbol} subtitle={tcs.stock.name} score={tcs.score} label={tcs.label} href="/stocks/TCS" /> : null}
          {hdfc ? <RecommendationCard title={hdfc.stock.symbol} subtitle={hdfc.stock.name} score={hdfc.score} label={hdfc.label} href="/stocks/HDFCBANK" /> : null}
          {gold ? <RecommendationCard title={gold.fund.name} subtitle={gold.fund.category} score={gold.score} label="Fund" href="/funds/gold-etf-fof" /> : null}
        </div>
        <Card title="Empty state behavior">
          <p className="text-sm leading-6 text-slate-300">
            When a user has no saved items, this page should show: Add stocks or funds from analyzer pages. The current build preloads a sample watchlist for demonstration.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
