"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/Dashboard/common/Search-bar";
import ProductsTable from "@/app/components/product-table";

import { productsData } from "@/app/ProductManager/data";

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  const products = productsData;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((c) => c.name.toLowerCase().includes(q) || c.discount.includes(q));
  }, [products, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder="products..."
        value={query}
        onChange={setQuery}
        onFilter={() => console.log("open filter popup")}
        debounceMs={200}
      />

      <ProductsTable products={filtered} />
    </div>
  );
}