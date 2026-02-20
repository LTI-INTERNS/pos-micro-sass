import StatCard from '@/app/components/Admin/common/StatCard';;

const statCards = [
  {
    title: "Total Profit",
    amount: 34250,
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
          amount={card.amount}
          percentage={card.percentage}
          trend={card.trend as 'up' | 'down'}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}