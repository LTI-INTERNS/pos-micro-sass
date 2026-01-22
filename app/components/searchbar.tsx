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
    <div className="space-y-4">
      <SearchBar
        placeholder="customers..."
        value={query}
        onChange={setQuery}
        onFilter={() => console.log("open filter popup")}
        debounceMs={200}
      />

      <CustomersTable customers={filtered} />
    </div>
  );
}
