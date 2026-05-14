"use client";

import React, { useEffect, useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import type { Order } from "@/types/order.types";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import { useReceiptSettings } from "@/lib/context/ReceiptSettingsContext";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";
import ReceiptDisplay from "@/components/Admin/settings/AdditionalSettings/ReceiptDisplay";
import { generateReceiptHTML } from "@/lib/utils/generateReceiptHTML";
import { orderService } from "@/lib/services/order-service";

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map Order.items → ReceiptDisplay item shape. */
function buildReceiptItems(order: Order): { name: string; qty: number; price: number }[] {
  if (order.items && order.items.length > 0) {
    return order.items.map((it) => ({
      name:  it.name,
      qty:   it.qty,
      price: it.price,
    }));
  }
  // Fallback: single line showing the order total (no items returned yet)
  return [{ name: `Order #${order.orderNumber}`, qty: 1, price: order.totalamount ?? 0 }];
}

/**
 * Derive cashPaid / cardPaid from the payment breakdown.
 * Walks paymentDetails and sums by method; falls back to top-level cashReceived.
 */
function deriveCashCard(order: Order): { cashPaid: number | undefined; cardPaid: number | undefined } {
  let cashPaid = 0;
  let cardPaid = 0;

  for (const payment of order.payments ?? []) {
    for (const detail of payment.paymentDetails ?? []) {
      if (detail.method === "CASH") cashPaid += Number(detail.amount);
      if (detail.method === "CARD") cardPaid += Number(detail.amount);
    }
  }

  // Fallback for simple cash orders
  if (cashPaid === 0 && order.cashReceived) cashPaid = order.cashReceived;

  // Infer from paymenttype when detail records are absent
  if (cashPaid === 0 && cardPaid === 0) {
    const pt = (order.paymenttype ?? "").toLowerCase();
    if (pt === "cash")  cashPaid = order.totalamount ?? 0;
    if (pt === "card")  cardPaid = order.totalamount ?? 0;
    // Split: leave both at 0 — receipt will show paymentMethod label only
  }

  return {
    cashPaid: cashPaid > 0 ? cashPaid : undefined,
    cardPaid: cardPaid > 0 ? cardPaid : undefined,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function OrderBillModal({ open, onClose, order }: Props) {
  const { currency, useCents }  = useCurrency();
  const { storeInfo }           = useStoreInfo();
  const { receiptSettings }     = useReceiptSettings();

  // The list endpoint returns orders WITHOUT orderItems (uses ORDER_LIST_SELECT).
  // We fetch the full detail (ORDER_DETAIL_SELECT) when the modal opens so all
  // line items are available for the receipt.
  const [fullOrder, setFullOrder]   = useState<Order | null>(null);
  const [isFetching, setIsFetching] = useState(false);
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
        setIsFetching(true);
        setFetchError("");
        const detail = await orderService.getById(order.id);
        if (!cancelled) setFullOrder(detail);
      } catch {
        if (!cancelled) setFetchError("Failed to load order details.");
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, order?.id]);

  if (!order) return null;

  // Use the fully-loaded order once available, fall back to the list-row data
  const displayOrder = fullOrder ?? order;

  const format = (value: number) => formatCurrency(value, currency, useCents);

  const orderDate = displayOrder.dateTime ? new Date(displayOrder.dateTime) : new Date();
  const date      = orderDate.toLocaleDateString();
  const time      = orderDate.toLocaleTimeString();

  const items         = buildReceiptItems(displayOrder);
  const { cashPaid, cardPaid } = deriveCashCard(displayOrder);

  const discount      = displayOrder.discountAmount ?? 0;
  const tax           = displayOrder.tax            ?? 0;
  const total         = displayOrder.totalamount    ?? 0;
  const paymentMethod = displayOrder.paymenttype    ?? "Cash";

  // Build absolute logo URL for the print window (relative URLs don't work in about:blank)
  const absoluteLogoUrl = storeInfo.logoUrl
    ? storeInfo.logoUrl.startsWith("http")
      ? storeInfo.logoUrl
      : typeof window !== "undefined"
        ? `${window.location.origin}${storeInfo.logoUrl}`
        : storeInfo.logoUrl
    : null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(
        "Print receipt: your browser blocked the print window.\n" +
        "Please allow pop-ups for this site and try again."
      );
      return;
    }

    const receiptHTML = generateReceiptHTML({
      headerText:          receiptSettings.headerText,
      footerMessage:       receiptSettings.footerMessage,
      showLogo:            receiptSettings.showLogo,
      showTaxNumber:       receiptSettings.showTaxNumber,
      taxNumber:           receiptSettings.taxNumber,
      showCustomerDetails: receiptSettings.showCustomerDetails,
      customerDetails:     displayOrder.customer ?? "",
      storeName:           storeInfo.storeName,
      branchName:          displayOrder.branch   || storeInfo.branchName,
      cashierName:         displayOrder.cashier  || storeInfo.cashierName,
      telephone:           storeInfo.telephone,
      logoUrl:             absoluteLogoUrl,
      orderId:             displayOrder.orderNumber,
      date,
      time,
      items,
      discount,
      tax,
      total,
      paymentMethod,
      cashPaid,
      cardPaid,
      formatPrice: format,
    });

    // Assign onload BEFORE document.close() — for blank windows the load event
    // fires synchronously on close, so assigning after is always too late.
    printWindow.onload = () => {
      const images = printWindow.document.images;
      let loaded   = 0;

      const doPrint = () => {
        printWindow.print();
        printWindow.close();
      };

      if (images.length === 0) { doPrint(); return; }

      for (const img of Array.from(images)) {
        if (img.complete) {
          loaded++;
        } else {
          img.onload = img.onerror = () => {
            loaded++;
            if (loaded === images.length) doPrint();
          };
        }
      }

      if (loaded === images.length) doPrint();
    };

    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`Receipt Preview – #${order.orderNumber}`}
      widthClassName="w-[320px] max-w-[92vw]"
    >
      {/* Loading / error states */}
      {isFetching && (
        <div className="flex items-center justify-center py-6 text-sm text-gray-400 gap-2">
          <Loader2 size={16} className="animate-spin" />
          Loading order details…
        </div>
      )}

      {fetchError && (
        <div className="mb-3 rounded bg-red-50 px-3 py-2 text-xs text-red-600">
          {fetchError} Showing available data.
        </div>
      )}

      {/* Scrollable receipt preview */}
      {!isFetching && (
        <div className="mb-4 max-h-[45vh] overflow-y-scroll pr-2">
          <ReceiptDisplay
            headerText={receiptSettings.headerText}
            footerMessage={receiptSettings.footerMessage}
            showLogo={receiptSettings.showLogo}
            showTaxNumber={receiptSettings.showTaxNumber}
            taxNumber={receiptSettings.taxNumber}
            showCustomerDetails={receiptSettings.showCustomerDetails}
            customerDetails={displayOrder.customer ?? ""}
            storeName={storeInfo.storeName}
            branchName={displayOrder.branch   || storeInfo.branchName}
            cashierName={displayOrder.cashier || storeInfo.cashierName}
            telephone={storeInfo.telephone}
            logoUrl={storeInfo.logoUrl}
            orderId={displayOrder.orderNumber}
            date={date}
            time={time}
            items={items}
            discount={discount}
            tax={tax}
            total={total}
            paymentMethod={paymentMethod}
            cashPaid={cashPaid}
            cardPaid={cardPaid}
            format={format}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3 border-t border-gray-200 pt-4">
        <ActionButton
          variant="outline"
          label="Cancel"
          onClick={onClose}
          fullWidth
          className="flex-1"
        />
        <ActionButton
          variant="primary"
          onClick={handlePrint}
          fullWidth
          disabled={isFetching}
          className="flex flex-1 items-center justify-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </ActionButton>
      </div>
    </ModalShell>
  );
}