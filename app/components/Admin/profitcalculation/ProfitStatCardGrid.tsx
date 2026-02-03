import StatCard from '@/app/components/Admin/common/StatCard';;

const statCards = [
  {
    title: "Total Profit",
    value: "LKR 34,250",
    percentage: "+4.2%",
    trend: "up" as const,
    caption: "vs last month",
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
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}