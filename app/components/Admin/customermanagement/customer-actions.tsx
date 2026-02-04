"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import AddCustomerForm from "@/app/components/Admin/customermanagement/AddCustomerForm";
import DeletePopup from "../common/Deletepopup";
import type { Customer } from "./customers-table";

type Props = {
  selectedCustomer: Customer | null;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  selectedCustomer,
  onEdit,
  onDelete
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-3">
      <ActionButton
        label="Delete Customer"
        onClick={() => {
          if (!selectedCustomer) {
            alert("Please select a customer first!");
            return;
          }
          setDeletePopupOpen(true);
        }}
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
        <AddCustomerForm
          open={showPopup}
          onClose={() => setShowPopup(false)}
        />
      )}

      {selectedCustomer && (
        <DeletePopup
          isOpen={deletePopupOpen}
          onClose={() => setDeletePopupOpen(false)}
          item={selectedCustomer}
          itemName="Customer"
          getDisplayText={(c) => (
            <>
              <br /><br />
              ID - {c.id}<br />
              Customer Name - {c.name}<br />
            </>
          )}
          onConfirm={() => {
            onDelete?.();
            setDeletePopupOpen(false);
          }}
        />
      )}
    </div>
  );
}
