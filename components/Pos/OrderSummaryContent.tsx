"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import OrderTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";

/**
 * Safely coerce any value (Prisma Decimal string, null, undefined, number)
 * to a finite JS number. Falls back to 0 so .toFixed() never throws.
 */
const n = (v: unknown): number => {
  const num = Number(v);
  return Number.isFinite(num) ? num : 0;
};

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
  changeToGive?: number;
  customerEmail?: string;

  customer?: {
    name: string;
    phoneNumber: string;
    email: string;
  } | null;
};

export const commonColumns: Column<CommonOrderItem>[] = [
  { key: "name", label: "ITEM NAME", align: "left" },
  { key: "qty", label: "QTY", align: "center" },
  {
    key: "price",
    label: "PRICE",
    align: "center",
    render: (row) => `${row ? `LKR ${n(row.price).toFixed(2)}` : ""}`,
  },
  {
    key: "subtotal",
    label: "SUBTOTAL",
    align: "right",
    render: (row) => `${row ? `LKR ${n(row.subtotal).toFixed(2)}` : ""}`,
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
        <Image
          key={ic.alt}
          src={ic.src}
          alt={ic.alt}
          width={24}
          height={24}
          className="object-contain"
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
  leftBlock: React.ReactNode;
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
  const { currency } = useCurrency();

  const c = payment.currencyCode ?? currency ?? "LKR";

  const itemsSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (Number.isFinite(it.subtotal) ? it.subtotal : 0),
        0
      ),
    [items]
  );

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-black">{title}</h1>
        <p className="text-slate-500">{subtitle}</p>
        {String(orderNoLabel).startsWith("POS-") ? (
          <div className="mt-2 flex flex-col items-center gap-1">
            <p className="text-sm font-mono font-semibold text-slate-700 tracking-wide">
              Ref&nbsp;#{orderNoLabel}
            </p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Pending confirmation — order number assigned after save
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-1">
            {orderNoLabel === "Pending"
              ? "Order # — assigned after confirmation"
              : `Order #${orderNoLabel}`}
          </p>
        )}
      </div>

      <div className="mb-4 max-h-37.5 overflow-y-auto">
  <OrderTable
    data={items}
    columns={(columns as Column<TItem>[]) ?? (commonColumns as Column<TItem>[])}
    emptyMessage="No order items found"
  />
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leftBlock}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>SUBTOTAL (Items)</span>
            <span className="text-black">{c} {n(itemsSubtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>ORDER DISCOUNT</span>
            <span className="text-black">{c} {n(payment.discountValue).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>CARD TAX</span>
            <span className="text-black">{c} {n(payment.cardTax).toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span className="text-black">BILL AMOUNT</span>
            <span className="text-orange-500">{c} {n(payment.grandTotal).toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>PAYMENT METHOD</span>
              <span className="text-black">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>CASH PAID</span>
              <span className="text-black">{c} {n(payment.cashPaid).toFixed(2)}</span>
            </div>
            {/* Only show change when no card was involved and there is actually change */}
            {n(payment.cardPaid) === 0 && n(payment.changeToGive) > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>CHANGE TO GIVE</span>
                <span className="text-black font-semibold text-green-600">
                  {c} {n(payment.changeToGive).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t flex gap-3">
            {rightAction}
          </div>
        </div>
      </div>
    </>
  );
}