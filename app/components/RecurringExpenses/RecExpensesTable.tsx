"use client";
import CommonTable, { Column } from "@/app/components/Dashboard/common/CommonTable"; 

export type RecurringExpenses = {
  id: string;
  date: string;
  category: string;
  description: string;
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
