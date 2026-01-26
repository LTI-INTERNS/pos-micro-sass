"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import ActionButton from "./ActionButton"; 

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;

  // optional features
  debounceMs?: number;   // delay search input
  showClear?: boolean;   // show clear (X) button
  showFilter?: boolean;  // show filter button
  onFilter?: () => void; // open filter popup
  filterLabel?: string;  // button text
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
  <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
    
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
        <ActionButton
          label={filterLabel}
          onClick={onFilter}
          variant="outline"
          fullWidth={false}
          className="px-4 py-1 text-xs"
        />
      </div>
    )}
  </div>
);
}