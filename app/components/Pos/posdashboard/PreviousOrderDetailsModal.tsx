"use client";

import React from "react";
import { Mail, X, Printer } from "lucide-react";
import type { PreviousOrderDetails, PreviousOrderItem } from "@/app/ordermanagement/previousOrderDetailsMock";

import OrderSummaryContent, {
  PaymentIcons,
  type CommonPaymentSummary,
} from "../OrderSummaryContent";

type Props = {
  open: boolean;
  onClose: () => void;
  details: PreviousOrderDetails | null;
};

export default function PreviousOrderDetailsModal({ open, onClose, details }: Props) {
  if (!open || !details) return null;

  const hasEmail = Boolean(details.email && details.email.trim());
  const noteText = (details.note ?? "").trim();
  const noteValue = noteText ? noteText : "No Notes available";

  const commonPayment: CommonPaymentSummary = {
    orderNo: details.orderId,
    currencyCode: details.currencyCode ?? "LKR",
    discountValue: details.discountValue,
    cardTax: details.cardTax,
    grandTotal: details.grandTotal,
    paymentMethod: details.paymentMethod,
    cashPaid: details.cashPaid,
    cardPaid: details.cardPaid,
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Scoped wrapper for safe styling without changing the common component */}
          <div className="prev-order-details">
            <OrderSummaryContent<PreviousOrderItem>
              title="Previous Order Details"
              subtitle="View receipt or email for this completed order"
              orderNoLabel={details.orderId}
              items={details.items}
              payment={commonPayment}
              leftBlock={
                <div className="border rounded-xl p-4 bg-slate-50 h-full flex flex-col">
                  <h3 className="font-semibold mb-2 text-black">NOTES</h3>

                  {/* Non-editable note area */}
                  <div className="flex-1">
                    <textarea
                      value={noteValue}
                      readOnly
                      disabled
                      className="w-full h-[220px] resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black/60 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              }
              /*  We will show receipt/email buttons in the bottom bar (requested),
                 so we hide the built-in action row using CSS below. */
              rightAction={null}
            />

            {/*  Bottom section: payment method + buttons aligned horizontally */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pt-6 border-t mt-4">
              <div>
                <p className="text-sm text-slate-500">Payment method</p>
                <div className="flex items-center gap-3 mt-1">
                  <PaymentIcons paymentMethod={details.paymentMethod} />
                  <p className="font-medium text-black">{details.paymentMethod}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none md:min-w-[180px] h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                  <Printer size={16} />
                  <span>Get receipt</span>
                </button>

                {hasEmail && (
                  <button className="flex-1 md:flex-none md:min-w-[180px] h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                    <Mail size={16} />
                    <span>Email</span>
                  </button>
                )}
              </div>
            </div>

            {/*  Hide the action row inside OrderSummaryContent (so buttons appear ONLY in bottom bar) */}
            <style jsx global>{`
              .prev-order-details .grid > :last-child > div.pt-3.border-t.flex.gap-3 {
                display: none;
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
}