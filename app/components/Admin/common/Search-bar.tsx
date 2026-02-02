"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import ActionButton from "./ActionButton"; 

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;

  // optional features
  debounceMs?: number;   // delay search input
  showClear?: boolean;   // show clear (X) button
  showFilter?: boolean;  // show filter button
  onFilter?: () => void; // open filter popup
  filterLabel?: string;  // button text
  isFilterApplied?: boolean;
  onClearFilters?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  debounceMs = 0,
  showClear = true,
  showFilter = false,
  onFilter,
  filterLabel = "Filter",
  isFilterApplied = false,
  onClearFilters,
  className = ""
}: Props) {


  // Local state is only used when debounce is enabled
  const [local, setLocal] = useState(value);


  // Keep local state synced if parent resets the value
  useEffect(() => {
    setLocal(value);
  }, [value]);


  // Debounce logic 
  useEffect(() => {
    if (debounceMs <= 0) return;

    const t = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs, onChange]);

 
  // Choose correct value source
  const inputValue = debounceMs > 0 ? local : value;

  
  const handleInput = (next: string) => {
    debounceMs > 0 ? setLocal(next) : onChange(next);
  };


  const clear = () => {
    setLocal("");
    onChange("");
  };

 return (
  <div className={`flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    
    {/* Left: search input */}
    <div className="flex items-center gap-2 px-3 py-2 flex-1">
      <Search size={14} className="text-gray-400" />

      <input
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-xs outline-none placeholder-gray-400 text-black"
      />

      {showClear && inputValue.trim() !== "" && (
        <button
          type="button"
          onClick={clear}
          className="p-0.5 rounded-full hover:bg-gray-100 transition"
        >
          <X size={12} className="text-gray-400" />
        </button>
      )}
    </div>

    {/* Right: filter pill */}
    {showFilter && (
      <div className="px-3 py-2 border-l border-gray-200 flex items-center">
        <div
          onClick={onFilter}
          className={`
            flex items-center cursor-pointer select-none
            rounded-full py-2 text-xs font-semibold transition
            ${isFilterApplied
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "border border-orange-400 bg-white text-orange-500 hover:bg-orange-50"}
          `}
        >
          {/* Label */}
          <span className="px-4">{filterLabel}</span>

          {isFilterApplied && (
            <>
              {/* Divider */}
              <span className="h-4 w-px bg-white/60" />
              {/* Clear filters */}
              <span
                onClick={(e) => {
                  e.stopPropagation(); // ⛔ don’t open popup
                  onClearFilters?.();
                }}
                className="px-3 hover:bg-white/20 rounded-r-full"
              >
                <X size={12} />
              </span>
            </>
          )}
        </div>
      </div>
    )}
  </div>
);
}
