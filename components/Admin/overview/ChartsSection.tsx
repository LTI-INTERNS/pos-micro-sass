import SalesLineChart from '@/components/Admin/overview/SalesLineChart';
import SalesBarChart from '@/components/Admin/overview/SalesBarChart';

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SalesLineChart />
      </div>
      <SalesBarChart />
    </div>
  );
}