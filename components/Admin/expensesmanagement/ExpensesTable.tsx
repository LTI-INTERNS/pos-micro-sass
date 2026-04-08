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
  onEdit?: (expense: Expenses) => void;
  onDelete?: (expense: Expenses) => void;
};

export default function ExpensesTable({
  Expenses,
  showBranch = false,
  onEdit,
  onDelete,
}: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Expenses>[] = [
    {
      key: "index",
      label: "#",
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
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(row)}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:bg-black/5"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(row)}
            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      ),
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