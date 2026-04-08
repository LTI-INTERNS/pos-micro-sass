"use client";

import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from "@/lib/context/formatCurrency";
import { TrendingDown, TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value?: string;
  amount?: number;
  percentage: string;
  trend: 'up' | 'down';
  caption?: string;
  showDetailButton?: boolean;
  onDetailClick?: () => void;
  onClick?: () => void;
};

export default function StatCard({
  title,
  value,
  amount,
  percentage,
  trend,
  caption,
  showDetailButton = true, 
  onDetailClick,
  onClick,
}: StatCardProps) {
  const { currency, useCents } = useCurrency();
  const showTrend = Boolean(percentage) && Boolean(trend);
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const isClickable = Boolean(onClick);

  const displayValue = amount !== undefined
    ? formatCurrency(amount, currency, useCents)
    : value;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between text-left ${isClickable ? "cursor-pointer hover:shadow-md transition-shadow" : "cursor-default"}`}
    >
      <div>
        <h3 className="text-sm font-medium text-black">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{displayValue}</p>
        {showTrend && (
          <p className={`mt-1 text-sm inline-flex items-center gap-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            <TrendIcon size={14} aria-hidden="true" />
            <span>{percentage}</span>
            {caption && <span className="text-gray-400"> {caption}</span>}
          </p>
        )}
      </div>

      {showDetailButton && (
        <button
          type="button"
          onClick={onDetailClick}
          className="mt-4 text-sm font-medium text-orange-500 flex items-center gap-1 cursor-pointer hover:text-orange-600" 
        >
          View detail →
        </button>
      )}
    </div>
  );
}