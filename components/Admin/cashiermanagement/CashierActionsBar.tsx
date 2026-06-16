"use client";

import ActionButton from "@/components/Admin/common/ActionButton";

type Props = {
  role?: string;
  onDeactivate?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX
};

export default function CashierActionsBar({
  role,
  onDeactivate,
  onDelete,
  onEdit,
  onAdd,
  onExport,
  showToast,
}: Props) {
  const canDelete = role === "OWNER" || role === "ADMIN";

  return (
    <div className={`grid grid-cols-1 gap-3 ${canDelete ? "sm:grid-cols-5" : "sm:grid-cols-4"}`}>
      <ActionButton
        label="Activate / Deactivate Cashier"
        onClick={onDeactivate}
        variant="outline"
      />

      {canDelete && (
        <ActionButton
          label="Delete Cashier"
          onClick={onDelete}
          variant="outline"
        />
      )}

      <ActionButton
        label="Edit Cashier"
        onClick={onEdit}
        variant="outline"
      />

      <ActionButton
        label="Add New Cashier"
        onClick={onAdd}
        variant="primary"
      />

      <ActionButton
        label="Export CSV"
        onClick={onExport}
        variant="primary"
      />
    </div>
  );
}