"use client";

import StatCard from "@/app/components/Admin/common/StatCard";
import { calcStatSummary } from "@/app/utils/statCardUtils";
import type { SaleRow, ExpenseRow } from "@/app/reports/reportsMockData";

type Props = {
  sales?: SaleRow[];
  expenses?: ExpenseRow[];
  transactionCount?: number;
};

export default function ReportStatCardGrid({
  sales = [],
  expenses = [],
  transactionCount = 0,
}: Props) {
  const salesStats   = calcStatSummary(sales,    "date", "amount");
  const expenseStats = calcStatSummary(expenses, "date", "amount");

  const netProfit      = salesStats.total - expenseStats.total;
  const netProfitTrend = salesStats.totalTrend;

  const statCards = [
    {
      title:      "Total Sales",
      amount:     salesStats.total,
      percentage: salesStats.totalTrend.label,
      trend:      salesStats.totalTrend.trend,
      caption:    "from previous 30 days",
    },
    {
      title:      "Total Expenses",
      amount:     expenseStats.total,
      percentage: expenseStats.totalTrend.label,
      trend:      expenseStats.totalTrend.trend,
      caption:    "from previous 30 days",
    },
    {
      title:      "Net Profit",
      amount:     netProfit,
      percentage: netProfitTrend.label,
      trend:      netProfitTrend.trend,
      caption:    "from previous 30 days",
    },
    {
      title:      "Transactions Count",
      value:      String(transactionCount),
      percentage: "+0.0%",
      trend:      "up" as const,
      caption:    "total in dataset",
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