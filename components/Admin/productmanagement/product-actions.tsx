"use client";

import ActionButton from "@/components/Admin/common/ActionButton";
import { Product } from "@/lib/services";

type Props = {
  selectedProduct: Product | null;
  onAddStock: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddNew: () => void;
  onAddVariant?: () => void; //  new
  userRole?: "owner" | "admin" | "manager";
};

export default function ProductActionsBar({
  selectedProduct,
  onAddStock,
  onDelete,
  onEdit,
  onAddNew,
  onAddVariant,
  userRole = "admin",
}: Props) {
  const requireSelection = (action?: () => void) => {
    if (!selectedProduct) {
      alert("Please select a product first!");
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

      {/*  Hide delete for manager */}
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

      {/*  Always visible */}
      <ActionButton
        label={isManager ? "Request New Product" : "Add New Product"}
        variant="primary"
        onClick={onAddNew}
      />

      {/*  Only for manager */}
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