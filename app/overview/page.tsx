"use client";

import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangeBar from "@/components/Admin/common/DateRangeBar";
import RefreshButton from "@/components/Admin/common/RefreshButton";
import StatCardGrid from "@/components/Admin/overview/StatCardGrid";
import ChartsSection from "@/components/Admin/overview/ChartsSection";
import StaffReportSection from "@/components/Admin/overview/StaffReportSection";
import TopSellingSection from "@/components/Admin/overview/TopSellingSection";
import type { DateRangeParams } from "@/types/analytics.types";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeParams | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    if (start && end) {
      setDateRange({
        startDate: format(start, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate:   format(end,   "yyyy-MM-dd'T'HH:mm:ss"),
      });
    } else {
      // Picker cleared — backend defaults to last 30 days
      setDateRange(undefined);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <DateRangeBar onChange={handleDateChange} />
        <RefreshButton onClick={handleRefresh} loading={refreshing} title="Refresh dashboard" />
      </div>

      <div key={refreshKey}>
        <div className="space-y-8">
          <StatCardGrid dateRange={dateRange} />
          <ChartsSection dateRange={dateRange} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <StaffReportSection dateRange={dateRange} />
          <TopSellingSection  dateRange={dateRange} />
        </div>
      </div>
    </DashboardLayout>
  );
}