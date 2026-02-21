"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

export type RecurringExpenses = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment: string;
  addedby: string;
};

type Props = {
  RecurringExpenses: RecurringExpenses[];
};

export default function RecurringExpensesTable({ RecurringExpenses }: Props) {
  const { currency, useCents } = useCurrency();
  
  const columns: Column<RecurringExpenses>[] = [
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
      label: "Payment",
    },
    {
      key: "addedby",
      label: "Added By",
    },
  ];

  return (
    <CommonTable
      title="Recurring Expenses"
      data={RecurringExpenses} 
      columns={columns}
      emptyMessage="No recurring expenses found"
    />
  );
}
