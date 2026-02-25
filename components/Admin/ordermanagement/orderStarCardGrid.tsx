import StatCard from "@/components/Admin/common/StatCard";

type Order = {
  id: number;
  dateTime?: string;
  branch?: string;
  cashier?: string;
  paymenttype?: string;
  totalamount?: number;
  status?: string;
  action?: string;
};

type Props = {
  /**
   * Pass role-filtered orders from the page.
   * - superadmin: all orders
   * - admin/manager: only their branch orders
   */
  orders: Order[];
};

function parseOrderDate(dateTime?: string): Date | null {
  if (!dateTime) return null;
  const d = new Date(dateTime);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function StatCardGrid({ orders }: Props) {
  const allOrdersCount = orders.length;

  // Prefer status-based "New" if your data has it.
  const statusNewCount = orders.filter(
    (o) => (o.status ?? "").toLowerCase() === "new"
  ).length;

  // Fallback: treat orders from last 7 days as "New Orders"
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const recentOrdersCount = orders.filter((o) => {
    const d = parseOrderDate(o.dateTime);
    return d ? d >= sevenDaysAgo && d <= now : false;
  }).length;

  const newOrdersCount = statusNewCount > 0 ? statusNewCount : recentOrdersCount;

  const statCards = [
    {
      title: "All Orders",
      value: String(allOrdersCount),
      percentage: "+2.5%",
      trend: "up" as const,
      caption: "vs last month",
    },
    {
      title: "New Orders",
      value: String(newOrdersCount),
      percentage: "+1.5%",
      trend: "down" as const,
      caption: "vs last month",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          // Keep these props, but hide them if empty (safe for future)
          percentage={card.percentage}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}