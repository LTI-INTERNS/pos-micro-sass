"use client";

import { useCurrency } from '@/app/context/CurrencyContext';
import { formatCurrency } from "@/app/context/formatCurrency";

type StatCardProps = {
  title: string;
  value?: string;
  amount?: number;
  percentage: string;
  trend: 'up' | 'down';
  caption?: string;
  showDetailButton?: boolean;
  onDetailClick?: () => void;
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
}: StatCardProps) {
  const { currency, useCents } = useCurrency();
  const showTrend = Boolean(percentage) && Boolean(trend);

  const displayValue = amount !== undefined
    ? formatCurrency(amount, currency, useCents)
    : value;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-medium text-black">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{displayValue}</p>
        {showTrend && (
          <p className={`mt-1 text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {percentage}
            {caption && <span className="text-gray-400"> {caption}</span>}
          </p>
        )}
      </div>

      {showDetailButton && (
        <button
          type="button"
          onClick={onDetailClick}
          className="mt-4 text-sm font-medium text-orange-500 flex items-center gap-1"
        >
          View detail →
        </button>
      )}
    </div>
  );
}