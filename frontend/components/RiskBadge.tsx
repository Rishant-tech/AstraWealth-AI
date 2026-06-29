export function RiskBadge({ risk }: { risk: string }) {
  const tone = risk.toLowerCase().includes("very") || risk.toLowerCase().includes("high")
    ? "border-rose/30 bg-rose/10 text-rose"
    : risk.toLowerCase().includes("moderate")
      ? "border-amber/30 bg-amber/10 text-amber"
      : "border-teal/30 bg-teal/10 text-teal";

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{risk} risk</span>;
}
