import StatCard from "@/components/Admin/common/StatCard";
import { calcStatSummary } from "@/lib/utils/statCardUtils";
import { RecurringExpenses } from "@/components/Admin/recexpenses/RecExpensesTable";

type Props = {
  recurringexpenses?: RecurringExpenses[];
};

export default function StatCardGrid({ recurringexpenses = [] }: Props) {
  const { total, thisMonthTotal, totalTrend, monthlyTrend } = calcStatSummary(
    recurringexpenses,
    "date",
    "amount"
  );

  const statCards = [
    {
      title: "Total Recurring Expenses",
      amount: total,
      percentage: totalTrend.label,
      trend: totalTrend.trend,
      caption: "from previous 30 days",
    },
    {
      title: "New Recurring Expenses (This Month)",
      amount: thisMonthTotal,
      percentage: monthlyTrend.label,
      trend: monthlyTrend.trend,
      caption: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          amount={card.amount}
          percentage={card.percentage}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}