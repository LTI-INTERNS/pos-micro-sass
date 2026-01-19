type StatCardProps = {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
};

export default function StatCard({
  title,
  value,
  percentage,
  trend,
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

     
    </div>
  );
}