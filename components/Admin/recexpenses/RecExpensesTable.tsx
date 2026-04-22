"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type RecurringExpenses = {
  id: string;
  recExpenseId: string;
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
  RecurringExpenses: RecurringExpenses[];
  showBranch?: boolean;
  selectedRecExpenseId?: string;
  onSelectRecExpense?: (expense: RecurringExpenses | null) => void;
};

export default function RecurringExpensesTable({
  RecurringExpenses,
  showBranch = false,
  selectedRecExpenseId,
  onSelectRecExpense,
}: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<RecurringExpenses>[] = [
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
      ? [{ key: "branch" as keyof RecurringExpenses, label: "Branch" }]
      : []),
  ];

  return (
    <CommonTable
      title="Recurring Expenses"
      data={RecurringExpenses}
      columns={columns}
      emptyMessage="No recurring expenses found"
      selectedRowId={selectedRecExpenseId}
      onSelectRow={onSelectRecExpense}
    />
  );
}