import StatCard from '@/app/components/StatCard';
import { supplierStatCards } from '@/app/Dashboard/mockData';

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