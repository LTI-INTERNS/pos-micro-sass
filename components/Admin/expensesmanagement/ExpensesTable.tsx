"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type Expenses = {
  id: string;
  expenseId: string;
  date: string;
  category: string;
  categoryId: string;
  description: string;
  amount: number;
  payment: string;
  paymentType: "CASH" | "CARD";
  addedby: string;
  branch: string;
  branchId: string;
};

type Props = {
  Expenses: Expenses[];
  showBranch?: boolean;
  selectedExpenseId?: string ;
  onSelectExpense?: (expense: Expenses | null) => void;
};

export default function ExpensesTable({
  Expenses,
  showBranch = false,
  selectedExpenseId,
  onSelectExpense,
}: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Expenses>[] = [
    {
      key: "index",
      label: "",
      render: (_, index) => index + 1,
    },
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
      selectedRowId={selectedExpenseId  }
      onSelectRow={onSelectExpense}
    />
  );
}