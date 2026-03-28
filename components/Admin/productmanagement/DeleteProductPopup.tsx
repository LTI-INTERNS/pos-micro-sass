"use client";

import React, { useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (data: {
    deleteAll: boolean;
    selectedVariants: string[];
  }) => void;
};

// ─── Reusable styled components ───────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] text-gray-500 mb-2">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Tooltip({ text, position = "top" }: { text: string; position?: "top" | "bottom" }) {
  const isTop = position === "top";

  return (
    <span className="relative group inline-flex items-center ml-1 cursor-default">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">
        i
      </span>
      <span
        className={`
          pointer-events-none absolute z-50 left-1/2 -translate-x-1/2
          w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          ${isTop ? "bottom-full mb-2" : "top-full mt-2"}
        `}
      >
        {text}
        <span
          className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${isTop ? "top-full border-t-gray-800" : "bottom-full border-b-gray-800"}
          `}
        />
      </span>
    </span>
  );
}

function RadioOption({ checked, onChange, label, description, tooltip }: any) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 text-orange-500 focus:ring-orange-200 focus:ring-offset-0 border-gray-300 cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">
            {label}
          </span>
          {tooltip && <Tooltip text={tooltip} position="bottom" />}
        </div>
        {description && (
          <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

function CheckboxOption({ checked, onChange, label, price }: any) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-orange-500 focus:ring-orange-200 focus:ring-offset-0 border-gray-300 rounded cursor-pointer"
      />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
          {label}
        </span>
        {price !== undefined && (
          <span className="text-[12px] text-gray-400">
            Rs. {price.toFixed(2)}
          </span>
        )}
      </div>
    </label>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
    </div>
  );
}

function WarningMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl">
      <div className="flex items-start gap-2">
        <span className="text-base">⚠️</span>
        <p className="text-[13px] text-red-700 flex-1">{children}</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────

export default function DeleteProductPopup({
  isOpen,
  onClose,
  product,
  onConfirm,
}: Props) {
  const [deleteAll, setDeleteAll] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  if (!isOpen || !product) return null;

  const variants = product.variants ?? [];

  const toggleVariant = (sku: string) => {
    setSelectedVariants((prev) =>
      prev.includes(sku)
        ? prev.filter((v) => v !== sku)
        : [...prev, sku]
    );
  };

  const totalVariants = variants.length;
  const selectedCount = selectedVariants.length;

  const isAllSelected =
    !deleteAll &&
    selectedVariants.length === variants.length &&
    variants.length > 0;

  const handleConfirm = () => {
    if (!deleteAll && selectedVariants.length === 0) {
      alert("Please select at least one variant");
      return;
    }

    onConfirm({
      deleteAll: deleteAll || isAllSelected,
      selectedVariants,
    });

    onClose();
  };

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title="Delete Product"
      widthClassName="w-[500px] max-w-[95vw]"
    >
      <WarningMessage>
        {deleteAll || isAllSelected
            ? "This action cannot be undone. The entire product and all its variants will be permanently deleted."
            : "This action cannot be undone. The selected variants will be permanently deleted."
        }
    </WarningMessage>

      {/* Product Info */}
      <div className="mb-5 p-3 bg-orange-50 border border-orange-300 rounded-xl">
        <p className="text-sm font-medium text-gray-800">{product.name}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Category: {product.category} • {totalVariants} variant
          {totalVariants !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Options */}
      <div className="mb-5 space-y-3">
        <SectionTitle title="Deletion Options" />

        <RadioOption
          checked={deleteAll}
          onChange={() => setDeleteAll(true)}
          label="Delete entire product"
          tooltip={`All ${totalVariants} variants will be permanently removed`}
        />

        <RadioOption
          checked={!deleteAll}
          onChange={() => setDeleteAll(false)}
          label="Delete selected variants only"
          tooltip="Select specific variants. Selecting all will delete entire product."
        />
      </div>

      {/* Variant list */}
      {!deleteAll && (
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <Label>Select variants to delete</Label>
            {selectedCount > 0 && (
              <span className="text-[11px] text-orange-500 font-medium">
                {selectedCount} selected
              </span>
            )}
          </div>

          <div className="max-h-[220px] overflow-y-auto border border-gray-200 rounded-xl bg-white">
            {variants.map((v: any) => (
              <CheckboxOption
                key={v.sku}
                checked={selectedVariants.includes(v.sku)}
                onChange={() => toggleVariant(v.sku)}
                label={v.sku}
                price={v.price}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm border border-gray-200 rounded-4xl text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirm}
          className="px-6 py-2 text-sm bg-orange-500 text-white rounded-4xl hover:bg-orange-600 transition font-medium cursor-pointer"
        >
          {deleteAll || isAllSelected
            ? `Delete ${product.name}`
            : `Delete ${selectedCount} variant${
                selectedCount !== 1 ? "s" : ""
              }`}
        </button>
      </div>
    </ModalShell>
  );
}