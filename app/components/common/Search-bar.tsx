"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilter?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  showFilter = false,
  onFilter,
}: Props) {
  return (
    <div className="bg-white border rounded-xl px-6 py-2 flex items-center gap-3">
      <Search size={14} className="text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-xs outline-none"
      />

      {showFilter && (
        <button
          onClick={onFilter}
          className="border border-orange-400 text-orange-500 text-xs px-4 py-1 rounded-full"
        >
          Filter
        </button>
      )}
    </div>
  );
}
