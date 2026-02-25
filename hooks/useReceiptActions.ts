"use client";

import { useCallback } from "react";
import { generateReceiptHTML } from "@/lib/utils/generateReceiptHTML";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { useReceiptSettings } from "@/lib/context/ReceiptSettingsContext";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

// ─── The data shape this hook needs — generic enough for any order source ───
export type ReceiptOrderData = {
  orderId: string | number;
  currencyCode?: string;
  items: { name: string; qty: number; price: number }[];
  discountValue: number;
  cardTax: number;
  grandTotal: number;
  paymentMethod: string;
  cashPaid: number;
  cardPaid: number;
  // Full customer details — all optional, print whatever is available
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
};

export function useReceiptPrinter(order: ReceiptOrderData) {
  const { receiptSettings } = useReceiptSettings();
  const { storeInfo } = useStoreInfo();
  const { currency, useCents } = useCurrency();

  const c = order.currencyCode ?? currency ?? "LKR";
  const format = useCallback(
    (value: number) => formatCurrency(value, c, useCents),
    [c, useCents]
  );

  const buildHTML = useCallback(() => {
    const now = new Date();

    const absoluteLogoUrl = storeInfo.logoUrl
      ? storeInfo.logoUrl.startsWith("http")
        ? storeInfo.logoUrl
        : `${window.location.origin}${storeInfo.logoUrl}`
      : null;

    // Build a multi-line customer details string from whatever fields exist
    const customerDetails = [
      order.customerName,
      order.customerPhone,
      order.customerEmail,
    ]
      .filter(Boolean)
      .join("\n");

    return generateReceiptHTML({
      // Receipt settings from admin context
      headerText: receiptSettings.headerText,
      footerMessage: receiptSettings.footerMessage,
      showLogo: receiptSettings.showLogo,
      showTaxNumber: receiptSettings.showTaxNumber,
      taxNumber: receiptSettings.taxNumber,
      showCustomerDetails: receiptSettings.showCustomerDetails,
      customerDetails,
      // Store info from context
      storeName: storeInfo.storeName,
      branchName: storeInfo.branchName,
      cashierName: storeInfo.cashierName,
      telephone: storeInfo.telephone,
      logoUrl: absoluteLogoUrl,
      // Order data
      orderId: String(order.orderId),
      date: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: order.items,
      discount: order.discountValue,
      tax: order.cardTax,
      total: order.grandTotal,
      paymentMethod: order.paymentMethod,
      cashPaid: order.cashPaid,
      cardPaid: order.cardPaid,
      formatPrice: format,
    });
  }, [order, receiptSettings, storeInfo, format]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(buildHTML());
    printWindow.document.close();

    printWindow.onload = () => {
      const images = printWindow.document.images;
      let loaded = 0;

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
  }, [buildHTML]);

  const handleEmail = useCallback(() => {
    const email = order.customerEmail;
    if (!email) return;
    const subject = encodeURIComponent(`Your Receipt - Order #${order.orderId}`);
    const body = encodeURIComponent(
      `Dear Customer,\n\nPlease find your receipt for Order #${order.orderId}.\n\nTotal: ${c} ${order.grandTotal.toFixed(2)}\nPayment Method: ${order.paymentMethod}\n\nThank you for your purchase!`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
  }, [order, c]);

  return { handlePrint, handleEmail };
}