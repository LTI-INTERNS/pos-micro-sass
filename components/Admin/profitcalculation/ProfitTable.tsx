"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import type { ProfitRow } from "@/types/analytics.types";

export type { ProfitRow as Profit };

// CommonTable requires T extends { id?: string | number }.
// ProfitRow uses orderId, so we extend it with id for the table.
type ProfitRowWithId = ProfitRow & { id: string };

type Props = {
  rows: ProfitRow[];
  showBranch?: boolean;
};

const METHOD_LABEL: Record<string, string> = {
  CASH:  "Cash",
  CARD:  "Card",
  SPLIT: "Split",
};

export default function ProfitTable({ rows, showBranch = false }: Props) {
  const { currency, useCents } = useCurrency();

  const money = (n: number) => formatCurrency(n, currency, useCents);

  // Add id field so CommonTable's generic constraint is satisfied
  const tableRows: ProfitRowWithId[] = rows.map((r) => ({ ...r, id: r.orderId }));

  const columns: Column<ProfitRowWithId>[] = [
    {
      key:    "id",
      label:  "",
      render: (_, index) => index + 1,
    },
    {
      key:   "orderNumber",
      label: "Order #",
    },
    {
      key:    "date",
      label:  "Date",
      render: (row) =>
        new Date(row.date).toLocaleDateString(undefined, {
          year:  "numeric",
          month: "short",
          day:   "numeric",
        }),
    },
    ...(showBranch
      ? [{ key: "branchName" as keyof ProfitRowWithId, label: "Branch" }]
      : []),
    {
      key:    "paymentMethod",
      label:  "Payment",
      render: (row) => METHOD_LABEL[row.paymentMethod] ?? row.paymentMethod,
    },
    {
      key:    "revenue",
      label:  "Revenue",
      render: (row) => money(row.revenue),
    },
    {
      key:    "discountAmount",
      label:  "Discount",
      render: (row) =>
        row.discountAmount > 0 ? (
          <span className="text-orange-500">- {money(row.discountAmount)}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key:    "cogs",
      label:  "COGS",
      render: (row) => money(row.cogs),
    },
    {
      key:    "grossProfit",
      label:  "Gross Profit",
      render: (row) => (
        <span
          className={
            row.grossProfit >= 0
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {money(row.grossProfit)}
        </span>
      ),
    },
    {
      key:    "marginPct",
      label:  "Margin %",
      render: (row) => (
        <span className={row.marginPct >= 0 ? "text-green-600" : "text-red-500"}>
          {row.marginPct.toFixed(1)}%
        </span>
      ),
    },
  ];

  return (
    <CommonTable
      title="Profit by Order"
      data={tableRows}
      columns={columns}
      emptyMessage="No profit data found for the selected period"
    />
  );
}