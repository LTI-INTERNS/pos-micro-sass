type StatCardProps = {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  showDetailButton?: boolean;
};

export default function StatCard({
  title,
  value,
  percentage,
  trend,
  showDetailButton = true, 
}: StatCardProps) {
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-medium text-black">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        <p
          className={`mt-1 text-sm ${
            isUp ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {percentage} <span className="text-gray-400">from last month</span>
        </p>
      </div>

      {showDetailButton && (
        <button className="mt-4 text-sm font-medium text-orange-500 flex items-center gap-1">
          View detail →
        </button>
      )}
    </div>
  );
}