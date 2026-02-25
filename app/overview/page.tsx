import DashboardLayout from '@/components/Admin/common/dashboard_layout';
import DateRangeBar from '@/components/Admin/common/DateRangeBar';
import StatCardGrid from '@/components/Admin/overview/StatCardGrid';
import ChartsSection from '@/components/Admin/overview/ChartsSection';
import StaffReportSection from '@/components/Admin/overview/StaffReportSection';
import TopSellingSection from '@/components/Admin/overview/TopSellingSection';


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