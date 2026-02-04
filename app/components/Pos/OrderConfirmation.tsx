"use client";

import React, { useMemo } from "react";
import OrderTable, { Column } from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";
import type { PaymentSummary } from "./posdashboard/OrderPaymentModal";

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

export default function OrderConfirmation({ open, onClose, items, payment }: Props) {
  const itemsSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number.isFinite(it.subtotal) ? it.subtotal : 0), 0),
    [items]
  );

  if (!open) return null;

  const c = payment.currencyCode ?? "LKR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8">
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
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>

          {/* Totals + Payment summary */}
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

            {/* Payment details */}
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

              {payment.changeToGive > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>CHANGE TO GIVE</span>
                  <span className="text-black">
                    {c} {payment.changeToGive.toFixed(2)}
                  </span>
                </div>
              )}

              {payment.remainingToPay > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>REMAINING</span>
                  <span className="text-black">
                    {c} {payment.remainingToPay.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <p className="text-sm text-slate-500">Payment method</p>
            <div className="flex items-center">
              <img src="/money.png" alt="Payment" className="w-5 h-5 inline mr-2" />
              <p className="font-medium text-black">{payment.paymentMethod}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
            <Buttons
              label="Cancel"
              onClick={onClose}
              className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"
            />
            <Buttons
              label="confirm"
              variant="primary"
              onClick={() => {
                // final submit later
                onClose();
              }}
              className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
