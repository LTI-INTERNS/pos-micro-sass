"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilter?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search customers...",
  onFilter,
}: Props) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3">
      <Search size={14} className="text-gray-400" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-xs outline-none placeholder-gray-400"
      />

      <button
        onClick={onFilter}
        className="border border-orange-500 text-orange-500
                   text-xs px-5 py-1.5 rounded-full
                   hover:bg-orange-50 transition"
      >
        Filter
      </button>
    </div>
  );
}
