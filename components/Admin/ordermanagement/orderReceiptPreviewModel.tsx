"use client";

import React from "react";
import { Printer } from "lucide-react";
import type { Order } from "@/types/order.types";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import { useReceiptSettings } from "@/lib/context/ReceiptSettingsContext";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";
import ReceiptDisplay from "@/components/Admin/settings/AdditionalSettings/ReceiptDisplay";
import { generateReceiptHTML } from "@/lib/utils/generateReceiptHTML";

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
  const { currency, useCents }   = useCurrency();
  const { storeInfo }            = useStoreInfo();
  const { receiptSettings }      = useReceiptSettings();

  if (!order) return null;

  const format = (value: number) => formatCurrency(value, currency, useCents);

  const orderDate = order.dateTime ? new Date(order.dateTime) : new Date();
  const date      = orderDate.toLocaleDateString();
  const time      = orderDate.toLocaleTimeString();

  const items         = buildReceiptItems(order);
  const { cashPaid, cardPaid } = deriveCashCard(order);

  const discount      = order.discountAmount ?? 0;
  const tax           = order.tax            ?? 0;
  const total         = order.totalamount    ?? 0;
  const paymentMethod = order.paymenttype    ?? "Cash";

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
    if (!printWindow) return;

    const receiptHTML = generateReceiptHTML({
      headerText:         receiptSettings.headerText,
      footerMessage:      receiptSettings.footerMessage,
      showLogo:           receiptSettings.showLogo,
      showTaxNumber:      receiptSettings.showTaxNumber,
      taxNumber:          receiptSettings.taxNumber,
      showCustomerDetails: receiptSettings.showCustomerDetails,
      customerDetails:    order.customer ?? "",
      storeName:          storeInfo.storeName,
      branchName:         order.branch    || storeInfo.branchName,
      cashierName:        order.cashier   || storeInfo.cashierName,
      telephone:          storeInfo.telephone,
      logoUrl:            absoluteLogoUrl,
      orderId:            order.orderNumber,
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

    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      const images = printWindow.document.images;
      let loaded   = 0;

      if (images.length === 0) {
        printWindow.print();
        printWindow.close();
        return;
      }

      for (const img of images) {
        if (img.complete) {
          loaded++;
        } else {
          img.onload = img.onerror = () => {
            loaded++;
            if (loaded === images.length) {
              printWindow.print();
              printWindow.close();
            }
          };
        }
      }

      if (loaded === images.length) {
        printWindow.print();
        printWindow.close();
      }
    };
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`Receipt Preview – #${order.orderNumber}`}
      widthClassName="w-[320px] max-w-[92vw]"
    >
      {/* Scrollable receipt preview */}
      <div className="mb-4 max-h-[45vh] overflow-y-scroll pr-2">
        <ReceiptDisplay
          headerText={receiptSettings.headerText}
          footerMessage={receiptSettings.footerMessage}
          showLogo={receiptSettings.showLogo}
          showTaxNumber={receiptSettings.showTaxNumber}
          taxNumber={receiptSettings.taxNumber}
          showCustomerDetails={receiptSettings.showCustomerDetails}
          customerDetails={order.customer ?? ""}
          storeName={storeInfo.storeName}
          branchName={order.branch    || storeInfo.branchName}
          cashierName={order.cashier  || storeInfo.cashierName}
          telephone={storeInfo.telephone}
          logoUrl={storeInfo.logoUrl}
          orderId={order.orderNumber}
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
          className="flex flex-1 items-center justify-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </ActionButton>
      </div>
    </ModalShell>
  );
}