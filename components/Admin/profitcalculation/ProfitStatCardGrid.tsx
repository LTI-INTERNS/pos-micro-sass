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
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
      <StatCard
        title="Total Profit"
        amount={total}
        percentage={totalTrend.label}
        trend={totalTrend.trend}
        caption="from previous 30 days"
        showDetailButton={false}
      />
    </div>
  );
}