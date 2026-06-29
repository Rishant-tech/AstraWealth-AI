import { AlertTriangle, Gem, ShieldAlert } from "lucide-react";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { ProjectionChart } from "@/components/ProjectionChart";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Shell } from "@/components/Shell";
import { getCommodities, safe } from "@/lib/api";
import { pct } from "@/lib/format";

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
              <Card title="Gold trend" action={<RiskBadge risk="Moderate" />}>
                <p className="text-sm leading-6 text-slate-300">{data.gold.trend}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <MetricCard label="1Y return" value={pct(data.gold.return1Y)} icon={Gem} tone="amber" />
                  <MetricCard label="Max allocation" value={`${data.gold.suggestedMaxAllocation}%`} delta={`Risk score ${data.gold.riskScore}/100`} tone="teal" />
                </div>
              </Card>
              <Card title="Silver trend" action={<RiskBadge risk="High" />}>
                <p className="text-sm leading-6 text-slate-300">{data.silver.trend}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <MetricCard label="1Y return" value={pct(data.silver.return1Y)} icon={Gem} tone="sky" />
                  <MetricCard label="Max allocation" value={`${data.silver.suggestedMaxAllocation}%`} delta={`Risk score ${data.silver.riskScore}/100`} tone="rose" />
                </div>
              </Card>
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
