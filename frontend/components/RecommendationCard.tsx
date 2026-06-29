import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "./Card";
import { ScoreBadge } from "./ScoreBadge";

export function RecommendationCard({
  title,
  subtitle,
  score,
  label,
  href
}: {
  title: string;
  subtitle: string;
  score: number;
  label: string;
  href: string;
}) {
  return (
    <Card className="transition hover:border-teal/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <ScoreBadge score={score} label={label} />
      </div>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
        Open analysis
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
