import SalesLineChart from './SalesLineChart';
import SalesBarChart from './SalesBarChart';

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