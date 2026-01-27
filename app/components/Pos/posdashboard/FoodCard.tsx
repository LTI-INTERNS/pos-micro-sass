"use client";
import React from "react";

type FoodItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Props = {
  item: FoodItem;
  onClick: () => void;
};

export default function FoodCard({ item, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md
                 transition cursor-pointer active:scale-95"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover rounded-t-xl"
      />

      <div className="p-3">
        <p className="text-sm font-semibold text-center text-black">{item.name}</p>
        <p className="text-xs  text-center text-orange-500">LKR {item.price}</p>
      </div>
    </div>
  );
}
