"use client";
import { analyticsService } from '@/lib/services';
import { useEffect, useState } from 'react';
import TopSellingItem from '@/components/Admin/overview/TopSellingItem';

type TopSellingData = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  percentage: string;
  trend: 'up' | 'down';
};

export default function TopSellingSection() {
  const [topSellingItems, setTopSellingItems] = useState<TopSellingData[]>([]);

  useEffect(() => {
    analyticsService.getTopSelling().then(setTopSellingItems);
  }, []);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">
          Top selling items
        </h3>
        <button className="text-sm text-orange-500 font-medium hover:underline">
          View All
        </button>
      </div>

      {topSellingItems.slice(0, 4).map((item) => (
        <TopSellingItem
          key={item.id}
          name={item.name}
          image={item.image}
          price={item.price}
          percentage={item.percentage}
          trend={item.trend as 'up' | 'down'}
        />
      ))}
    </div>
  );
}