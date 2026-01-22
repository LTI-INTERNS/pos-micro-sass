import DashboardLayout from '../components/dashboard_layout';
import DateRangeBar from '../components/Dashboard/DateRangeBar';
import StatCardGrid from '../components/Dashboard/StatCardGrid';
import ChartsSection from '../components/Dashboard/ChartsSection';
import StaffReportSection from '@/app/components/Dashboard/StaffReportSection';
import TopSellingSection from '@/app/components/Dashboard/TopSellingSection';


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
