"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { publicApiBase } from "@/lib/api";

type SearchResult = {
  id?: string;
  symbol?: string;
  name: string;
  category?: string;
  sector?: string;
};

export function SearchBox({ type }: { type: "stocks" | "funds" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${publicApiBase}/api/${type}/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search failed");
        return response.json() as Promise<SearchResult[]>;
      })
      .then(setResults)
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError("Search is unavailable. Check that the backend API is running.");
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query, type]);

  return (
    <div className="rounded-lg border border-line bg-ink-850/90 p-3 shadow-panel">
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={type === "stocks" ? "Search RELIANCE, TCS, HDFCBANK..." : "Search Nifty, Flexi, Liquid..."}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
        />
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-teal" /> : null}
      </label>
      {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}
      <div className="mt-3 grid gap-2">
        {results.length === 0 && !loading ? <p className="px-2 py-3 text-sm text-slate-500">No matching mock instrument found.</p> : null}
        {results.map((result) => {
          const id = result.symbol || result.id || "";
          return (
            <Link
              key={id}
              href={type === "stocks" ? `/stocks/${id}` : `/funds/${id}`}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-3 transition hover:border-teal/40"
            >
              <span>
                <span className="block font-semibold text-white">{result.symbol || result.name}</span>
                <span className="text-sm text-slate-400">{result.symbol ? result.name : result.category}</span>
              </span>
              <span className="text-xs text-slate-500">{result.sector || result.category}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
