"use client";

import ActionButton from "@/components/Admin/common/ActionButton";
import { Product } from "@/lib/services";

type Props = {
  selectedProduct: Product | null;
  onAddStock: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddNew: () => void;
  onAddVariant?: () => void; 
  userRole?: "owner" | "admin" | "manager";
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX
};

export default function ProductActionsBar({
  selectedProduct,
  onAddStock,
  onDelete,
  onEdit,
  onAddNew,
  onAddVariant,
  userRole = "admin",
  showToast,
}: Props) {
  const requireSelection = (action?: () => void) => {
    if (!selectedProduct) {
      showToast("Please select a product first!", "error"); // THE FIX: Use showToast instead of alert
      return;
    }
    action?.();
  };

  const isManager = userRole === "manager";

  return (
    <div className="flex items-center gap-5">
      <ActionButton
        label="Add to Stock"
        onClick={() => requireSelection(onAddStock)}
      />

      {!isManager && (
        <ActionButton
          label="Delete Product"
          onClick={() => requireSelection(onDelete)}
        />
      )}

      <ActionButton
        label="Edit Product"
        onClick={() => requireSelection(onEdit)}
      />

      <ActionButton
        label={isManager ? "Request New Product" : "Add New Product"}
        variant="primary"
        onClick={onAddNew}
      />

      {isManager && (
        <ActionButton
          label="Add from Company Catalog"
          variant="primary"
          onClick={onAddVariant}
        />
      )}
    </div>
  );
}