"use client";

import { useEffect, useState } from "react";
import ItemCard from "@/components/Pos/posdashboard/ItemCard";
import { productService } from "@/lib/services/product-service";
import { Package, RefreshCw } from "lucide-react";

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type Props = {
  search: string;
  onAdd: (item: Item) => void;
};

export default function ItemGrid({ search, onAdd }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    productService
      .getAll({ limit: 100 })
      .then((products) => {
        const mapped: Item[] = products
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image ?? undefined,
          }));
        setItems(mapped);
      })
      .catch(() => {
        setError("Failed to load products. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-44 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center gap-2 text-gray-400">
        <Package size={40} className="text-gray-300" />
        <p className="text-sm">
          {search ? `No products match "${search}"` : "No active products found."}
        </p>
      </div>
    );
  }

  const hasAnyImage = filteredItems.some(
    (i) => i.image && i.image.trim() !== ""
  );

  if (!hasAnyImage) {
    return (
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onAdd(item)}
            className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-600">{item.name}</span>
            <span className="text-sm font-semibold text-gray-600">{item.price}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onAdd(item)} />
      ))}
    </div>
  );
}