"use client";

import React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";

export interface SupplierDeleteWarnings {
  productCount: number;
}

type Props = {
  isOpen: boolean;
  supplierName: string;
  warnings: SupplierDeleteWarnings;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SupplierDeleteWarningModal({
  isOpen,
  supplierName,
  warnings,
  onClose,
  onConfirm,
}: Props) {
  const [confirmed, setConfirmed] = React.useState(false);

  // Reset checkbox each time the modal opens
  React.useEffect(() => {
    if (isOpen) setConfirmed(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const { productCount } = warnings;
  const hasWarnings = productCount > 0;

  return (
    <ModalShell
      open={isOpen}
      title="Delete Supplier"
      onClose={onClose}
      widthClassName="w-[500px] max-w-[92vw]"
    >
      {/* Supplier info */}
      <p className="text-sm text-gray-700 mb-4">
        You are about to permanently delete supplier{" "}
        <span className="font-semibold text-gray-900">&quot;{supplierName}&quot;</span>.
      </p>

      {/* Warning cards */}
      {hasWarnings && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-semibold text-amber-800">
              This supplier has active linked records
            </p>
          </div>

          {productCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>📦</span>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700"
              >
                {productCount}
              </span>
              <span className="text-gray-700">
                {productCount === 1 ? "Product Variant" : "Product Variants"} linked to this supplier
              </span>
            </div>
          )}

          <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
            Deleting this supplier might affect product inventory records. Consider editing or deactivating the supplier if you wish to retain records.
          </p>
        </div>
      )}

      {/* No warnings case */}
      {!hasWarnings && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            No products are linked to this supplier.
          </p>
        </div>
      )}

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-3 cursor-pointer mb-5 select-none">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-red-500 cursor-pointer shrink-0"
        />
        <span className="text-sm text-gray-700">
          I understand the risks and want to permanently delete this supplier.
        </span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth={true}
          onClick={onClose}
        />
        <ActionButton
          label="Delete"
          variant="primary"
          fullWidth={true}
          disabled={!confirmed}
          onClick={onConfirm}
        />
      </div>
    </ModalShell>
  );
}
