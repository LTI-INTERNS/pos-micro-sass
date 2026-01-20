"use client";

import Image from "next/image";
import { useMemo } from "react";

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
  taxRate?: number; // default 10%

  onAddCustomer?: () => void;
  onInc?: (id: string) => void;
  onDec?: (id: string) => void;
  onCancel?: () => void;
  onPay?: (summary: {
    subtotal: number;
    tax: number;
    total: number;
  }) => void;
};

export default function CustomerInfoPanel({
  showOrders = true,
  items = [],
  taxRate = 0.1,
  onAddCustomer,
  onInc,
  onDec,
  onCancel,
  onPay,
}: Props) {
  /* ================= Calculations ================= */
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  /* ================= LKR formatter ================= */
  const formatter = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  });

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

                      <span className="w-4 text-center font-semibold">
                        {it.qty}
                      </span>

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

              <div className="flex justify-between">
                <span>Tax ({Math.round(taxRate * 100)}%)</span>
                <span className="font-semibold text-slate-900">
                  {formatter.format(tax)}
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
                onClick={() => onPay?.({ subtotal, tax, total })}
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
