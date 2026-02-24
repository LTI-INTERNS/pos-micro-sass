import StatCard from '@/components/Admin/common/StatCard';
import type { Supplier } from '@/components/Admin/suppliermanagement/SupplierTable';

type Props = {
  suppliers?: Supplier[];
  isSuperAdmin?: boolean;
};

export default function StatCardGrid({ suppliers = [], isSuperAdmin = false }: Props) {
  const allCount = suppliers.length;

  const thisMonthCount = suppliers.filter((s) => s.id > 2).length;
  const lastMonthCount = suppliers.filter((s) => s.id <= 2).length;

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
      {/* All roles see this card */}
      <StatCard
        title="All Suppliers"
        value={String(allCount)}
        percentage="+0.0%"
        trend="up"
        caption="total registered"
        showDetailButton={false}
      />

      {/* Superadmin only */}
      {isSuperAdmin && (
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