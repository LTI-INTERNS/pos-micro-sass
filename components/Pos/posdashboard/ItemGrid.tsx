"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import ItemCard, { Item } from "@/components/Pos/posdashboard/ItemCard";
import { posService, PosProduct } from "@/lib/services/pos-service";
import { Package, RefreshCw, AlertCircle } from "lucide-react";

// Item type is imported from ItemCard to guarantee a single shared definition

type Props = {
  search: string;
  onAdd: (item: Item) => void;
};

export default function ItemGrid({ search, onAdd }: Props) {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (status === "loading") return;

    const role = session?.user?.role ?? "cashier";
    const branchId = session?.user?.branchId ?? null;

    setLoading(true);
    setError(null);

    try {
      const data = await posService.getProducts(role, branchId);
      setProducts(data);
    } catch {
      setError("Failed to load products. Showing fallback data.");
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (status === "loading" || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-gray-100 animate-pulse h-48"
          />
        ))}
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredProducts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <Package size={48} />
        <p className="text-sm font-medium">No products found</p>
        {error && (
          <div className="flex items-center gap-2 text-amber-500 text-xs">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        <button
          onClick={fetchProducts}
          className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 mt-1"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  // Normalise PosProduct → Item (shared type from ItemCard)
  const items: Item[] = filteredProducts.map((p) => ({
    id: parseInt(p.id, 10) || p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
    name: p.name,
    price: p.price,
    image: p.image,
  }));

  const hasAnyImage = items.some((i) => i.image && i.image.trim() !== "");

  /* LIST VIEW (no images) */
  if (!hasAnyImage) {
    return (
      <div className="space-y-2">
        {error && (
          <div className="flex items-center gap-2 text-amber-500 text-xs px-1 mb-2">
            <AlertCircle size={13} />
            <span>{error}</span>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onAdd(item)}
            className="flex justify-between items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-600">{item.name}</span>
            <span className="text-sm font-semibold text-gray-600">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* GRID VIEW (with images) */
  return (
    <>
      {error && (
        <div className="flex items-center gap-2 text-amber-500 text-xs px-1 mb-2">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={() => onAdd(item)} />
        ))}
      </div>
    </>
  );
}