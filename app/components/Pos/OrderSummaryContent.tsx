"use client";

import React, { useMemo } from "react";
import OrderTable, { Column } from "../Admin/common/CommonTable";
import { Printer } from "lucide-react";

export type CommonOrderItem = {
  id: number | string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

export type CommonPaymentSummary = {
  orderNo: string | number;
  currencyCode?: string;

  discountValue: number;
  cardTax: number;
  grandTotal: number;

  paymentMethod: string;
  cashPaid: number;
  cardPaid: number;
};

export const commonColumns: Column<CommonOrderItem>[] = [
  { key: "name", label: "ITEM NAME", align: "left" },
  { key: "qty", label: "QTY", align: "center" },
  {
    key: "price",
    label: "PRICE",
    align: "center",
    render: (row) => `${row ? `LKR ${row.price.toFixed(2)}` : ""}`,
  },
  {
    key: "subtotal",
    label: "SUBTOTAL",
    align: "right",
    render: (row) => `${row ? `LKR ${row.subtotal.toFixed(2)}` : ""}`,
  },
];

export function PaymentIcons({ paymentMethod }: { paymentMethod: string }) {
  const method = (paymentMethod || "").toLowerCase();

  const hasCash = method.includes("cash");
  const hasVisa = method.includes("visa");
  const hasMaster = method.includes("master");

  const icons: { src: string; alt: string }[] = [];
  if (hasCash) icons.push({ src: "/Cash.png", alt: "Cash" });
  if (hasVisa) icons.push({ src: "/Visa.png", alt: "Visa" });
  if (hasMaster) icons.push({ src: "/Master.png", alt: "Master" });

  if (!icons.length) icons.push({ src: "/Cash.png", alt: "Payment" });

  return (
    <div className="flex items-center gap-2">
      {icons.map((ic) => (
        <img
          key={ic.alt}
          src={ic.src}
          alt={ic.alt}
          className="w-6 h-6 object-contain"
        />
      ))}
    </div>
  );
}

type Props<TItem extends CommonOrderItem> = {
  title: string;
  subtitle: string;
  orderNoLabel: string | number;

  items: TItem[];
  columns?: Column<TItem>[];

  payment: CommonPaymentSummary;

  /** Left-side block inside the 2-column grid (Notes OR Payment method card, etc.) */
  leftBlock: React.ReactNode;

  /** Right-side "secondary action" button next to receipt (Email / Add Email / nothing) */
  rightAction?: React.ReactNode;
};

export default function OrderSummaryContent<TItem extends CommonOrderItem>({
  title,
  subtitle,
  orderNoLabel,
  items,
  columns,
  payment,
  leftBlock,
  rightAction,
}: Props<TItem>) {
  const itemsSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number.isFinite(it.subtotal) ? it.subtotal : 0),
        0
      ),
    [items]
  );

  const c = payment.currencyCode ?? "LKR";

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">{title}</h1>
        <p className="text-slate-500">{subtitle}</p>
        <p className="text-xs text-slate-400 mt-1">Order #{orderNoLabel}</p>
      </div>

      {/*  Added spacing under the table (fixes the tight gap) */}
      <div className="mb-4">
        <OrderTable
          data={items}
          columns={
            (columns as Column<TItem>[]) ?? (commonColumns as Column<TItem>[])
          }
          emptyMessage="No order items found"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        {leftBlock}

        {/* RIGHT */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>SUBTOTAL (Items)</span>
            <span className="text-black">
              {c} {itemsSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>ORDER DISCOUNT</span>
            <span className="text-black">
              {c} {payment.discountValue.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>CARD TAX</span>
            <span className="text-black">
              {c} {payment.cardTax.toFixed(2)}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">BILL AMOUNT</span>
            <span className="text-orange-500">
              {c} {payment.grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>PAYMENT METHOD</span>
              <span className="text-black">{payment.paymentMethod}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>CASH PAID</span>
              <span className="text-black">
                {c} {payment.cashPaid.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>CARD PAID</span>
              <span className="text-black">
                {c} {payment.cardPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-3 border-t flex gap-3">
            <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
              <Printer size={16} />
              <span>Get receipt</span>
            </button>

            {rightAction}
          </div>
        </div>
      </div>
    </>
  );
}