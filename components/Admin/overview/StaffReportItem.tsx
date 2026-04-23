"use client";

import Image from "next/image";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { MapPin } from "lucide-react";

type StaffReportItemProps = {
  name:       string;
  cashierNo:  string;
  imgUrl?:     string | null;
  branchName?: string;
  revenue:    number;
  orderCount: number;
  showBranch?: boolean;
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
  imgUrl,
  branchName,
  revenue,
  orderCount,
  showBranch = false,
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
        {imgUrl ? (
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 relative">
            <Image
              src={imgUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(name)}`}
          >
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-gray-400">#{cashierNo}</p>
            {showBranch && branchName && (
              <span className="inline-flex items-center gap-0.5 text-xs text-orange-500 font-medium">
                <MapPin className="w-3 h-3" />
                {branchName}
              </span>
            )}
          </div>
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