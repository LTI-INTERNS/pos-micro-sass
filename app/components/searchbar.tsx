"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/common/Search-bar";
import CustomersTable from "@/app/components/customers-table";

import { Customer } from "@/app/Customermanagement/data";

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  const customers = [
  ];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, query]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden border-none"
    >
      <div className="flex items-center">
        <div className="flex items-center gap-3 flex-1 px-6 py-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full text-xs text-gray-700 placeholder:text-gray-400 outline-none py-2"
          />
        </div>

        {/* Only show divider + Filter button if onFilter exists */}
        {onFilter && (
          <>
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
          </>
        )}
      </div>
    </form>
  );
}
