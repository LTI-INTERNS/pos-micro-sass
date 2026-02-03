import StatCard from '../common/StatCard';
import { statCards } from '@/app/overview/mock/mockData';

export default function StatCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          percentage={card.percentage}
          trend={card.trend as 'up' | 'down'}
          caption={card.caption}
          showDetailButton={true}
        />
      ))}
    </div>
  );
}