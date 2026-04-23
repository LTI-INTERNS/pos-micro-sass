"use client";

import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type StaffReportItemProps = {
  name:       string;
  cashierNo:  string;
  revenue:    number;
  orderCount: number;
};

function avatarColor(name: string): string {
  const colours = [
    "bg-orange-100 text-orange-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-yellow-100 text-yellow-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colours[hash % colours.length];
}

export default function StaffReportItem({
  name,
  cashierNo,
  revenue,
  orderCount,
}: StaffReportItemProps) {
  const { currency, useCents } = useCurrency();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(name)}`}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">#{cashierNo}</p>
        </div>
      </div>

      {/* Revenue (large) + order count (small) */}
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900">
          {formatCurrency(revenue, currency, useCents)}
        </p>
        <p className="text-xs text-gray-400">
          {orderCount} {orderCount === 1 ? "order" : "orders"}
        </p>
      </div>
    </div>
  );
}