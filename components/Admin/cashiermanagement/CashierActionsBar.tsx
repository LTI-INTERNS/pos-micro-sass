"use client";

import ActionButton from "../common/ActionButton";

type Props = {
  onDeactivate?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
};

export default function CashierActionsBar({
  onDeactivate,
  onDelete,
  onEdit,
  onAdd,
  onExport,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
      <ActionButton
        label="Activate / Deactivate Cashier"
        onClick={onDeactivate}
        variant="outline"
      />

      <ActionButton
        label="Delete Cashier"
        onClick={onDelete}
        variant="outline"
      />

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
