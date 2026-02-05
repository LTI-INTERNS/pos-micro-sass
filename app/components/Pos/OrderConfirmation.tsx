"use client";

import React, { useMemo } from "react";
import OrderTable, { Column } from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";
import type { PaymentSummary } from "./posdashboard/OrderPaymentModal";
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

  onCancelEdit?: () => void; // go back to payment modal (no reset)
  onConfirm?: () => void; // final confirm
};

const columns: Column<ConfirmItem>[] = [
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

export default function OrderConfirmation({
  open,
  onClose,
  items,
  payment,
  onCancelEdit,
  onConfirm,
}: Props) {
  const itemsSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number.isFinite(it.subtotal) ? it.subtotal : 0), 0),
    [items]
  );

  if (!open) return null;

  const c = payment.currencyCode ?? "LKR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black">Order confirmation</h1>
          <p className="text-slate-500">Please confirm the order below to completed payment</p>
          <p className="text-xs text-slate-400 mt-1">Order #{payment.orderNo}</p>
        </div>

        <OrderTable data={items} columns={columns} emptyMessage="No order items found" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4 bg-slate-50">
            <h3 className="font-semibold mb-2 text-black">NOTES</h3>
            <p className="text-sm text-slate-500">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>

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

            {/* moved actions from payment modal */}
            <div className="pt-3 border-t flex gap-3">
              <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                <Printer size={16} />
                <span>Get receipt</span>
              </button>

              <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                <Mail size={16} />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <p className="text-sm text-slate-500">Payment method</p>
            <div className="flex items-center gap-3">
              <PaymentIcons paymentMethod={payment.paymentMethod} />
              <p className="font-medium text-black">{payment.paymentMethod}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
            <Buttons
              label="Cancel"
              onClick={() => {
                onClose();
                onCancelEdit?.();
              }}
              className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"
            />
            <Buttons
              label="confirm"
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
