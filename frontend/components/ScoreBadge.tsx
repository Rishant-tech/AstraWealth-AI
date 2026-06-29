import { scoreTone } from "@/lib/format";

export function ScoreBadge({ score, label = "AI score" }: { score: number; label?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-lg border px-3 py-2 ${scoreTone(score)}`}>
      <span className="font-mono text-2xl font-bold">{score}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
    </div>
  );
}
