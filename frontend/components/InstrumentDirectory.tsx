"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type DirectoryItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
};

const letters = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export function InstrumentDirectory({ items, emptyText }: { items: DirectoryItem[]; emptyText: string }) {
  const [active, setActive] = useState("All");
  const sorted = useMemo(() => [...items].sort((a, b) => a.title.localeCompare(b.title)), [items]);
  const filtered = active === "All" ? sorted : sorted.filter((item) => item.title.toUpperCase().startsWith(active));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {letters.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => setActive(letter)}
            className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-semibold transition ${
              active === letter ? "border-teal/50 bg-teal/10 text-teal" : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-5 text-sm text-slate-400">{emptyText}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link key={item.id} href={item.href} className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-teal/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 flex-none text-teal" />
              </div>
              <p className="mt-4 text-xs uppercase text-slate-500">{item.meta}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
