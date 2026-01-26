import StatCard from '../common/StatCard';
export const branchStatCards = [
  {
    title: "All Branches",
    value: "342",
    percentage: "+4.2%",
    trend: "up",
  },
  
];


export default function BranchCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {branchStatCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          trend={card.trend as 'up' | 'down'}
        />
      ))}
    </div>
  );
}
