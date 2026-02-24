"use client";

import React from "react";
import { Printer } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";
import { useStoreInfo } from "@/app/context/StoreInfoContext";
import ModalShell from "@/app/components/Admin/common/ModalShell";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import ReceiptDisplay from "./ReceiptDisplay";
import { generateReceiptHTML } from "@/app/utils/generateReceiptHTML";

export type ReceiptPreviewProps = {
  open: boolean;
  onClose: () => void;
  headerText?: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;
  customerDetails?: string;

  // ✅ removed storeName, branchName, cashierName — now from StoreInfoContext
  orderId: string;
  date: string;
  time: string;
  items: { name: string; qty: number; price: number }[];
  discount?: number;
  tax?: number;
  total: number;
  paymentMethod: string;
  cashPaid?: number;
  cardPaid?: number;
};

export default function ReceiptPreviewModal({
  open,
  onClose,
  headerText,
  footerMessage,
  showLogo,
  showTaxNumber,
  taxNumber,
  showCustomerDetails,
  customerDetails,
  orderId,
  date,
  time,
  items,
  discount = 0,
  tax = 0,
  total,
  paymentMethod,
  cashPaid,
  cardPaid,
}: ReceiptPreviewProps) {
  const { currency, useCents } = useCurrency();
  const { storeInfo } = useStoreInfo(); 

  const format = (value: number) => formatCurrency(value, currency, useCents);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const absoluteLogoUrl = storeInfo.logoUrl
      ? storeInfo.logoUrl.startsWith("http")
        ? storeInfo.logoUrl
        : `${window.location.origin}${storeInfo.logoUrl}`
      : null;

    const receiptHTML = generateReceiptHTML({
      headerText,
      footerMessage,
      showLogo,
      showTaxNumber,
      taxNumber,
      showCustomerDetails,
      customerDetails,
      storeName: storeInfo.storeName,
      branchName: storeInfo.branchName,
      cashierName: storeInfo.cashierName,
      telephone: storeInfo.telephone,
      logoUrl: absoluteLogoUrl,
      orderId,
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
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Receipt Preview"
      widthClassName="w-[320px] max-w-[92vw]"
    >
      <div className="max-h-[45vh] overflow-y-scroll mb-4 -mr-6 pr-6">
        <ReceiptDisplay
          headerText={headerText}
          footerMessage={footerMessage}
          showLogo={showLogo}
          showTaxNumber={showTaxNumber}
          taxNumber={taxNumber}
          showCustomerDetails={showCustomerDetails}
          customerDetails={customerDetails}
          storeName={storeInfo.storeName}
          branchName={storeInfo.branchName}
          cashierName={storeInfo.cashierName}
          telephone={storeInfo.telephone}
          logoUrl={storeInfo.logoUrl}
          orderId={orderId}
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

      <div className="flex gap-3 justify-center pt-4 border-t border-gray-200">
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
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </ActionButton>
      </div>
    </ModalShell>
  );
}