"use client";

import React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";

export interface BranchDeleteWarnings {
  activeManagerCount: number;
  activeCashierCount: number;
  orderCount: number;
}

type Props = {
  isOpen: boolean;
  branchName: string;
  warnings: BranchDeleteWarnings;
  onClose: () => void;
  onConfirm: () => void;
};

export default function BranchDeleteWarningModal({
  isOpen,
  branchName,
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

  const { activeManagerCount, activeCashierCount, orderCount } = warnings;
  const hasWarnings =
    activeManagerCount > 0 || activeCashierCount > 0 || orderCount > 0;

  return (
    <ModalShell
      open={isOpen}
      title="Delete Branch"
      onClose={onClose}
      widthClassName="w-[500px] max-w-[92vw]"
    >
      {/* Branch info */}
      <p className="text-sm text-gray-700 mb-4">
        You are about to permanently delete branch{" "}
        <span className="font-semibold text-gray-900">"{branchName}"</span>.
      </p>

      {/* Warning cards */}
      {hasWarnings && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-semibold text-amber-800">
              This branch has active linked records
            </p>
          </div>

          {activeManagerCount > 0 && (
            <WarningRow
              icon="👤"
              label="Active Manager"
              count={activeManagerCount}
              description="assigned to this branch"
              color="red"
            />
          )}
          {activeCashierCount > 0 && (
            <WarningRow
              icon="🧾"
              label="Active Cashier"
              count={activeCashierCount}
              description="registered in this branch"
              color="orange"
            />
          )}
          {orderCount > 0 && (
            <WarningRow
              icon="📦"
              label="Order Record"
              count={orderCount}
              description="linked to this branch"
              color="orange"
            />
          )}

          <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
            Deleting this branch may affect all linked staff, cashiers, and order history.
            Reassign or remove them before deleting if possible.
          </p>
        </div>
      )}

      {/* No warnings case */}
      {!hasWarnings && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            No active managers, cashiers, or orders are linked to this branch.
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
          I understand the risks and want to permanently delete this branch and
          all its linked data.
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
          label="Delete Branch"
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

// ── Internal helper ────────────────────────────────────────────────────────────

function WarningRow({
  icon,
  label,
  count,
  description,
  color,
}: {
  icon: string;
  label: string;
  count: number;
  description: string;
  color: "red" | "orange";
}) {
  const pill =
    color === "red"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>{icon}</span>
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${pill}`}
      >
        {count}
      </span>
      <span className="text-gray-700">
        {count === 1 ? label : `${label}s`} {description}
      </span>
    </div>
  );
}
