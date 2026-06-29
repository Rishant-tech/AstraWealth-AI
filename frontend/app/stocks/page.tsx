import { Card } from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { InstrumentDirectory } from "@/components/InstrumentDirectory";
import { PageHeader } from "@/components/PageHeader";
import { SearchBox } from "@/components/SearchBox";
import { Shell } from "@/components/Shell";
import { getStocks, safe } from "@/lib/api";
import { inr, pct } from "@/lib/format";
import type { Stock } from "@/types/api";

export default async function StocksPage() {
  const stocks = (await safe(getStocks())) || [];
  return (
    <Shell>
      <PageHeader eyebrow="Stock analyzer" title="Search Indian stocks" description="Analyze fundamentals, valuation, technical trend, sentiment placeholders, risk factors, and scenario projections." />
      <div className="space-y-6">
        <DisclaimerBanner />
        <SearchBox type="stocks" />
        <Card title="Stocks A-Z" eyebrow="Directory">
          <InstrumentDirectory
            emptyText="No stock available under this alphabet in the current universe."
            items={stocks.map((stock) => ({
              id: stock.symbol,
              title: stock.symbol,
              subtitle: stock.name,
              meta: stock.sector,
              href: `/stocks/${stock.symbol}`
            }))}
          />
        </Card>
        <Card title="Stock universe" eyebrow="Live-enabled">
          <DataTable<Stock>
            rows={stocks}
            columns={[
              { key: "symbol", header: "Symbol", render: (row) => row.symbol },
              { key: "name", header: "Name", render: (row) => row.name },
              { key: "price", header: "Price", render: (row) => inr(row.currentPrice) },
              { key: "return", header: "1Y", render: (row) => pct(row.return1Y) },
              { key: "pe", header: "PE", render: (row) => row.peRatio.toFixed(1) },
              { key: "roe", header: "ROE", render: (row) => pct(row.roe) },
              { key: "source", header: "Source", render: (row) => row.dataSource || "mock-seed" }
            ]}
          />
        </Card>
      </div>
    </Shell>
  );
}
