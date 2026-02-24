
"use client";

import { useRouter } from 'next/navigation';
import StatCard from '@/components/Admin/common/StatCard';
import { statCards } from '@/lib/mocks/overview/mockData';

export default function StatCardGrid() {
  const router = useRouter();

  const handleDetailClick = (title: string) => {
    const routeMap: Record<string, string> = {
      "Customers": "/customermanagement",
      "Low Stock Products": "/productmanagement",
      "Total Sales": "/reports",
      "Expenses": "/expensesmanagement",
    };

    const route = routeMap[title];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          amount={card.amount}
          percentage={card.percentage}
          trend={card.trend as 'up' | 'down'}
          caption={card.caption}
          showDetailButton={true}
          onDetailClick={() => handleDetailClick(card.title)}
        />
      ))}
    </div>
  );
}