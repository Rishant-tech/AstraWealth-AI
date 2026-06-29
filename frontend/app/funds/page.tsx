import { Card } from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
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
        <Card title="Seed mutual fund universe" eyebrow="Mock data">
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
