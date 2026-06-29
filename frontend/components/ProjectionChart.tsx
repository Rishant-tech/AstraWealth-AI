"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProjectionPoint } from "@/types/api";
import { inr } from "@/lib/format";

export function ProjectionChart({ data, currency = true }: { data: ProjectionPoint[]; currency?: boolean }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
          <XAxis dataKey="year" stroke="#728098" tickLine={false} axisLine={false} tickFormatter={(year) => `Y${year}`} />
          <YAxis stroke="#728098" tickLine={false} axisLine={false} width={70} tickFormatter={(value) => (currency ? compactInr(value) : `${value}`)} />
          <Tooltip
            contentStyle={{ background: "#0F1724", border: "1px solid #223047", borderRadius: 8, color: "#F5F7FB" }}
            formatter={(value: string | number) => {
              const numeric = typeof value === "number" ? value : Number(value);
              return currency ? inr(numeric) : numeric.toFixed(2);
            }}
            labelFormatter={(year) => `Year ${year}`}
          />
          <Line type="monotone" dataKey="bear" stroke="#FF6B8A" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="base" stroke="#56B6FF" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bull" stroke="#29D3B5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function compactInr(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}
