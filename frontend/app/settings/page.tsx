import { KeyRound, Server, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/Card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { Shell } from "@/components/Shell";

export default function SettingsPage() {
  return (
    <Shell>
      <PageHeader eyebrow="Settings" title="Analysis preferences" description="Configure default assumptions and review API status, safety constraints, and optional AI integration." />
      <div className="space-y-6">
        <DisclaimerBanner />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Default risk" value="Moderate" delta="Used by planner presets" icon={SlidersHorizontal} tone="sky" />
          <MetricCard label="Data mode" value="Mock seed" delta="10 stocks and 10 fund categories" icon={Server} />
          <MetricCard label="OpenAI layer" value="Optional" delta="Falls back to local rules" icon={KeyRound} tone="violet" />
          <MetricCard label="Safety mode" value="On" delta="No guaranteed returns language" icon={ShieldCheck} tone="amber" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Default assumptions">
            <div className="space-y-3 text-sm text-slate-300">
              {["Base currency: INR", "Default horizon: 7 years", "Default goal: Wealth creation", "Preferred deployment: phased lump sum"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-3">{item}</div>
              ))}
            </div>
          </Card>
          <Card title="Optional OpenAI setup">
            <p className="text-sm leading-6 text-slate-300">
              Set <span className="font-mono text-teal">OPENAI_API_KEY</span> on the backend service to enable generated explanations. If the key is missing or the call fails, the API returns local rule-based explanations so the app remains fully usable.
            </p>
          </Card>
        </div>
        <Card title="Limitations">
          <p className="text-sm leading-6 text-slate-300">
            This build uses seeded mock data and educational scoring logic. It is suitable for product demos and architecture extension, not for live trading decisions.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
