import StatCard from '@/components/Admin/common/StatCard';
import { calcStatSummary } from '@/lib/utils/statCardUtils';
import { Expenses } from '@/components/Admin/expensesmanagement/ExpensesTable';

type Props = {
  expenses?: Expenses[];
};

export default function StatCardGrid({ expenses = [] }: Props) {
  const { total, thisMonthTotal, totalTrend, monthlyTrend } = calcStatSummary(
    expenses,
    "date",
    "amount"
  );

  const statCards = [
    {
      title: "Total Expenses",
      amount: total,
      percentage: totalTrend.label,
      trend: totalTrend.trend,
      caption: "from previous 30 days",
    },
    {
      title: "New Expenses (This Month)",
      amount: thisMonthTotal,
      percentage: monthlyTrend.label,
      trend: monthlyTrend.trend,
      caption: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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