"use client";

import React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";

export interface StaffDeleteWarnings {
  role: "ADMIN" | "MANAGER";
  // Manager-specific
  branchName?: string;
  activeCashierCount?: number;
  orderCount?: number;
  // Admin-specific
  assignedCompanyCount?: number;
  assignedCompanyNames?: string[];
}

type Props = {
  isOpen: boolean;
  staffName: string;
  staffRole: "ADMIN" | "MANAGER";
  warnings: StaffDeleteWarnings;
  onClose: () => void;
  onConfirm: () => void;
};

export default function StaffDeleteWarningModal({
  isOpen,
  staffName,
  staffRole,
  warnings,
  onClose,
  onConfirm,
}: Props) {
  const [confirmed, setConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setConfirmed(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const isManager = staffRole === "MANAGER";

  const hasManagerWarnings =
    isManager &&
    ((warnings.activeCashierCount ?? 0) > 0 || (warnings.orderCount ?? 0) > 0);

  const hasAdminWarnings =
    !isManager && (warnings.assignedCompanyCount ?? 0) > 0;

  const hasWarnings = hasManagerWarnings || hasAdminWarnings;

  return (
    <ModalShell
      open={isOpen}
      title={`Delete ${staffRole === "ADMIN" ? "Admin" : "Manager"}`}
      onClose={onClose}
      widthClassName="w-[500px] max-w-[92vw]"
    >
      {/* Staff info */}
      <p className="text-sm text-gray-700 mb-4">
        You are about to permanently delete{" "}
        <span className="font-semibold text-gray-900">&quot;{staffName}&quot;</span>
        {isManager && warnings.branchName && (
          <>
            {" "}
            — manager of branch{" "}
            <span className="font-semibold text-gray-900">
              {warnings.branchName}
            </span>
          </>
        )}
        .
      </p>

      {/* Warning block */}
      {hasWarnings && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-semibold text-amber-800">
              This {isManager ? "manager" : "admin"} has active linked records
            </p>
          </div>

          {/* Manager warnings */}
          {isManager && (warnings.activeCashierCount ?? 0) > 0 && (
            <WarningRow
              icon="🧾"
              label="Active Cashier"
              count={warnings.activeCashierCount!}
              description="registered in their branch"
              color="orange"
            />
          )}
          {isManager && (warnings.orderCount ?? 0) > 0 && (
            <WarningRow
              icon="📦"
              label="Order Record"
              count={warnings.orderCount!}
              description="linked to their branch"
              color="orange"
            />
          )}

          {/* Admin warnings */}
          {!isManager && (warnings.assignedCompanyCount ?? 0) > 0 && (
            <div className="space-y-1">
              <WarningRow
                icon="🏢"
                label="Assigned Company"
                count={warnings.assignedCompanyCount!}
                description="being managed by this admin"
                color="red"
              />
              {warnings.assignedCompanyNames &&
                warnings.assignedCompanyNames.length > 0 && (
                  <div className="ml-6 flex flex-wrap gap-1.5 mt-1">
                    {warnings.assignedCompanyNames.map((name) => (
                      <span
                        key={name}
                        className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          )}

          <p className="text-xs text-amber-700 pt-1 border-t border-amber-200">
            {isManager
              ? "Deleting this manager may leave their branch without supervision. Consider reassigning cashiers and reviewing orders before proceeding."
              : "Deleting this admin will remove their access to all assigned companies. Ensure another admin is assigned if needed."}
          </p>
        </div>
      )}

      {/* No warnings */}
      {!hasWarnings && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            {isManager
              ? "No active cashiers or orders are linked to this manager's branch."
              : "This admin has no assigned companies."}
          </p>
        </div>
      )}

      {/* Active status badge */}
      {warnings.role && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              warnings.role === "ADMIN"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {warnings.role === "ADMIN" ? "Admin" : "Manager"} — Active
          </span>
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
          I understand the risks and want to permanently delete this{" "}
          {staffRole === "ADMIN" ? "admin" : "manager"} account.
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
          label={`Delete ${staffRole === "ADMIN" ? "Admin" : "Manager"}`}
          variant="primary"
          fullWidth
          disabled={!confirmed}
          onClick={() => {
            if (confirmed) onConfirm();
          }}
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
