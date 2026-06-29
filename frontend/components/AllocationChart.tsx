"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationItem } from "@/types/api";
import { inr } from "@/lib/format";

const colors = ["#29D3B5", "#56B6FF", "#F2B84B", "#9B8CFF", "#FF6B8A", "#8BE28B"];

export function AllocationChart({ data }: { data: AllocationItem[] }) {
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
      <div className="h-56 min-w-0 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="percent" nameKey="asset" innerRadius={58} outerRadius={94} paddingAngle={3}>
              {data.map((item, index) => (
                <Cell key={item.asset} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0F1724", border: "1px solid #223047", borderRadius: 8, color: "#F5F7FB" }}
              formatter={(value: string | number, _name, item) => [`${value}% (${inr((item.payload as AllocationItem).amount)})`, "Allocation"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.asset} className="flex items-start justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-start gap-2 text-slate-300">
              <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="break-words">{item.asset}</span>
            </span>
            <span className="flex-none font-mono text-white">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
