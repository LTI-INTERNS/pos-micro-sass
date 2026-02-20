"use client";

import { useCurrency } from '@/app/context/CurrencyContext';
import { formatCurrency } from "@/app/context/formatCurrency";

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
  const { currency } = useCurrency();

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">{formatCurrency(amount, currency)}</p>
        <p className="text-xs text-green-500">{formatCurrency(subAmount, currency)}</p>
      </div>
    </div>
  );
}