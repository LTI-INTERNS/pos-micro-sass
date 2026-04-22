import StatCard from '@/components/Admin/common/StatCard';
import { calcStatSummary } from '@/lib/utils/statCardUtils';

type ProfitItem = {
  date: string;
  profit: number;
  [key: string]: unknown;
};

type Props = {
  profits?: ProfitItem[];
};

export default function ProfitStatCardGrid({ profits = [] }: Props) {
  const { total, totalTrend } = calcStatSummary(profits, "date", "profit");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="Total Profit"
        amount={total}
        percentage={totalTrend.label}
        trend={totalTrend.trend}
        caption="from previous 30 days"
        showDetailButton={false}
      />
      <StatCard
        title="Total Profit"
        amount={total}
        percentage={totalTrend.label}
        trend={totalTrend.trend}
        caption="from Last Day"
        showDetailButton={false}
      />
    </div>
  );
}