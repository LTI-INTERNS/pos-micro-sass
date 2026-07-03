"use client";

import React from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
  availability?: boolean;
  stockQty?: number;
};

type Props = {
  item: Item;
  onClick: () => void;
  disabled?: boolean;
};

export default function ItemCard({ item, onClick, disabled = false }: Props) {
  const { currency, useCents } = useCurrency();

  const hasImage = Boolean(item.image?.trim());
  const stockQty = Number(item.stockQty ?? 0);
  const outOfStock = !item.availability || stockQty <= 0;
  const lowStock = !outOfStock && stockQty <= 5;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`transition
        ${disabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer active:scale-95"}
        ${hasImage
          ? `bg-white rounded-xl shadow-sm ${disabled ? "" : "hover:shadow-md"}`
          : `flex items-center justify-between p-3 border rounded-lg ${disabled ? "" : "hover:bg-gray-50"}`
        }`}
    >
      {/* IMAGE OR ICON */}
      {hasImage ? (
        <div className="relative w-full h-32 rounded-t-xl overflow-hidden">
          {(outOfStock || lowStock) && (
            <span className={`absolute top-2 right-2 z-10 rounded-full px-2 py-1 text-[10px] font-semibold text-white ${outOfStock ? "bg-red-600" : "bg-amber-500"}`}>
              {outOfStock ? "Out of stock" : `Low stock: ${stockQty}`}
            </span>
          )}
          <Image
            src={item.image!}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-500" />
          </div>

          <div>
            <p className="font-medium text-sm text-black">{item.name}</p>
            <p className="text-xs text-gray-500">
              {outOfStock ? "Out of stock" : lowStock ? `Low stock: ${stockQty}` : "No image"}
            </p>
          </div>
        </div>
      )}

      {/* DETAILS */}
      {hasImage ? (
        <div className="p-3 text-center">
          <p className="text-sm font-semibold text-black">{item.name}</p>
          <p className="text-xs text-orange-500">
            {formatCurrency(item.price, currency, useCents)}
          </p>
          {(outOfStock || lowStock) && (
            <p className={`mt-1 text-[11px] font-medium ${outOfStock ? "text-red-600" : "text-amber-600"}`}>
              {outOfStock ? "Out of stock" : `Low stock: ${stockQty}`}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm font-semibold text-orange-600">
          {formatCurrency(item.price, currency)}
        </p>
      )}
    </div>
  );
}