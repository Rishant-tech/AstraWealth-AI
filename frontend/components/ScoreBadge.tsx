import { scoreTone } from "@/lib/format";

export function ScoreBadge({ score, label = "AI score" }: { score: number; label?: string }) {
  return (
    <div className={`inline-flex max-w-full flex-none items-center gap-2 rounded-lg border px-3 py-2 sm:gap-3 ${scoreTone(score)}`}>
      <span className="font-mono text-xl font-bold sm:text-2xl">{score}</span>
      <span className="min-w-0 truncate text-xs font-semibold uppercase">{label}</span>
    </div>
  );
}
