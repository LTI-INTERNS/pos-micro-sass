import StatCard from '../common/StatCard';
export const supplierStatCards = [
  {
    title: "All Suppliers",
    value: "342",
    percentage: "+4.2%",
    trend: "up",
  },
  {
    title: "New Suppliers",
    value: "12",
    percentage: "-1.5%",
    trend: "down",
  },
  
];


export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {supplierStatCards.map((card) => (
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
