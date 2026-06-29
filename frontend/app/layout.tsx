import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Gem, Home, LineChart, PieChart, Search, Settings, Star } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstraWealth AI",
  description: "Scenario-based AI investment analysis for Indian assets."
};

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/portfolio-planner", label: "Planner", icon: PieChart },
  { href: "/stocks", label: "Stocks", icon: Search },
  { href: "/funds", label: "Funds", icon: LineChart },
  { href: "/gold-silver", label: "Gold/Silver", icon: Gem },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-teal/30 bg-teal/10 text-sm font-bold text-teal">
                  AW
                </span>
                <span className="text-sm font-semibold text-white sm:text-base">AstraWealth AI</span>
              </Link>
              <nav className="hidden items-center gap-1 lg:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/portfolio-planner"
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-teal/90"
              >
                Plan
              </Link>
            </div>
          </header>
          <main className="pt-16">{children}</main>
          <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-ink-950/90 backdrop-blur-xl lg:hidden">
            <div className="grid grid-cols-5 px-2 py-2">
              {navItems.slice(0, 5).map((item) => (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] text-slate-300">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
