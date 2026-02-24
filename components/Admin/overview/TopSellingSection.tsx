import TopSellingItem from '@/components/Admin/overview/TopSellingItem';
import { topSellingItemsData } from '@/lib/mocks/overview/mockData';

export default function TopSellingSection() {
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

      {topSellingItemsData.slice(0, 4).map((item) => (
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