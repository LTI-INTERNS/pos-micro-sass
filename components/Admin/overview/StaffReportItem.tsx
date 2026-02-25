"use client";

import Image from "next/image";
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from "@/lib/context/formatCurrency";

type StaffReportItemProps = {
  name: string;
  avatar: string;
  amount: number;
  subAmount: number;
};

export default function StaffReportItem({
  name,
  avatar,
  amount,
  subAmount,
}: StaffReportItemProps) {
  const { currency, useCents } = useCurrency();

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <Image
          src={avatar}
          alt={name}
          width={36}   // 9 * 4px per Tailwind (w-9)
          height={36}  // 9 * 4px per Tailwind (h-9)
          className="rounded-full object-cover"
          priority={false} // set true if this is critical on LCP
        />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">
          {formatCurrency(amount, currency, useCents)}
        </p>
        <p className="text-xs text-green-500">
          {formatCurrency(subAmount, currency, useCents)}
        </p>
      </div>
    </div>
  );
}