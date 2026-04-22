import StatCard from '@/components/Admin/common/StatCard';

const statCards = [
  {
    title: "New Branches",
    value: "4",
    percentage: "+4.2%",
    trend: "up" as const,
    caption: "vs last month",
  },
  {
    title: "All Branches",
    value: "13",
    percentage: "-1.5%",
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
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}