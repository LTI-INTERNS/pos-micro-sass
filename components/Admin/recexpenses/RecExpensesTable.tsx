"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type RecurringExpenses = {
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
  RecurringExpenses: RecurringExpenses[];
  showBranch?: boolean;
};

export default function RecurringExpensesTable({ RecurringExpenses, showBranch = false }: Props) {
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
    ...(showBranch
          ? [{ key: "branch" as keyof RecurringExpenses, label: "Branch" }]
          : []),
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
