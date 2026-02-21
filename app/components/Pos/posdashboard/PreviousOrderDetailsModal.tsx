"use client";

import React from "react";
import { Mail, X } from "lucide-react";
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
            className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <OrderSummaryContent<PreviousOrderItem>
            title="Previous Order Details"
            subtitle="View receipt or email for this completed order"
            orderNoLabel={details.orderId}
            items={details.items}
            payment={commonPayment}
            leftBlock={
              <div className="border rounded-xl p-4 bg-slate-50 h-full flex flex-col justify-center">
                <p className="text-sm text-slate-500">Payment method</p>
                <div className="flex items-center gap-3 mt-2">
                  <PaymentIcons paymentMethod={details.paymentMethod} />
                  <p className="font-medium text-black">{details.paymentMethod}</p>
                </div>
              </div>
            }
            rightAction={
              hasEmail ? (
                <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                  <Mail size={16} />
                  <span>Email</span>
                </button>
              ) : null
            }
          />

          {/*  Notes section removed (handled by leftBlock) */}
          {/*  Bottom section removed (not included here) */}
        </div>
      </div>
    </>
  );
}