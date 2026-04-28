"use client";

import { X } from "lucide-react";

type FilterChipsProps = {
  filters: Record<string, string | undefined>;
  labels?: Record<string, string>;
  onRemove: (key: string) => void;
};

function formatKey(key: string, labels?: Record<string, string>) {
  return labels?.[key] ?? key.replace(/([A-Z])/g, " $1");
}

function formatValue(key: string, value: string, labels?: Record<string, string>) {
  return labels?.[`${key}:${value}`] ?? labels?.[value] ?? value;
}

export default function FilterChips({
  filters,
  labels,
  onRemove,
}: FilterChipsProps) {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value && value.trim() !== "",
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
            {formatKey(key, labels)}:
          </span>

          <span className="font-semibold">
            {formatValue(key, value ?? "", labels)}
          </span>

          <button
            type="button"
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
