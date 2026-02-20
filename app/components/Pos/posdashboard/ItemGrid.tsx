"use client";

import ItemCard from "./ItemCard";

type Item = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type Props = {
  search: string;
  onAdd: (item: Item) => void;
};

const items: Item[] = [
  {
    id: 1,
    name: "Burger",
    price: 1200,
    image: "/food/burger.jpg",
  },
  {
    id: 2,
    name: "Pizza",
    price: 2500,
    image: "/food/pizza.jpg",
  },
  {
    id: 3,
    name: "Fries",
    price: 800,
    image: "/food/fries.jpg",
  },
  {
    id: 4,
    name: "Salad",
    price: 1000,
    image: "/food/salad.jpg",
  },
  {
    id: 5,
    name: "Sandwich",
    price: 900,
    image: "/food/burger.jpg",
  },
  {
    id: 6,
    name: "Noodles",
    price: 1100,
    image: "/food/pizza.jpg",
  },
  {
    id: 7,
    name: "Rice",
    price: 1000,
    image: "/food/fries.jpg",
  },
  {
    id: 8,
    name: "Pasta",
    price: 1300,
    image: "/food/salad.jpg",
  },
  {
    id: 9,
    name: "Sushi",
    price: 2000,
    image: "/food/burger.jpg",
  },
  {
    id: 10,
    name: "Tacos",
    price: 1500,
    image: "/food/pizza.jpg",
  }
];


export default function ItemGrid({ search, onAdd }: Props) {
  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasAnyImage = filteredItems.some(
    (i) => i.image && i.image.trim() !== ""
  );

  /* LIST VIEW (no images) */
  if (!hasAnyImage) {
    return (
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onAdd(item)}
            className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-600">{item.name}</span>
            <span className="text-sm font-semibold text-gray-600">LKR {item.price}</span>
          </div>
        ))}
      </div>
    );
  }

  /* GRID VIEW (with images) */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onClick={() => onAdd(item)}
        />
      ))}
    </div>
  );
}
