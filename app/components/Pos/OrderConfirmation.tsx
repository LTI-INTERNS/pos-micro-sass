"use client";

import React, { useMemo } from "react";
import OrderTable, { Column } from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";
import type { PaymentSummary } from "./posdashboard/OrderPaymentModal";
import { useCurrency } from "@/app/context/CurrencyContext";
import { Mail, Printer, X } from "lucide-react";

export type ConfirmItem = {
  id: number | string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: ConfirmItem[];
  payment: PaymentSummary;
  onCancelEdit?: () => void;
  onConfirm?: () => void;
};

function PaymentIcons({ paymentMethod }: { paymentMethod: string }) {
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
        <img key={ic.alt} src={ic.src} alt={ic.alt} className="w-6 h-6 object-contain" />
      ))}
    </div>
  );
}

// ── Small reusable row components ─────────────────────────────────────────────
function Row({
  label,
  value,
  className = "",
  valueClassName = "text-black",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={`flex justify-between text-sm ${className}`}>
      <span className="text-slate-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-slate-200" />;
}

export default function OrderConfirmation({
  open,
  onClose,
  items,
  payment,
  onCancelEdit,
  onConfirm,
}: Props) {
  const { currency } = useCurrency();
  const c = payment.currencyCode ?? currency;

  const fmt = (n: number) => `${c} ${(Number.isFinite(n) ? n : 0).toFixed(2)}`;

  const itemsSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number.isFinite(it.subtotal) ? it.subtotal : 0), 0),
    [items]
  );

  const columns: Column<ConfirmItem>[] = useMemo(
    () => [
      { key: "name", label: "ITEM NAME", align: "left" },
      { key: "qty", label: "QTY", align: "center" },
      {
        key: "price",
        label: "PRICE",
        align: "center",
        render: (row) => fmt(row.price),
      },
      {
        key: "subtotal",
        label: "SUBTOTAL",
        align: "right",
        render: (row) => fmt(row.subtotal),
      },
    ],
    [c]
  );

  // ── Derived billing values ────────────────────────────────────────────────
  // Net amount after discount (before card tax)
  const netAfterDiscount = payment.baseAmount - payment.discountValue;
  // Remaining to pay = netAfterDiscount - cash paid
  const remainingToPay = Math.max(0, netAfterDiscount - payment.cashPaid);
  // Grand total already includes card tax from OrderPaymentModal
  const grandTotal = payment.grandTotal;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8 relative max-h-[95vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black">Order Confirmation</h1>
          <p className="text-slate-500 text-sm">Please confirm the order below to complete payment</p>
          <p className="text-xs text-slate-400 mt-1">Order #{payment.orderNo}</p>
        </div>

        {/* Items table */}
        <OrderTable data={items} columns={columns} emptyMessage="No order items found" />

        {/* Billing + Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="border rounded-xl p-4 bg-slate-50 h-full flex flex-col">
            <h3 className="font-semibold mb-2 text-black">NOTES</h3>
            <textarea
              placeholder="Add a note for this order (Optional)"
              className="flex-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
          </div>

          {/* Billing breakdown */}
          <div className="space-y-2.5 text-sm">

            {/* Base Amount */}
            <Row label="Base Amount" value={fmt(payment.baseAmount)} />

            {/* Discount */}
            {payment.discountValue > 0 && (
              <Row
                label={`Discount (${payment.discountPercent ?? 0}%)`}
                value={`- ${fmt(payment.discountValue)}`}
                valueClassName="text-red-500"
              />
            )}

            {/* Net after discount */}
            {payment.discountValue > 0 && (
              <Row
                label="Amount After Discount"
                value={fmt(netAfterDiscount)}
                valueClassName="text-black font-medium"
              />
            )}

            <Divider />

            {/* Cash paid (if any) */}
            {payment.cashPaid > 0 && (
              <Row label="Cash Paid" value={fmt(payment.cashPaid)} valueClassName="text-black" />
            )}

            {/* Remaining to pay (net, before card tax) */}
            {payment.cashPaid > 0 && remainingToPay > 0 && (
              <Row
                label="Remaining to Pay"
                value={fmt(remainingToPay)}
                valueClassName="text-black"
              />
            )}

            {/* Card tax */}
            {payment.cardTax > 0 && (
              <Row
                label={`Card Tax (${Math.round(payment.cardTaxRate * 100)}%)`}
                value={fmt(payment.cardTax)}
                valueClassName="text-slate-600"
              />
            )}

            {/* Total remaining with tax (remaining net + card tax = what card covered) */}
            {payment.cardPaid > 0 && (
              <Row
                label="Total Remaining with Tax"
                value={fmt(payment.cardPaid)}
                valueClassName="text-black font-medium"
              />
            )}

            <Divider />

            {/* Card payment received */}
            {payment.cardPaid > 0 && (
              <Row
                label="Card Payment Received"
                value={fmt(payment.cardPaid)}
                valueClassName="text-black"
              />
            )}

            {/* Change */}
            {payment.changeToGive > 0 && (
              <Row
                label="Change to Give"
                value={fmt(payment.changeToGive)}
                valueClassName="text-green-600 font-semibold"
              />
            )}

            <Divider />

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-base pt-0.5">
              <span className="text-black">Grand Total</span>
              <span className="text-orange-500">{fmt(grandTotal)}</span>
            </div>

            <Divider />

            {/* Payment method row */}
            <Row label="Payment Method" value={payment.paymentMethod} />

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button className="flex-1 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                <Printer size={15} />
                <span>Get receipt</span>
              </button>
              <button className="flex-1 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                <Mail size={15} />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <p className="text-sm text-slate-500">Payment method</p>
            <div className="flex items-center gap-3 mt-1">
              <PaymentIcons paymentMethod={payment.paymentMethod} />
              <p className="font-medium text-black">{payment.paymentMethod}</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 w-full max-w-md ml-auto">
            <Buttons
              label="Cancel"
              onClick={() => {
                onClose();
                onCancelEdit?.();
              }}
              className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"
            />
            <Buttons
              label="Confirm"
              variant="primary"
              onClick={() => onConfirm?.()}
              className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}