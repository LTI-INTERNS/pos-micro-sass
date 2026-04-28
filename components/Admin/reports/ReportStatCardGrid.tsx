"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import StatCard from "@/components/Admin/common/StatCard";
import { calcStatSummary } from "@/lib/utils/statCardUtils";
import type { SaleRow, ExpenseRow } from "@/app/reports/reportsMockData";
import { expenseApi, ExpenseApiItem } from "@/lib/api/expenses";

// ✅ map API → ExpenseRow (same as table)
const mapExpense = (item: ExpenseApiItem): ExpenseRow => ({
  id: item.expensesId,
  date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
  category: item.category?.category ?? "",
  description: item.description ?? "",
  approvedBy: item.addedByName ?? "",
  amount: Number(item.amount ?? 0),
  branch: item.branch?.name ?? "",
});

type Props = {
  sales?: SaleRow[];
  expenses?: ExpenseRow[]; // fallback only
  transactionCount?: number;
};

export default function ReportStatCardGrid({
  sales = [],
  expenses = [],
  transactionCount = 0,
}: Props) {
  const { data: session, status } = useSession();

  // ✅ real expenses state
  const [realExpenses, setRealExpenses] = useState<ExpenseRow[]>([]);

  // 🔹 fetch real expenses
  useEffect(() => {
    if (status !== "authenticated") return;

    expenseApi
      .getExpenses(session)
      .then((rows) => setRealExpenses(rows.map(mapExpense)))
      .catch(() => setRealExpenses([]));
  }, [status]);

  // ✅ use real data if available
  const finalExpenses = realExpenses.length > 0 ? realExpenses : expenses;

  // ✅ stats calculation (same logic, but now real data)
  const salesStats   = calcStatSummary(sales, "date", "amount");
  const expenseStats = calcStatSummary(finalExpenses, "date", "amount");

  const netProfit = salesStats.total - expenseStats.total;

  // 🔥 better trend for profit
  const netProfitTrend =
    netProfit >= 0
      ? { label: "+0.0%", trend: "up" as const }
      : { label: "-0.0%", trend: "down" as const };

  const statCards = [
    {
      title: "Total Sales",
      amount: salesStats.total,
      percentage: salesStats.totalTrend.label,
      trend: salesStats.totalTrend.trend,
      caption: "from previous 30 days",
    },
    {
      title: "Total Expenses",
      amount: expenseStats.total,
      percentage: expenseStats.totalTrend.label,
      trend: expenseStats.totalTrend.trend,
      caption: "from previous 30 days",
    },
    {
      title: "Net Profit",
      amount: netProfit,
      percentage: netProfitTrend.label,
      trend: netProfitTrend.trend,
      caption: "from previous 30 days",
    },
    {
      title: "Transactions Count",
      value: String(transactionCount),
      percentage: "+0.0%",
      trend: "up" as const,
      caption: "total in dataset",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((s) => (
        <StatCard
          key={s.title}
          title={s.title}
          amount={s.amount}
          value={s.value}
          percentage={s.percentage}
          trend={s.trend}
          caption={s.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}