"use client";

import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from "@/lib/context/formatCurrency";
import { TrendingDown, TrendingUp, Minus, ArrowRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value?: string;
  amount?: number;
  percentage?: string;
  trend?: 'up' | 'down' | 'neutral';
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

  // Safely assign icons based on the trend
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up"
    ? "text-green-600 bg-green-50"
    : trend === "down"
    ? "text-red-500 bg-red-50"
    : "text-yellow-600 bg-yellow-50";

  const isClickable = Boolean(onClick);

  const displayValue = amount !== undefined
    ? formatCurrency(amount, currency, useCents)
    : value;

  const isLoading = displayValue === "—" || displayValue === undefined;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between text-left transition-all ${
        isClickable ? "cursor-pointer hover:shadow-md hover:border-orange-100" : "cursor-default"
      }`}
    >
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</p>

        {isLoading ? (
          <div className="mt-3 h-9 w-32 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <p className="mt-2 text-3xl font-bold text-gray-900 leading-tight">{displayValue}</p>
        )}

        {showTrend && !isLoading && (
          <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${trendColor}`}>
            <TrendIcon size={12} aria-hidden="true" />
            <span>{percentage}</span>
            {caption && <span className="font-normal text-inherit opacity-70">{caption}</span>}
          </div>
        )}
      </div>

      {showDetailButton && (
        <button
          type="button"
          onClick={onDetailClick}
          className="mt-5 text-xs font-medium text-orange-500 flex items-center gap-1 cursor-pointer hover:text-orange-600 transition-colors group w-fit"
        >
          View detail
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}