"use client";

import StatCard from "@/app/components/Admin/common/StatCard";
import { REPORT_STATS } from "@/app/reports/reportsMockData";

export default function ReportStatCardGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {REPORT_STATS.map((s) => (
        <StatCard
          key={s.title}
          title={s.title}
          value={s.value}
          amount={s.amount}
          percentage={s.percentage}
          trend={s.trend}
          caption={s.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}
