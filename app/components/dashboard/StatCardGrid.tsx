import StatCard from './StatCard';
import { reportstatCards } from '@/app/dashboard-report/mockData';
import { predictstatCards } from '@/app/dashboard-predict/mockData';

interface StatCardGridProps {
  type?: 'report' | 'predict';
}

export default function StatCardGrid({ type = 'report' }: StatCardGridProps) {
  const cards = type === 'predict' ? predictstatCards : reportstatCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
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

