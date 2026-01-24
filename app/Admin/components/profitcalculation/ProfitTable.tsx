"use client";

import CommonTable, { Column } from "@/app/Admin/components/common/CommonTable"; 

export type Profit = {
  id: string;
  date: string;
  category: string;
  description: string;
  profit: string;
  payment: string;
};

type Props = {
  profits: Profit[];
};

export default function ProfitTable({ profits }: Props) {
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
