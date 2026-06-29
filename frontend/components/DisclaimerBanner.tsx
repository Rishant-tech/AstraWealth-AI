import { ShieldAlert } from "lucide-react";

export function DisclaimerBanner({ text }: { text?: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-amber/25 bg-amber/10 p-4 text-sm text-amber">
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
      <p>{text || "Educational analysis only. Scores and projections are scenario estimates, not investment advice, guarantees, or sure-shot predictions."}</p>
    </div>
  );
}
