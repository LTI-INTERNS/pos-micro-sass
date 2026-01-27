"use client";

import FoodCard from "./FoodCard";

type Props = {
  search: string;
  onAdd: (food: any) => void;
};

const foods = [
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
    image: "/food/sandwich.png",
  },
  {
    id: 6,
    name: "Noodles",
    price: 1100,
    image: "/food/noodles.png",
  },
  {
    id: 7,
    name: "Rice",
    price: 1000,
    image: "/food/rice.png",
  },
  {
    id: 8,
    name: "Pasta",
    price: 1300,
    image: "/food/pasta.png",
  },
  {
    id: 9,
    name: "Sushi",
    price: 2000,
    image: "/food/sushi.png",
  },
  {
    id: 10,
    name: "Tacos",
    price: 1500,
    image: "/food/tacos.png",
  }
];

export default function FoodGrid({ search, onAdd }: Props) {
  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredFoods.map((food) =>  (
        <FoodCard
          key={food.id}
          item={food}
          onClick={ () => onAdd(food)}
         />
      ))}
    </div>
  )
}
