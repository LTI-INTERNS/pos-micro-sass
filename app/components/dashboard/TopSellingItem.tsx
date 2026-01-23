type TopSellingItemProps = {
  name: string;
  image: string;
  price: string;
  percentage: string;
  trend: 'up' | 'down';
};

export default function TopSellingItem({
  name,
  image,
  price,
  percentage,
  trend,
}: TopSellingItemProps) {
  const isUp = trend === 'up';

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <span className="text-sm font-medium text-gray-800 line-clamp-2 max-w-[180px]">
          {name}
        </span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">{price}</p>
        <p
          className={`text-xs ${
            isUp ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {percentage}
        </p>
      </div>
    </div>
  );
}
