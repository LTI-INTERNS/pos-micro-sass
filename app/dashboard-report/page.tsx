import DashboardLayout from '../components/dashboard_layout';
import DateRangeBar from '../components/dashboard/DateRangeBar';
import StatCardGrid from '../components/dashboard/StatCardGrid';
import ChartsSection from '../components/dashboard/ChartsSection';
import StaffReportSection from '@/app/components/dashboard/StaffReportSection';
import TopSellingSection from '@/app/components/dashboard/TopSellingSection';


export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DateRangeBar />
        <StatCardGrid />
        <ChartsSection />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <StaffReportSection />
        <TopSellingSection />
      </div>

    </DashboardLayout>
  );
}
