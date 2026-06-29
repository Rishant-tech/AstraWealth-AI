import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="hidden w-full border-collapse md:table">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <tr key={index} className="bg-ink-850/60">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-slate-300">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="divide-y divide-white/10 md:hidden">
        {rows.map((row, index) => (
          <div key={index} className="space-y-3 bg-ink-850/60 p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-slate-500">{column.header}</span>
                <span className="text-right text-slate-200">{column.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
