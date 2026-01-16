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
return {
    
}