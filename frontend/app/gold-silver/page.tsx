import { AlertTriangle, Gem, ShieldAlert, TrendingUp } from "lucide-react";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { ProjectionChart } from "@/components/ProjectionChart";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Shell } from "@/components/Shell";
import { getCommodities, safe } from "@/lib/api";
import type { Commodity } from "@/types/api";
import { inr, pct } from "@/lib/format";

export default async function GoldSilverPage() {
  const data = await safe(getCommodities());
  return (
    <Shell>
      <PageHeader eyebrow="Gold and silver" title="Commodity hedge analysis" description="Review trend, returns, risk score, suggested allocation caps, FOMO warning, scenario projections, and diversification role." />
      <div className="space-y-6">
        <DisclaimerBanner text={data?.disclaimer} />
        {!data ? (
          <Card>
            <p className="text-sm text-rose">Commodity API is unavailable. Start the backend service to load this page.</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <CommodityPanel commodity={data.gold} risk="Moderate" tone="amber" />
              <CommodityPanel commodity={data.silver} risk="High" tone="sky" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card title="Gold scenario projection" action={<ScoreBadge score={100 - data.gold.riskScore} label="Hedge" />}>
                <ProjectionChart data={data.gold.scenarioProjections} />
              </Card>
              <Card title="Silver scenario projection" action={<ScoreBadge score={100 - data.silver.riskScore} label="Hedge" />}>
                <ProjectionChart data={data.silver.scenarioProjections} />
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Warning icon={AlertTriangle} title="FOMO warning" text={data.fomoWarning} tone="amber" />
              <Warning icon={ShieldAlert} title="Diversification warning" text={data.diversificationWarning} tone="sky" />
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

function CommodityPanel({ commodity, risk, tone }: { commodity: Commodity; risk: string; tone: "amber" | "sky" }) {
  return (
    <Card title={`${commodity.name} asset panel`} action={<RiskBadge risk={risk} />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label={`${commodity.name} price model`} value={commodity.currentPrice ? inr(commodity.currentPrice) : "Tracked"} icon={Gem} tone={tone} />
        <MetricCard label="1Y return" value={pct(commodity.return1Y)} icon={TrendingUp} tone={tone} />
        <MetricCard label="Max allocation" value={`${commodity.suggestedMaxAllocation}%`} delta="Suggested cap" tone="teal" />
        <MetricCard label="Risk score" value={`${commodity.riskScore}/100`} delta={risk} tone={risk === "High" ? "rose" : "amber"} />
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">{commodity.trend}</p>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
        Source: {commodity.dataSource || "commodity-model"} · Updated: {commodity.lastUpdated || "daily model"}
      </div>
      <div className="mt-4 space-y-2">
        {commodity.notes.map((note) => (
          <p key={note} className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{note}</p>
        ))}
      </div>
    </Card>
  );
}

function Warning({ icon: Icon, title, text, tone }: { icon: typeof AlertTriangle; title: string; text: string; tone: "amber" | "sky" }) {
  const color = tone === "amber" ? "border-amber/25 bg-amber/10 text-amber" : "border-sky/25 bg-sky/10 text-sky";
  return (
    <Card>
      <div className={`mb-4 inline-flex rounded-lg border p-2 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </Card>
  );
}
