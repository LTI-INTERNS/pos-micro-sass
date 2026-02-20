import StatCard from "@/app/components/Admin/common/StatCard";

const statCards = [
  {
    title: "Avg. Customer Value",
    amount: 342.00,
    percentage: "+2.5%",
    trend: "up" as const,
    caption: "vs last month",
  },
  {
    title: "Predicted New Customers",
    value: "+350",
    percentage: "+1.5%",
    trend: "down" as const,
    caption: "vs last month",
  },
  {
    title: "Churn Risk Customer",
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
          amount={card.amount}
          percentage={card.percentage}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}
