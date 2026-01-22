"use client";

import ActionButton from "@/app/components/Dashboard/common/ActionButton";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeactive?: () => void;
  onExport?: () => void;
};

export default function CashierActionsBar({
  onAdd,
  onEdit,
  onDelete,
  onDeactive,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
      <div className="flex items-center gap-5">
        <ActionButton
          label="Add to Stock"
          onClick={onDeactive}
        />

        <ActionButton
          label="Delete Product"
          onClick={onDelete}
        />

        <ActionButton
          label="Edit Product"
          onClick={onEdit}
        />

        <ActionButton
          label="Add New Product"
          variant="primary"
          onClick={onAdd}
        />
      </div>
    </div>
  );
}
