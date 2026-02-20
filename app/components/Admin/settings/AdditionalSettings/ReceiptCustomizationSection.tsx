"use client";

import React from "react";
import FormField from "@/app/components/Admin/common/FormField";
import ToggleSwitch from "../../common/ToggleSwitch";

type ReceiptCustomizationProps = {
  headerText: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  onHeaderTextChange: (value: string) => void;
  onFooterMessageChange: (value: string) => void;
  onShowLogoChange: (value: boolean) => void;
  onShowTaxNumberChange: (value: boolean) => void;
  onTaxNumberChange: (value: string) => void;
};

export default function ReceiptCustomizationSection({
  headerText,
  footerMessage,
  showLogo,
  showTaxNumber,
  taxNumber,
  onHeaderTextChange,
  onFooterMessageChange,
  onShowLogoChange,
  onShowTaxNumberChange,
  onTaxNumberChange,
}: ReceiptCustomizationProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Receipt Customization
      </h2>

      <div className="space-y-5">
        <FormField
          label="Receipt Header"
          value={headerText}
          onChange={onHeaderTextChange}
          placeholder="Enter header text (e.g. Welcome to Our Store)"
        />

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Show Logo on Receipt
            </label>

            <ToggleSwitch
              enabled={showLogo}
              onChange={onShowLogoChange}
            />
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Display your business logo at the top of receipts
          </p>
        </div>

        <div >
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Show Tax Number
            </label>

            <ToggleSwitch
              enabled={showTaxNumber}
              onChange={onShowTaxNumberChange}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Display tax identification number on receipts
          </p>
          
        </div>


        {showTaxNumber && (
          <FormField
            label="Tax Number"
            value={taxNumber}
            onChange={onTaxNumberChange}
            placeholder="Enter tax number"
          />
        )}

        <div>
          <label className="block text-[12px] text-gray-500 pt-5">
            Footer Message
          </label>
          <textarea
            value={footerMessage}
            onChange={(e) => onFooterMessageChange(e.target.value)}
            rows={2}
            className="w-full rounded-full border px-4 py-2 outline-none resize-none border-gray-200 text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            placeholder="Thank you for your business!"
          />
          <p className="text-sm text-gray-500 mt-4">
            This message will appear at the bottom of all receipts
          </p>
        </div>
      </div>
    </div>
  );
}
