"use client";

import React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";

export interface CashierDeleteWarnings {
  orderCount: number;
}

type Props = {
  isOpen: boolean;
  cashierName: string;
  warnings: CashierDeleteWarnings;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CashierDeleteWarningModal({
  isOpen,
  cashierName,
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

  const { orderCount } = warnings;
  const hasWarnings = orderCount > 0;

  return (
    <ModalShell
      open={isOpen}
      title="Delete Cashier"
      onClose={onClose}
      widthClassName="w-[500px] max-w-[92vw]"
    >
      {/* Cashier info */}
      <p className="text-sm text-gray-700 mb-4">
        You are about to permanently delete cashier{" "}
        <span className="font-semibold text-gray-900">"{cashierName}"</span>.
      </p>

      {/* Warning cards */}
      {hasWarnings && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-semibold text-amber-800">
              This cashier has active linked records
            </p>
          </div>

          {orderCount > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span>📦</span>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700"
              >
                {orderCount}
              </span>
              <span className="text-gray-700">
                {orderCount === 1 ? "Order Record" : "Order Records"} linked to this cashier
              </span>
            </div>
          )}

          <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
            Deleting this cashier will affect order history statistics. Consider deactivating the cashier instead of deletion if you wish to retain reports.
          </p>
        </div>
      )}

      {/* No warnings case */}
      {!hasWarnings && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            No orders are linked to this cashier.
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
          I understand the risks and want to permanently delete this cashier and all its linked data.
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-3">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth
          onClick={onClose}
        />
        <ActionButton
          label="Delete Cashier"
          variant="primary"
          fullWidth
          onClick={() => {
            if (confirmed) onConfirm();
          }}
          disabled={!confirmed}
        />
      </div>
    </ModalShell>
  );
}
