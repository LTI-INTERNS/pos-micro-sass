"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, Loader2 } from "lucide-react";
import type { Order } from "@/types/order.types";
import { orderService } from "@/lib/services/order-service";
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

function toCommonItems(order: Order): CommonOrderItem[] {
  return (order.items ?? []).map((it, i) => ({
    id:       i,
    name:     it.name,
    qty:      Number(it.qty)   || 0,
    price:    Number(it.price) || 0,
    subtotal: Number(it.total) || 0,
  }));
}

function deriveCashCard(order: Order): { cashPaid: number; cardPaid: number } {
  let cashPaid = 0;
  let cardPaid = 0;

  for (const payment of order.payments ?? []) {
    for (const detail of payment.paymentDetails ?? []) {
      if (detail.method === "CASH") cashPaid += Number(detail.amount) || 0;
      if (detail.method === "CARD") cardPaid += Number(detail.amount) || 0;
    }
  }

  if (cashPaid === 0 && order.cashReceived) cashPaid = Number(order.cashReceived) || 0;

  return { cashPaid, cardPaid };
}

export default function PreviousOrderDetailsModal({ open, onClose, order }: Props) {
  const [fullOrder, setFullOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!open || !order?.id) {
      setFullOrder(null);
      setFetchError("");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setFetchError("");
        const data = await orderService.getById(order.id);
        if (!cancelled) setFullOrder(data);
      } catch {
        if (!cancelled) setFetchError("Failed to load order details. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, order?.id]);

  // Derive display data from the full order (or fall back to empty)
  const displayOrder = fullOrder ?? order;
  const items = displayOrder ? toCommonItems(displayOrder) : [];
  const { cashPaid, cardPaid } = displayOrder
    ? deriveCashCard(displayOrder)
    : { cashPaid: 0, cardPaid: 0 };

  const receiptData = displayOrder
    ? {
        orderId:       displayOrder.orderNumber,
        currencyCode:  "LKR",
        items:         items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
        discountValue: Number(displayOrder.discountAmount) || 0,
        cardTax:       Number(displayOrder.tax)            || 0,
        grandTotal:    Number(displayOrder.totalamount)    || 0,
        paymentMethod: displayOrder.paymenttype ?? "",
        cashPaid,
        cardPaid,
        customerName:  displayOrder.customer !== "Walk-in Customer" ? displayOrder.customer : null,
        customerPhone: null as string | null,
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
        customerName:  null as string | null,
        customerPhone: null as string | null,
        customerEmail: null as string | null,
      };

  const { handlePrint } = useReceiptPrinter(receiptData);

  if (!open || !order) return null;

  const commonPayment: CommonPaymentSummary = {
    orderNo:       displayOrder?.orderNumber ?? order.orderNumber,
    currencyCode:  "LKR",
    discountValue: Number(displayOrder?.discountAmount) || 0,
    cardTax:       Number(displayOrder?.tax)            || 0,
    grandTotal:    Number(displayOrder?.totalamount)    || 0,
    paymentMethod: displayOrder?.paymenttype ?? "—",
    cashPaid,
    cardPaid,
  };

  const noteText  = (displayOrder?.note ?? "").trim();
  const noteValue = noteText || "No notes";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-6 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading order details…</span>
          </div>
        )}

        {/* Error state */}
        {!isLoading && fetchError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <span>&#10007;</span>
            <span>{fetchError}</span>
          </div>
        )}

        {/* Content — faded while loading so layout does not jump */}
        {!fetchError && (
          <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
            <OrderSummaryContent<CommonOrderItem>
              title="Order Details"
              subtitle="View receipt for this completed order"
              orderNoLabel={displayOrder?.orderNumber ?? order.orderNumber}
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
                  <PaymentIcons paymentMethod={displayOrder?.paymenttype ?? ""} />
                  <p className="font-medium text-black">{displayOrder?.paymenttype ?? "—"}</p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                disabled={isLoading || !fullOrder}
                className="h-12 px-6 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}