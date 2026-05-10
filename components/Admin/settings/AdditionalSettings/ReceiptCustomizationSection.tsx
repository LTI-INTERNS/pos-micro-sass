"use client";

import React, { useState } from "react";
import FormField from "@/components/Admin/common/FormField";
import ToggleSwitch from "@/components/Admin/common/ToggleSwitch";
import { ExternalLink } from "lucide-react";
import ReceiptPreviewModal from "@/components/Admin/settings/AdditionalSettings/ReceiptPreviewModal";

type ReceiptCustomizationProps = {
  headerText: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;

  onHeaderTextChange: (value: string) => void;
  onFooterMessageChange: (value: string) => void;
  onShowLogoChange: (value: boolean) => void;
  onShowTaxNumberChange: (value: boolean) => void;
  onTaxNumberChange: (value: string) => void;
  onShowCustomerDetailsChange: (value: boolean) => void;
};

const MAX_HEADER_LENGTH = 100;
const MAX_FOOTER_LENGTH = 300;
const MAX_TAX_NUMBER_LENGTH = 50;

export default function ReceiptCustomizationSection({
  headerText,
  footerMessage,
  showLogo,
  showTaxNumber,
  taxNumber,
  showCustomerDetails,
  onHeaderTextChange,
  onFooterMessageChange,
  onShowLogoChange,
  onShowTaxNumberChange,
  onTaxNumberChange,
  onShowCustomerDetailsChange,
}: ReceiptCustomizationProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const demoOrderData = {
    orderId: "ORD-10432",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    paymentMethod: "Cash",
    items: [
      { name: "Item A", qty: 2, price: 180 },
      { name: "Item B", qty: 1, price: 140 },
      { name: "Item C", qty: 1, price: 520 },
    ],
    discount: 100,
    tax: 75,
    total: 995,
    cashPaid: 1000,
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6 text-gray-500">
          <h2 className="text-xl font-semibold text-gray-900">
            Receipt Customization
          </h2>

          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-orange-500
                       hover:text-orange-600 bg-orange-50 hover:bg-orange-100
                       border border-orange-200 rounded-md px-2 py-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View Receipt
          </button>
        </div>

        <div className="space-y-5">
          {/* Receipt Header */}
          <FormField
            label="Receipt Header"
            value={headerText}
            onChange={(value) => {
              if (value.length <= MAX_HEADER_LENGTH) onHeaderTextChange(value);
            }}
            placeholder="Enter header text (e.g. Welcome to Our Store)"
          />

          {/* Show Logo */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Logo on Receipt
              </label>
              <ToggleSwitch enabled={showLogo} onChange={onShowLogoChange} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Display your business logo at the top of receipts
            </p>
          </div>

          {/* Show Tax Number */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Tax Number
              </label>
              <ToggleSwitch enabled={showTaxNumber} onChange={onShowTaxNumberChange} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Display tax identification number on receipts
            </p>
          </div>

          {/* Tax Number Input */}
          {showTaxNumber && (
            <FormField
              label="Tax Number"
              value={taxNumber}
              onChange={(value) => {
                if (value.length <= MAX_TAX_NUMBER_LENGTH) onTaxNumberChange(value);
              }}
              placeholder="Enter tax number"
            />
          )}

          {/* Show Customer Details */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Customer Details
              </label>
              <ToggleSwitch enabled={showCustomerDetails} onChange={onShowCustomerDetailsChange} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Display customer name and contact information on receipts
            </p>
          </div>

          {/* Footer Message */}
          <div>
            <FormField
              label=" Footer Message"
              value={footerMessage}
              onChange={(value) => {
                if (value.length <= MAX_FOOTER_LENGTH) onFooterMessageChange(value);
              }}
              placeholder="Thank you for your business!"
            />
            <p className="text-sm text-gray-500 mt-4">
              This message will appear at the bottom of all receipts
            </p>
          </div>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        headerText={headerText}
        footerMessage={footerMessage}
        showLogo={showLogo}
        showTaxNumber={showTaxNumber}
        taxNumber={taxNumber}
        showCustomerDetails={showCustomerDetails}
        customerDetails="Nimal Silva | +94 77 123 4567"
        orderId={demoOrderData.orderId}
        date={demoOrderData.date}
        time={demoOrderData.time}
        paymentMethod={demoOrderData.paymentMethod}
        items={demoOrderData.items}
        discount={demoOrderData.discount}
        tax={demoOrderData.tax}
        total={demoOrderData.total}
        cashPaid={demoOrderData.cashPaid}
      />
    </>
  );
}