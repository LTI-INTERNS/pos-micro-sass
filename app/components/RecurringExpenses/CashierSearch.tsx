"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
};

export default function SearchBar({
  placeholder = "Search Suppliers...",
  onSearch,
  onFilter,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    onSearch?.(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className="flex items-center">
        <div className="flex items-center gap-3 flex-1 px-6 py-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full text-xs text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>

        <div className="h-7 w-px bg-gray-200" />

        <div className="px-6 py-2">
          <button
            type="button"
            onClick={onFilter}
            className="rounded-full border border-orange-400 px-5 py-1.5 text-xs font-semibold text-orange-500
                       hover:bg-orange-50 transition"
          >
            Filter
          </button>
        </div>
      </div>
    </form>
  );
}