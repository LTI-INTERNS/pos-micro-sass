"use client";

import { X } from "lucide-react";

type FilterChipsProps = {
  filters: Record<string, string | undefined>;
  onRemove: (key: string) => void;
};

export default function FilterChips({
  filters,
  onRemove,
}: FilterChipsProps) {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value && value.trim() !== ""
  );

  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="
            flex items-center gap-1
            rounded-full bg-orange-50 text-orange-600
            border border-orange-200
            px-3 py-1 text-xs font-medium
            mt-1
          "
        >
          <span className="capitalize">
            {key.replace(/([A-Z])/g, " $1")}:
          </span>

          <span className="font-semibold">{value}</span>

          <button
            onClick={() => onRemove(key)}
            className="ml-1 hover:text-orange-800 cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
