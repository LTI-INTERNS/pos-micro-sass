"use client";

type FoodItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};
type Props = {
  item: FoodItem;
};

export default function FoodCard({ item }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="h-36 w-full object-cover rounded-t-xl"
      />

      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900">
          {item.name}
        </p>
        <p className="text-sm text-orange-500 font-bold">
          LKR {item.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
