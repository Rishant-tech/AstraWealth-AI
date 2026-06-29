import { Card } from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { InstrumentDirectory } from "@/components/InstrumentDirectory";
import { PageHeader } from "@/components/PageHeader";
import { SearchBox } from "@/components/SearchBox";
import { Shell } from "@/components/Shell";
import { getFunds, safe } from "@/lib/api";
import { inr, pct, plainPct } from "@/lib/format";
import type { Fund } from "@/types/api";

export default async function FundsPage() {
  const funds = (await safe(getFunds())) || [];
  return (
    <Shell>
      <PageHeader eyebrow="Mutual fund analyzer" title="Search fund categories" description="Compare category-level mock funds by returns, cost, AUM, drawdown, risk-adjusted placeholders, and suitability." />
      <div className="space-y-6">
        <DisclaimerBanner />
        <SearchBox type="funds" />
        <Card title="Mutual funds A-Z" eyebrow="Directory">
          <InstrumentDirectory
            emptyText="No mutual fund category available under this alphabet in the current universe."
            items={funds.map((fund) => ({
              id: fund.id,
              title: fund.name,
              subtitle: fund.category,
              meta: `${fund.riskLevel} risk · ${fund.suitableFor}`,
              href: `/funds/${fund.id}`
            }))}
          />
        </Card>
        <Card title="Mutual fund universe" eyebrow="Categories">
          <DataTable<Fund>
            rows={funds}
            columns={[
              { key: "name", header: "Fund", render: (row) => row.name },
              { key: "category", header: "Category", render: (row) => row.category },
              { key: "nav", header: "NAV", render: (row) => inr(row.nav) },
              { key: "returns", header: "3Y", render: (row) => pct(row.return3Y) },
              { key: "expense", header: "Expense", render: (row) => plainPct(row.expenseRatio) },
              { key: "risk", header: "Risk", render: (row) => row.riskLevel }
            ]}
          />
        </Card>
      </div>
    </Shell>
  );
}
