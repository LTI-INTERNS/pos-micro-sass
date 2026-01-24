import StatCard from '@/app/components/Admin/common/StatCard';

const statCards = [
  {
    title: "new Branches",
    value: "34,250 LKR",
    percentage: "+4.2%",
    trend: "up" as const,
  },
];
  
export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
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