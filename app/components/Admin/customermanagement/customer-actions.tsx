"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import AddCustomerForm from "@/app/components/Admin/customermanagement/AddCustomerForm";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  onEdit,
  onDelete,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
      
        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            label="Delete Customer"
            onClick={onDelete}
          />
          <ActionButton
            label="Edit Customer"
            onClick={onEdit}
          />

          <ActionButton
            label="Add New Customer"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />

      {showPopup && (
        <AddCustomerForm open={showPopup} 
          onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}
