"use client";

import Image from "next/image";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { MapPin } from "lucide-react";

type StaffReportItemProps = {
  rank:        number;
  name:       string;
  cashierNo:  string;
  imgUrl?:     string | null;
  branchName?: string;
  revenue:    number;
  orderCount: number;
  showBranch?: boolean;
  maxRevenue:  number;
};

const AVATAR_COLOURS = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-yellow-100 text-yellow-600",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
}

export default function StaffReportItem({
  rank,
  name,
  cashierNo,
  imgUrl,
  branchName,
  revenue,
  orderCount,
  showBranch = false,
  maxRevenue,
}: StaffReportItemProps) {
  const { currency, useCents } = useCurrency();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const barPct = maxRevenue > 0 ? Math.max(4, Math.round((revenue / maxRevenue) * 100)) : 4;

  return (
    <div className="py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <span className="text-xs font-bold text-gray-300 w-4 shrink-0 text-center">{rank}</span>

        {/* Avatar */}
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
            <p className="text-sm font-bold text-gray-900 shrink-0">
              {formatCurrency(revenue, currency, useCents)}
            </p>
          </div>

          {/* Sub-row: id + branch + orders */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">#{cashierNo}</span>
              {showBranch && branchName && (
                <span className="inline-flex items-center gap-0.5 text-xs text-orange-500 font-medium">
                  <MapPin className="w-3 h-3" />
                  {branchName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 shrink-0">
              {orderCount} {orderCount === 1 ? "order" : "orders"}
            </p>
          </div>

          {/* Revenue progress bar */}
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${barPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}