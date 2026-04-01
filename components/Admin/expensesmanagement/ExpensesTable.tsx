"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type Expenses = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment: string;
  addedby: string;
  branch: string;
};

type Props = {
  Expenses: Expenses[];
  showBranch?: boolean;
};

export default function ExpensesTable({ Expenses, showBranch = false }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Expenses>[] = [
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount, currency, useCents),
    },
    { key: "payment", label: "Payment Type" },
    { key: "addedby", label: "Added By" },
    ...(showBranch
      ? [{ key: "branch" as keyof Expenses, label: "Branch" }]
      : []),
  ];

  return (
    <CommonTable
      title="Expenses"
      data={Expenses}
      columns={columns}
      emptyMessage="No Expenses found"
    />
  );
}