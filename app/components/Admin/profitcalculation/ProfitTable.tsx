"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

export type Profit = {
  id: string;
  date: string;
  category: string;
  description: string;
  profit: number;
  payment: string;
};

type Props = {
  profits: Profit[];
};

export default function ProfitTable({ profits }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Profit>[] = [
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
