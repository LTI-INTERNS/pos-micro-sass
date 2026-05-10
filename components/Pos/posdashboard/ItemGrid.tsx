"use client";

import { useEffect, useState, useRef } from "react";
import ItemCard from "@/components/Pos/posdashboard/ItemCard";
import { posService, PosProduct } from "@/lib/services/pos-service";
import { Package, RefreshCw } from "lucide-react";

type Props = {
  search: string;
  onSearchChange?: (val: string) => void;
  onAdd: (item: PosProduct) => void;
};

export default function ItemGrid({ search, onSearchChange, onAdd }: Props) {
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

  const barcodeRef = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep references to constantly changing props/state so the event listener doesn't have to detach
  const itemsRef = useRef(items);
  const onAddRef = useRef(onAdd);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    itemsRef.current = items;
    onAddRef.current = onAdd;
    onSearchChangeRef.current = onSearchChange;
  }, [items, onAdd, onSearchChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if event comes from an input/textarea (so it doesn't double-trigger if typing in search)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Wait, if it IS an input, we STILL want the barcode scanner to work? 
        // No, if the search input is focused, the barcode scanner types into it, triggering onChange.
        // BUT the enter block will fire. We need the enter block to still match the items!
      }

      if (!e.key) return;

      if (e.key === "Enter") {
        if (barcodeRef.current.length > 0) {
          const scanned = barcodeRef.current;
          barcodeRef.current = "";
          
          const allMatches = itemsRef.current.filter((item) => item.barcode === scanned);
          
          if (allMatches.length === 1 && allMatches[0].availability) {
            onAddRef.current(allMatches[0]);
            if (onSearchChangeRef.current) onSearchChangeRef.current(""); 
          } else {
            if (onSearchChangeRef.current) onSearchChangeRef.current(scanned);
          }
        }
        return;
      }

      if (e.key.length === 1) {
        barcodeRef.current += e.key;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
          barcodeRef.current = "";
        }, 50);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const filteredItems = items
    .filter((i) => {
      const term = search.trim().toLowerCase();

      // No search — only show available products in the default view
      if (!term) return i.availability;

      // Active search — show all products that match by name or barcode
      // (so the cashier can look up any product, even unavailable ones)
      return (
        i.name.toLowerCase().includes(term) ||
        (i.barcode && i.barcode.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      const aHasImg = !!(a.image && a.image.trim());
      const bHasImg = !!(b.image && b.image.trim());
      if (aHasImg && !bHasImg) return -1;
      if (!aHasImg && bHasImg) return 1;
      return 0;
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


  /* ── GRID VIEW (with images) ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filteredItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          disabled={!item.availability}
          onClick={() => onAdd(item)}
        />
      ))}
    </div>
  );
}