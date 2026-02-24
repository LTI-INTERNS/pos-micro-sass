"use client";

import { useState } from "react";
import ActionButton from "@/components/Admin/common/ActionButton";
import AddCustomerForm from "@/components/Admin/customermanagement/AddCustomerForm";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import type { Customer } from "@/components/Admin/customermanagement/customers-table";
import EditEntityModal, {EditField} from "@/components/Admin/common/EditPopup";

type Props = {
  selectedCustomer: Customer | null;
  onAdd?: () => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  selectedCustomer,
  onEdit,
  onDelete
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const editFields: EditField[] = [
  { name: "name", label: "Customer Name", type: "text" },
  { name: "phone", label: "Phone", type: "number" },
  { name: "promoCard", label: "Promo Code", type: "text" },
  { name: "points", label: "Points", type: "number" },
  { name: "email", label: "Email", type: "text" },
  { name: "outstanding", label: "Outstanding", type: "number" },
];

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
        onClick={() => {
          if (!selectedCustomer) {
            alert("Please select a customer first!");
            return;
          }
          setEditPopupOpen(true);
        }}
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

      {selectedCustomer && editPopupOpen && (
      <EditEntityModal<Customer>
        open={editPopupOpen}
        title="Edit Customer"
        initialValues={selectedCustomer}
        fields={editFields}
        onClose={() => setEditPopupOpen(false)}
        onSave={(updatedCustomer) => {
          onEdit?.(updatedCustomer); // Pass updated customer to parent
          setEditPopupOpen(false);
        }}
      />
    )}

    </div>
  );
}
