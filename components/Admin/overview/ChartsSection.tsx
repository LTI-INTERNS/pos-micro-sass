import SalesLineChart from '@/components/Admin/overview/SalesLineChart';
import SalesBarChart from '@/components/Admin/overview/SalesBarChart';
import type { DateRangeParams } from '@/types/analytics.types';

type Props = { dateRange?: DateRangeParams };

export default function ChartsSection({ dateRange }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SalesLineChart dateRange={dateRange} />
      </div>
      <SalesBarChart dateRange={dateRange} />
    </div>
  );
}