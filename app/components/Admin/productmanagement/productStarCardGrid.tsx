import StatCard from "@/app/components/Admin/common/StatCard";

const statCards = [
  {
    title: "All Products",
    value: "342",
    percentage: "+2.5%",
    trend: "up" as const,
    caption: "vs last month",
  },
  {
    title: "New Products",
    value: "12",
    percentage: "+1.5%",
    trend: "down" as const,
    caption: "vs last month",
  },
  {
    title: "Low Stock",
    value: "12",
    percentage: "+1.5%",
    trend: "down" as const,
    caption: "vs last month",
  },
  {
    title: "Available Stock",
    value: "12",
    percentage: "+1.5%",
    trend: "down" as const,
    caption: "vs last month",
  },
];

export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}
