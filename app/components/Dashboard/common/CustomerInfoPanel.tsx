"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type OrderItem = {
  id: string;
  name: string;
  price: number; // LKR
  qty: number;
  imageUrl: string;
};

type Props = {
  showOrders?: boolean;
  items?: OrderItem[];

  onAddCustomer?: () => void;
  onInc?: (id: string) => void;
  onDec?: (id: string) => void;

  // manual qty input handler
  onSetQty?: (id: string, qty: number) => void;

  onCancel?: () => void;
  onPay?: (summary: {
    subtotal: number;
    total: number;
  }) => void;
};

export default function CustomerInfoPanel({
  showOrders = true,
  items = [],
  onAddCustomer,
  onInc,
  onDec,
  onSetQty,
  onCancel,
  onPay,
}: Props) {
  /* ================= Calculations ================= */
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const total = useMemo(() => subtotal, [subtotal]);

  /* ================= LKR formatter ================= */
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        minimumFractionDigits: 2,
      }),
    []
  );

  /**
   * Local input state so typing feels natural.
   * Keyed by item id -> string value in input.
   */
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});

  // ✅ FIX: Always sync input values from items so + / - updates show in the input
  useEffect(() => {
    setQtyDraft(() => {
      const next: Record<string, string> = {};
      for (const it of items) next[it.id] = String(it.qty);
      return next;
    });
  }, [items]);

  function clampPositiveInt(n: number) {
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.trunc(n));
  }

  function commitQty(id: string, raw: string) {
    // If user clears input, treat as 1 on blur/commit
    if (raw.trim() === "") {
      const qty = 1;
      setQtyDraft((p) => ({ ...p, [id]: String(qty) }));
      onSetQty?.(id, qty);
      return;
    }

    // digits-only (no decimals, no minus)
    const parsed = Number(raw);
    const qty = clampPositiveInt(parsed);

    setQtyDraft((p) => ({ ...p, [id]: String(qty) }));
    onSetQty?.(id, qty);
  }

  return (
    <aside className="w-full h-full bg-white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6">
          <h2 className="text-[22px] font-semibold text-slate-900">
            Customer Information
          </h2>

          <button
            onClick={onAddCustomer}
            className="mt-4 w-full rounded-full bg-orange-50 text-orange-600
                       font-semibold py-4 text-sm hover:bg-orange-100 transition"
          >
            Add Customer
          </button>

          <div className="mt-6 border-t" />
        </div>

        {/* Orders title */}
        {showOrders && (
          <div className="px-6 pt-6">
            <h3 className="text-[20px] font-semibold text-slate-900">
              Orders details
            </h3>
          </div>
        )}

        {/* Orders list */}
        {showOrders && (
          <div className="px-6 pt-4 flex-1 overflow-auto">
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={it.imageUrl}
                        alt={it.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold text-slate-900">
                        {it.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Price</p>
                      <p className="text-[16px] font-semibold text-orange-600">
                        {formatter.format(it.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onDec?.(it.id)}
                        className="h-11 w-11 rounded-full bg-slate-200
                                   text-xl text-slate-700 grid place-items-center"
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>

                      {/* Manual input */}
                      <input
                        value={qtyDraft[it.id] ?? String(it.qty)}
                        onChange={(e) => {
                          // allow only digits while typing
                          const next = e.target.value.replace(/\D/g, "");
                          setQtyDraft((p) => ({ ...p, [it.id]: next }));
                        }}
                        onBlur={() => commitQty(it.id, qtyDraft[it.id] ?? "")}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="h-11 w-14 rounded-xl border border-slate-200 bg-white
                                   text-center font-semibold text-slate-900 outline-none
                                   focus:ring-2 focus:ring-orange-200"
                        aria-label="Quantity"
                      />

                      <button
                        onClick={() => onInc?.(it.id)}
                        className="h-11 w-11 rounded-full bg-slate-900
                                   text-xl text-white grid place-items-center"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-400">
                  No items added
                </div>
              )}
            </div>
          </div>
        )}

        {/* Totals & actions */}
        {showOrders && (
          <div className="px-6 py-6 border-t">
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span className="font-semibold text-slate-900">
                  {formatter.format(subtotal)}
                </span>
              </div>

              <div className="pt-4 border-t border-dashed flex justify-between">
                <span className="font-semibold text-slate-600">Total</span>
                <span className="font-bold text-orange-600 text-[16px]">
                  {formatter.format(total)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={onCancel}
                className="rounded-full border border-orange-400
                           text-orange-600 font-semibold py-4"
              >
                Cancel
              </button>

              <button
                onClick={() => onPay?.({ subtotal, total })}
                className="rounded-full bg-orange-500
                           text-white font-semibold py-4"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
