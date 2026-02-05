"use client";

import ActionButton from "@/app/components/Admin/common/ActionButton";

type Props = {
  selectedProduct: any;
  onAddStock: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddNew: () => void;
};

export default function ProductActionsBar({
  selectedProduct,
  onAddStock,
  onDelete,
  onEdit,
  onAddNew,
}: Props) {
  const requireSelection = (action: () => void) => {
    if (!selectedProduct) {
      alert("Please select a product first!");
      return;
    }
    action();
  };

  return (
    <div className="flex items-center gap-5">
      <ActionButton
        label="Add to Stock"
        onClick={() => requireSelection(onAddStock)}
      />

      <ActionButton
        label="Delete Product"
        onClick={() => requireSelection(onDelete)}
      />

      <ActionButton
        label="Edit Product"
        onClick={() => requireSelection(onEdit)}
      />

      <ActionButton
        label="Add New Product"
        variant="primary"
        onClick={onAddNew}
      />
    </div>
  );
}
