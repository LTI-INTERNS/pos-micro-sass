"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Order } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";
import ReceiptDisplay from "@/components/Admin/settings/AdditionalSettings/ReceiptDisplay";
import { generateReceiptHTML } from "@/lib/utils/generateReceiptHTML";

type OrderReceiptPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  order: Order | null;
};

export default function OrderReceiptPreviewModal({
  open,
  onClose,
  order,
}: OrderReceiptPreviewModalProps) {
  const { currency, useCents } = useCurrency();
  const { storeInfo } = useStoreInfo();

  if (!order) return null;

  const format = (value: number) => formatCurrency(value, currency, useCents);

  const orderDate = order.dateTime ? new Date(order.dateTime) : new Date();

  const date = orderDate.toLocaleDateString();
  const time = orderDate.toLocaleTimeString();

  // Temporary fallback items because current Order type has no items array yet
  const items = [
    {
      name: `Order #${order.id}`,
      qty: 1,
      price: order.totalamount ?? 0,
    },
  ];

  const discount = 0;
  const tax = 0;
  const total = order.totalamount ?? 0;
  const paymentMethod = order.paymenttype ?? "Cash";

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const absoluteLogoUrl = storeInfo.logoUrl
      ? storeInfo.logoUrl.startsWith("http")
        ? storeInfo.logoUrl
        : `${window.location.origin}${storeInfo.logoUrl}`
      : null;

    const receiptHTML = generateReceiptHTML({
      headerText: "",
      footerMessage: "Thank you for your purchase!",
      showLogo: true,
      showTaxNumber: false,
      taxNumber: "",
      showCustomerDetails: false,
      customerDetails: "",
      storeName: storeInfo.storeName,
      branchName: order.branch || storeInfo.branchName,
      cashierName: order.cashier || storeInfo.cashierName,
      telephone: storeInfo.telephone,
      logoUrl: absoluteLogoUrl,
      orderId: String(order.id),
      date,
      time,
      items,
      discount,
      tax,
      total,
      paymentMethod,
      cashPaid: paymentMethod.toLowerCase() === "cash" ? total : undefined,
      cardPaid: paymentMethod.toLowerCase() === "card" ? total : undefined,
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
      <div className="mb-4 max-h-[45vh] overflow-y-scroll pr-2">
        <ReceiptDisplay
          headerText=""
          footerMessage="Thank you for your purchase!"
          showLogo={true}
          showTaxNumber={false}
          taxNumber=""
          showCustomerDetails={false}
          customerDetails=""
          storeName={storeInfo.storeName}
          branchName={order.branch || storeInfo.branchName}
          cashierName={order.cashier || storeInfo.cashierName}
          telephone={storeInfo.telephone}
          logoUrl={storeInfo.logoUrl}
          orderId={String(order.id)}
          date={date}
          time={time}
          items={items}
          discount={discount}
          tax={tax}
          total={total}
          paymentMethod={paymentMethod}
          cashPaid={paymentMethod.toLowerCase() === "cash" ? total : undefined}
          cardPaid={paymentMethod.toLowerCase() === "card" ? total : undefined}
          format={format}
        />
      </div>

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