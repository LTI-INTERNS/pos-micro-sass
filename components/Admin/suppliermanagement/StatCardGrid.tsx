import StatCard from "@/components/Admin/common/StatCard";
import type { Supplier } from "@/types/supplier.types";

type Props = {
  suppliers?: Supplier[];
  userRole?: "owner" | "admin" | "manager";
};

export default function StatCardGrid({
  suppliers = [],
  userRole = "manager",
}: Props) {
  const canViewExtraStats = userRole === "owner" || userRole === "admin";

  const allCount = suppliers.length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousYear = previousMonthDate.getFullYear();

  const thisMonthCount = suppliers.filter((s) => {
    if (!s.createdAt) return false;
    const date = new Date(s.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const lastMonthCount = suppliers.filter((s) => {
    if (!s.createdAt) return false;
    const date = new Date(s.createdAt);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  }).length;

  const calcTrend = (current: number, previous: number) => {
    if (previous === 0) return { label: "+0.0%", trend: "up" as const };

    const diff = ((current - previous) / previous) * 100;

    return {
      label: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`,
      trend: (diff >= 0 ? "up" : "down") as "up" | "down",
    };
  };

  const newTrend = calcTrend(thisMonthCount, lastMonthCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      <StatCard
        title="All Suppliers"
        value={String(allCount)}
        percentage="+0.0%"
        trend="up"
        caption="total registered"
        showDetailButton={false}
      />

      {canViewExtraStats && (
        <StatCard
          title="New Suppliers"
          value={String(thisMonthCount)}
          percentage={newTrend.label}
          trend={newTrend.trend}
          caption="vs last month"
          showDetailButton={false}
        />
      )}
    </div>
  );
}