"use client";

import { Calendar, ChevronDown } from "lucide-react";

type Props = {
  value: string;
  onClick?: () => void;
};

export default function DateRangeBar({ value, onClick }: Props) {
  return (
    <div
      className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <Calendar size={16} className="text-orange-500" />
        <span className="font-semibold text-gray-700">{value}</span>
      </div>

      <ChevronDown size={18} className="text-gray-400" />
    </div>
  );
}
