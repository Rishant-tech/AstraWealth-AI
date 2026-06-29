"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PieChart, Search } from "lucide-react";

const layers = [
  {
    title: "₹14,50,000",
    subtitle: "Build smarter wealth with AI",
    body: "Scenario-based planning for stocks, funds, gold, silver, and portfolio allocation.",
    kind: "hero"
  },
  {
    title: "58% Equity · 22% Debt · 10% Gold",
    subtitle: "Recommended allocation",
    body: "Balance compounding assets with liquidity and commodity hedges."
  },
  {
    title: "82 / 100",
    subtitle: "Portfolio health score",
    body: "Diversification, time horizon fit, liquidity, and risk alignment are scored together."
  },
  {
    title: "ICICIBANK · Flexi Cap · Gold ETF",
    subtitle: "Best opportunities",
    body: "Ideas are ranked by quality, valuation, trend, and suitability signals."
  },
  {
    title: "₹22.4L base case",
    subtitle: "Future projection",
    body: "Bear, base, and bull paths show ranges rather than sure-shot predictions."
  },
  {
    title: "Risk warnings first",
    subtitle: "No guaranteed returns",
    body: "The app highlights concentration, valuation, FOMO, and drawdown risks before action."
  }
];

export function CylinderScrollSection() {
  const { scrollYProgress } = useScroll();

  return (
    <section className="relative min-h-[620vh] bg-ink-950">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="market-grid absolute inset-0 opacity-60" />
        <div className="perspective-stage relative z-10 flex h-full items-center justify-center px-4">
          <div className="preserve-3d relative h-[460px] w-full max-w-5xl">
            {layers.map((layer, index) => (
              <CylinderLayer key={layer.subtitle} index={index} total={layers.length} layer={layer} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
      <div className="sr-only">
        {layers.map((layer) => (
          <section key={layer.subtitle} className="snap-start">
            <h2>{layer.title}</h2>
            <p>{layer.subtitle}</p>
          </section>
        ))}
      </div>
    </section>
  );
}

function CylinderLayer({
  index,
  total,
  layer,
  progress
}: {
  index: number;
  total: number;
  layer: (typeof layers)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const section = index / (total - 1);
  const distance = 1 / (total - 1);
  const rotate = useTransform(progress, [section - distance, section, section + distance], [56, 0, -56]);
  const opacity = useTransform(progress, [section - distance, section, section + distance], [0.08, 1, 0.08]);
  const scale = useTransform(progress, [section - distance, section, section + distance], [0.72, 1, 0.72]);
  const z = useTransform(progress, [section - distance, section, section + distance], [-120, 120, -120]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      style={{ rotateX: rotate, opacity, scale, z }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">{layer.subtitle}</p>
      <h1 className="mt-5 max-w-5xl text-balance font-mono text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
        {layer.title}
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{layer.body}</p>
      {layer.kind === "hero" ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/portfolio-planner" className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-ink-950">
            <PieChart className="h-4 w-4" />
            Plan My Portfolio
          </Link>
          <Link href="/stocks" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white">
            <Search className="h-4 w-4" />
            Analyze Stock
          </Link>
        </div>
      ) : (
        <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky">
          View dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </motion.div>
  );
}
