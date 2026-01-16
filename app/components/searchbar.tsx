"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void; 
};

export default function SearchBar({
  placeholder = "Search customers...",
  onSearch,
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
    <form onSubmit={handleSubmit} className="relative w-[320px]">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
      />
    </form>
  );
}
