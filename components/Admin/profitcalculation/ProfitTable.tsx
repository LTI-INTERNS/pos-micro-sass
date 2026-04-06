"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type Profit = {
  id: string;
  date: string;
  category: string;
  description: string;
  profit: number;
  payment: string;
  branch: string;
};

type Props = {
  profits: Profit[];
  showBranch?: boolean;
};

export default function ProfitTable({ profits, showBranch = false }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Profit>[] = [
     {
    key: "index",
    label: "#",
    render: (_, index) => index + 1,
  },
    {
      key: "id",
      label: "ID",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "description",
      label: "Description",
    },
    { 
      key: "profit", 
      label: "Profit", 
      render: (row) => formatCurrency(row.profit, currency, useCents) 
    },
    {
      key: "payment",
      label: "Payment",
    },
    ...(showBranch
          ? [{ key: "branch" as keyof Profit, label: "Branch" }]
          : []),
  ];

  return (
    <CommonTable
      title="Profits"
      data={profits}
      columns={columns}
      emptyMessage="No profits found"
    />
  );
}
