"use client";

import Image from "next/image";
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from "@/lib/context/formatCurrency";
import { TrendingUp, TrendingDown } from "lucide-react";

type TopSellingItemProps = {
  rank:       number;
  name:       string;
  image:      string | null | undefined;
  price:      number;
  orderCount?: number;
  percentage: string;
  trend:      'up' | 'down';
};

const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-100 text-amber-600 font-bold',
  2: 'bg-gray-100 text-gray-500 font-bold',
  3: 'bg-orange-50 text-orange-400 font-bold',
};

function ImagePlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
      <span className="text-xs font-bold text-orange-400">{initials}</span>
    </div>
  );
}

export default function TopSellingItem({
  rank,
  name,
  image,
  price,
  orderCount,
  percentage,
  trend,
}: TopSellingItemProps) {
  const { currency, useCents } = useCurrency();
  const isUp = trend === 'up';
  const hasImage = image && image.trim() !== '';
  const rankStyle = RANK_STYLES[rank] ?? 'bg-gray-50 text-gray-400 font-medium';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
      {/* Rank badge */}
      <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${rankStyle}`}>
        {rank}
      </span>

      {/* Image */}
      {hasImage ? (
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-100">
          <Image 
          src={image} 
          alt={name} 
          fill
          sizes="44px" 
          className="object-cover"
           />
        </div>
      ) : (
        <ImagePlaceholder name={name} />
      )}

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        {orderCount !== undefined && (
          <p className="text-xs text-gray-400">{orderCount.toLocaleString()} sold</p>
        )}
      </div>

      {/* Stats */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(price, currency, useCents)}
        </p>
        <p className={`text-xs inline-flex items-center gap-0.5 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {percentage}
        </p>
      </div>
    </div>
  );
}