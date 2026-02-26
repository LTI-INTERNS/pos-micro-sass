"use client";

import { useEffect, useState, useCallback } from "react";
import ItemCard from "@/components/Pos/posdashboard/ItemCard";
import { posService, PosProduct } from "@/lib/services/pos-service";

type ItemForCart = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type Props = {
  search: string;
  onAdd: (item: ItemForCart) => void;
};

export default function ItemGrid({ search, onAdd }: Props) {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Fetch all products once on mount (search filtering done client-side to avoid debounce lag)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await posService.getProducts({ limit: 100 });
      setProducts(data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side search filter
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-500">
        <p>{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No products found{search ? ` for "${search}"` : ""}.
      </div>
    );
  }

  const hasAnyImage = filtered.some((p) => p.image && p.image.trim() !== "");

  // Map backend PosProduct → cart-compatible shape (id as number for usePosStore compatibility)
  const toCartItem = (p: PosProduct): ItemForCart => ({
    id:    parseInt(p.id, 10) || p.id.charCodeAt(0), // UUID → use hash fallback; store handles string ids fine
    name:  p.name,
    price: p.price,
    image: p.image ?? undefined,
  });

  /* LIST VIEW — no images */
  if (!hasAnyImage) {
    return (
      <div className="space-y-2">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => onAdd(toCartItem(p))}
            className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <div>
              <span className="font-semibold text-gray-600">{p.name}</span>
              {p.category && (
                <span className="ml-2 text-xs text-slate-400">{p.category}</span>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-600">LKR {p.price.toFixed(2)}</p>
              {p.stock <= 0 && (
                <p className="text-xs text-red-500">Out of stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* GRID VIEW (with images) */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {filtered.map((p) => (
        <ItemCard
          key={p.id}
          item={toCartItem(p)}
          onClick={() => onAdd(toCartItem(p))}
        />
      ))}
    </div>
  );
}
