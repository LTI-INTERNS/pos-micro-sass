"use client";

import { useEffect, useState } from "react";
import ItemCard from "@/components/Pos/posdashboard/ItemCard";
import { posService, PosProduct } from "@/lib/services/pos-service";
import { Package, RefreshCw } from "lucide-react";

type Props = {
  search: string;
  onAdd: (item: PosProduct) => void;
};

export default function ItemGrid({ search, onAdd }: Props) {
  const [items, setItems] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    posService
      .getProducts({ limit: 100 })
      .then(setItems)
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Global Barcode Scanner Hook
  useEffect(() => {
    let barcodeString = "";
    let timeoutId: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (barcodeString.length > 0) {
          const matchedItem = items.find((item) => item.barcode === barcodeString);
          if (matchedItem) {
            onAdd(matchedItem);
          }
          barcodeString = "";
        }
        return;
      }

      if (e.key.length === 1) {
        barcodeString += e.key;
        if (timeoutId) clearTimeout(timeoutId);
        
        // Barcode scanners usually type very fast (< 20ms per character).
        // 50ms is a safe threshold for most scanners.
        timeoutId = setTimeout(() => {
          barcodeString = "";
        }, 50);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [items, onAdd]);

  const filteredItems = items.filter((i) => {
    const term = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(term) ||
      (i.barcode && i.barcode.toLowerCase().includes(term))
    );
  });

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-44 animate-pulse" />
        ))}
      </div>
    );
  }

  /* ── ERROR ── */
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

  /* ── EMPTY ── */
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

  /* ── LIST VIEW (no images) ── */
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

  /* ── GRID VIEW (with images) ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} onClick={() => onAdd(item)} />
      ))}
    </div>
  );
}