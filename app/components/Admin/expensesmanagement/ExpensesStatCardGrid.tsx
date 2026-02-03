import StatCard from '@/app/components/Admin/common/StatCard';;

const statCards = [
  {
    title: "Total Expenses",
    value: "LKR 34,250",
    percentage: "+4.2%",
    trend: "up" as const,
  },
  {
    title: "New Expenses",
    value: "LKR 12,000",
    percentage: "-1.5%",
    trend: "down" as const,
  },
];
  
export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          trend={card.trend as 'up' | 'down'}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}