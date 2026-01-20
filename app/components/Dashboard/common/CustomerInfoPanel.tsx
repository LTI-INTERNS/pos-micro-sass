"use client";

import Image from "next/image";
import { useMemo } from "react";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
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
  onPay?: (summary: { subtotal: number; tax: number; total: number }) => void;
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
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const tax = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <aside className="w-full h-full bg-white">
      <div className="h-full flex flex-col">
        {/* Top */}
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
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 shrink-0">
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
                      <p className="mt-1 text-xs text-slate-400">Price</p>
                      <p className="text-[16px] font-semibold text-orange-600">
                        ${it.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onDec?.(it.id)}
                        className="h-11 w-11 rounded-full bg-slate-200/70
                                   text-slate-700 text-xl grid place-items-center
                                   hover:bg-slate-200 transition"
                        aria-label="Decrease"
                      >
                        –
                      </button>

                      <span className="w-4 text-center text-[15px] font-semibold text-slate-900">
                        {it.qty}
                      </span>

                      <button
                        onClick={() => onInc?.(it.id)}
                        className="h-11 w-11 rounded-full bg-slate-900
                                   text-white text-xl grid place-items-center
                                   hover:bg-slate-800 transition"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-400">
                  No items yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom totals + actions */}
        {showOrders && (
          <div className="px-6 pt-6 pb-6 border-t">
            <div className="text-sm text-slate-500 space-y-3">
              <div className="flex items-center justify-between">
                <span>Sub Total</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Tax ({Math.round(taxRate * 100)}%)</span>
                <span className="font-semibold text-slate-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-dashed pt-4 flex items-center justify-between">
                <span className="text-slate-600 font-semibold">Total</span>
                <span className="text-orange-600 font-bold text-[16px]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={onCancel}
                className="w-full rounded-full border border-orange-400
                           text-orange-600 font-semibold py-4 text-sm
                           hover:bg-orange-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => onPay?.({ subtotal, tax, total })}
                className="w-full rounded-full bg-orange-500
                           text-white font-semibold py-4 text-sm
                           hover:bg-orange-600 transition"
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
