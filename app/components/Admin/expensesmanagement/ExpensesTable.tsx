"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

export type Expenses = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment: string;
  addedby: string;
};

type Props = {
  Expenses: Expenses[];
};

export default function ExpensesTable({ Expenses }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Expenses>[] = [
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
      key: "amount", 
      label: "Amount", 
      render: (row) => formatCurrency(row.amount, currency, useCents) 
    },
    {
      key: "payment",
      label: "Payment Type",
    },
    {
      key: "addedby",
      label: "Added By",
    },
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
