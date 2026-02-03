"use client";
import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 

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
      label: "Amount (LKR)",
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
