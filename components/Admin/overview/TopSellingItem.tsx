"use client";

import Image from "next/image";
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from "@/lib/context/formatCurrency";

type TopSellingItemProps = {
  name:       string;
  image:      string | null | undefined;
  price:      number;
  percentage: string;
  trend:      'up' | 'down';
};

/** Initials-based placeholder when no product image is available. */
function ImagePlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-orange-500">{initials}</span>
    </div>
  );
}

export default function TopSellingItem({
  name,
  image,
  price,
  percentage,
  trend,
}: TopSellingItemProps) {
  const { currency, useCents } = useCurrency();
  const isUp    = trend === 'up';
  const hasImage = image && image.trim() !== '';

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        {hasImage ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <ImagePlaceholder name={name} />
        )}
        <span className="text-sm font-medium text-gray-800 line-clamp-2 max-w-[180px]">
          {name}
        </span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">
          {formatCurrency(price, currency, useCents)}
        </p>
        <p className={`text-xs ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {percentage}
        </p>
      </div>
    </div>
  );
}
