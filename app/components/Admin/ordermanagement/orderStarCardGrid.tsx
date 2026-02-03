import StatCard from "@/app/components/Admin/common/StatCard";

const statCards = [
  {
    title: "All Orders",
    value: "342",
    percentage: "+2.5%",
    trend: "up" as const,
    caption: "vs last month",
  },
  {
    title: "New Orders",
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
