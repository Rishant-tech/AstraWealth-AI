import { EyeOff, Server, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { Shell } from "@/components/Shell";

export default function SettingsPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Settings" title="Analysis preferences" description="Review default planning assumptions, data transparency, and safety constraints." />
      <div className="space-y-6">
        <DisclaimerBanner />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Default risk" value="Moderate" delta="Used by planner presets" icon={SlidersHorizontal} tone="sky" />
          <MetricCard label="Data mode" value="Live-enabled" delta="Delayed stock quotes with model fallback" icon={Server} />
          <MetricCard label="User data" value="Local" delta="Preferences stay in this browser" icon={EyeOff} tone="violet" />
          <MetricCard label="Safety mode" value="On" delta="No guaranteed returns language" icon={ShieldCheck} tone="amber" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Default assumptions">
            <div className="space-y-3 text-sm text-slate-300">
              {["Base currency: INR", "Default horizon: 7 years", "Default goal: Wealth creation", "Preferred deployment: SIP or phased lump sum"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">{item}</div>
              ))}
            </div>
          </Card>
          <Card title="Privacy and controls">
            <p className="text-sm leading-6 text-slate-300">
              Portfolio preferences are used only to personalize the analysis experience in this app. Deployment keys, model providers, and infrastructure settings are managed separately by the platform.
            </p>
          </Card>
        </div>
        <Card title="Limitations">
          <p className="text-sm leading-6 text-slate-300">
            Stock prices are live-enabled where available and may be delayed. Fundamentals, fund categories, commodity scenarios, and scores use educational model assumptions, so they are not investment advice or trading signals.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
