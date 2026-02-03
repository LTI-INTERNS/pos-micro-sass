"use client";

import ActionButton from "@/app/components/Admin/common/ActionButton";
import { useState } from "react";
import AddOrderPopup from "@/app/components/Admin/ordermanagement/AddorderPopup";

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
            label="Add to Order"
            onClick={onDeactive}
          />

          <ActionButton
            label="Delete ordert"
            onClick={onDelete}
          />

          <ActionButton
            label="Edit Order"
            onClick={onEdit}
          />

          <ActionButton
            label="Add New Order"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        </div>
        
      {showPopup && (
        <AddOrderPopup 
          open={showPopup} 
          onClose={() => setShowPopup(false)}
          onSave={(values) => {
            // Handle order save logic here
            console.log('Order saved:', values);
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
