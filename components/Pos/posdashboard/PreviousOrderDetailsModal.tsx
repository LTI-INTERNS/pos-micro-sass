"use client";

import React from "react";
import { Mail, X, Printer } from "lucide-react";
import type { Order } from "@/types/order.types";
import OrderSummaryContent, {
  PaymentIcons,
  type CommonPaymentSummary,
  type CommonOrderItem,
} from "@/components/Pos/OrderSummaryContent";
import { useReceiptPrinter } from "@/hooks/useReceiptActions";

type Props = {
  open:    boolean;
  onClose: () => void;
  order:   Order | null;
};

/**
 * Map our canonical Order.items → CommonOrderItem (which requires `subtotal`).
 * `subtotal` === `total` from the backend OrderItem record.
 */
function toCommonItems(order: Order): CommonOrderItem[] {
  return (order.items ?? []).map((it, i) => ({
    id:       i,
    name:     it.name,
    qty:      it.qty,
    price:    it.price,
    subtotal: it.total,
  }));
}

/**
 * Derive cash / card paid amounts from the payment breakdown.
 * The backend stores per-method amounts in paymentDetails.
 */
function deriveCashCard(order: Order): { cashPaid: number; cardPaid: number } {
  let cashPaid = 0;
  let cardPaid = 0;

  for (const payment of order.payments ?? []) {
    for (const detail of payment.paymentDetails ?? []) {
      if (detail.method === "CASH") cashPaid += Number(detail.amount);
      if (detail.method === "CARD") cardPaid += Number(detail.amount);
    }
  }

  // Fallback: use top-level cashReceived if detail loop yielded nothing
  if (cashPaid === 0 && order.cashReceived) cashPaid = order.cashReceived;

  return { cashPaid, cardPaid };
}

export default function PreviousOrderDetailsModal({ open, onClose, order }: Props) {
  const items = order ? toCommonItems(order) : [];
  const { cashPaid, cardPaid } = order ? deriveCashCard(order) : { cashPaid: 0, cardPaid: 0 };

  // Build the receipt data for useReceiptPrinter
  const receiptData = order
    ? {
        orderId:       order.orderNumber,
        currencyCode:  "LKR",
        items:         items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
        discountValue: order.discountAmount ?? 0,
        cardTax:       order.tax ?? 0,
        grandTotal:    order.totalamount ?? 0,
        paymentMethod: order.paymenttype ?? "",
        cashPaid,
        cardPaid,
        customerEmail: null as string | null,
      }
    : {
        orderId:       "",
        currencyCode:  "LKR",
        items:         [] as { name: string; qty: number; price: number }[],
        discountValue: 0,
        cardTax:       0,
        grandTotal:    0,
        paymentMethod: "",
        cashPaid:      0,
        cardPaid:      0,
      };

  const { handlePrint, handleEmail } = useReceiptPrinter(receiptData);

  if (!open || !order) return null;

  const noteText  = (order.note ?? "").trim();
  const noteValue = noteText || "No notes available";

  const commonPayment: CommonPaymentSummary = {
    orderNo:       order.orderNumber,
    currencyCode:  "LKR",
    discountValue: order.discountAmount ?? 0,
    cardTax:       order.tax ?? 0,
    grandTotal:    order.totalamount ?? 0,
    paymentMethod: order.paymenttype ?? "—",
    cashPaid,
    cardPaid,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="prev-order-details">
          <OrderSummaryContent<CommonOrderItem>
            title="Previous Order Details"
            subtitle="View receipt for this completed order"
            orderNoLabel={order.orderNumber}
            items={items}
            payment={commonPayment}
            leftBlock={
              <div className="border rounded-xl p-4 bg-slate-50 h-full flex flex-col">
                <h3 className="font-semibold mb-2 text-black">NOTES</h3>
                <div className="flex-1">
                  <textarea
                    value={noteValue}
                    readOnly
                    disabled
                    className="w-full h-[220px] resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black/60 focus:outline-none"
                  />
                </div>
              </div>
            }
            rightAction={null}
          />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pt-6 border-t mt-4">
            <div>
              <p className="text-sm text-slate-500">Payment method</p>
              <div className="flex items-center gap-3 mt-1">
                <PaymentIcons paymentMethod={order.paymenttype ?? ""} />
                <p className="font-medium text-black">{order.paymenttype ?? "—"}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 md:flex-none md:min-w-[180px] h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer hover:bg-gray-800"
              >
                <Printer size={16} />
                <span>Get Receipt</span>
              </button>

              {/* Email button only shown if customer has an email */}
              {receiptData.customerEmail && (
                <button
                  onClick={handleEmail}
                  className="flex-1 md:flex-none md:min-w-[180px] h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer hover:bg-gray-800"
                >
                  <Mail size={16} />
                  <span>Email</span>
                </button>
              )}
            </div>
          </div>

          {/* Suppress the duplicate action row rendered inside OrderSummaryContent */}
          <style jsx global>{`
            .prev-order-details .grid > :last-child > div.pt-3.border-t.flex.gap-3 {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}