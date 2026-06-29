export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function pct(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function plainPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function scoreTone(score: number) {
  if (score >= 80) return "text-teal border-teal/30 bg-teal/10";
  if (score >= 60) return "text-sky border-sky/30 bg-sky/10";
  if (score >= 40) return "text-amber border-amber/30 bg-amber/10";
  return "text-rose border-rose/30 bg-rose/10";
}
