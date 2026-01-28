"use client";

import ActionButton from "@/app/components/Admin/common/ActionButton";
import { useState } from "react";
import AddProductPopup from "@/app/components/Admin/productmanagement/AddProductPopup";

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
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>

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
            onClick={() => setShowPopup(true)}
          />
        </div>
        
      {showPopup && (
        <AddProductPopup 
          open={showPopup} 
          onClose={() => setShowPopup(false)}
          onSave={(values) => {
            // Handle product save logic here
            console.log('Product saved:', values);
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
