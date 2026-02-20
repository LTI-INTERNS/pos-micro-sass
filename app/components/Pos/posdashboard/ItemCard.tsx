"use client";

import React from "react";
import { Package } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

type Item = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type Props = {
  item: Item;
  onClick: () => void;
};

export default function ItemCard({ item, onClick }: Props) {
  const { currency, useCents } = useCurrency();

  const hasImage = Boolean(item.image);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition active:scale-95
        ${hasImage
          ? "bg-white rounded-xl shadow-sm hover:shadow-md"
          : "flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        }`}
    >
      {/* IMAGE OR ICON */}
      {hasImage ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover rounded-t-xl"
        />
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-500" />
          </div>

          <div>
            <p className="font-medium text-sm text-black">{item.name}</p>
            <p className="text-xs text-gray-500">No image</p>
          </div>
        </div>
      )}

      {/* DETAILS */}
      {hasImage ? (
        <div className="p-3 text-center">
          <p className="text-sm font-semibold text-black">{item.name}</p>
          <p className="text-xs text-orange-500">{formatCurrency(item.price, currency, useCents)}</p> 
        </div>
      ) : (
        <p className="text-sm font-semibold text-orange-600">
          {formatCurrency(item.price, currency)}
        </p>
      )}
    </div>
  );
}
