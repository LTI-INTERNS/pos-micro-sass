"use client";

import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangeBar from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/overview/StatCardGrid";
import ChartsSection from "@/components/Admin/overview/ChartsSection";
import StaffReportSection from "@/components/Admin/overview/StaffReportSection";
import TopSellingSection from "@/components/Admin/overview/TopSellingSection";
import type { DateRangeParams } from "@/types/analytics.types";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeParams | undefined>(undefined);

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DateRangeBar onChange={handleDateChange} />
        <StatCardGrid dateRange={dateRange} />
        <ChartsSection />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <StaffReportSection dateRange={dateRange} />
        <TopSellingSection  dateRange={dateRange} />
      </div>
    </DashboardLayout>
  );
}