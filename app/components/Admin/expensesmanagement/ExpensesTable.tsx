"use client";
import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 

export type Expenses = {
  id: string;
  date: string;
  category: string;
  description: string;
  payment: string;
  addedby: string;
};

type Props = {
  Expenses: Expenses[];
};

export default function ExpensesTable({ Expenses }: Props) {
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
      title="Expenses"
      data={Expenses} 
      columns={columns}
      emptyMessage="No Expenses found"
    />
  );
}
