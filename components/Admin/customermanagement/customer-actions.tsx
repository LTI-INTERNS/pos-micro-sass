"use client";

import { useState } from "react";
import ActionButton from "@/components/Admin/common/ActionButton";
import AddCustomerForm from "@/components/Admin/customermanagement/AddCustomerForm";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import { Customer } from "@/lib/services";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import { customerService } from "@/lib/services/customer-service";

type Props = {
  selectedCustomer: Customer | null;
  onAdd?:    (customer: Customer) => void;
  onEdit?:   (customer: Customer) => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  selectedCustomer,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const [editLoading, setEditLoading]     = useState(false);
  const [editError, setEditError]         = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]     = useState("");

  const editFields: EditField[] = [
    { name: "name",      label: "Customer Name", type: "text"   },
    { name: "phone",     label: "Phone",         type: "number" },
    { name: "promoCard", label: "Promo Code",    type: "text"   },
    { name: "points",    label: "Points",        type: "number", readOnly: true },
    { name: "email",     label: "Email",         type: "text"   },
  ];

  const handleSaveEdit = async (formValues: Customer) => {
    if (!selectedCustomer) return;
    setEditLoading(true);
    setEditError("");
    try {
      const updated = await customerService.update(selectedCustomer.id, {
        name:         formValues.name      || undefined,
        email:        formValues.email     || undefined,
        phoneNumber1: formValues.phone     || undefined,
        promocard:    formValues.promoCard || undefined,
      });
      onEdit?.(updated);
      setEditPopupOpen(false);
    } catch {
      setEditError("Failed to update customer. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await customerService.remove(selectedCustomer.id);
      onDelete?.();
      setDeletePopupOpen(false);
    } catch {
      setDeleteError("Failed to delete customer. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <ActionButton
        label="Delete Customer"
        onClick={() => {
          if (!selectedCustomer) {
            alert("Please select a customer first!");
            return;
          }
          setDeleteError("");
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
          setEditError("");
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
          onAdded={(newCustomer) => {
            onAdd?.(newCustomer);
            setShowPopup(false);
          }}
        />
      )}

      {selectedCustomer && (
        <>
          <DeletePopup
            isOpen={deletePopupOpen}
            onClose={() => {
              setDeletePopupOpen(false);
              setDeleteError("");
            }}
            item={selectedCustomer}
            itemName="Customer"
            getDisplayText={(c) => (
              <>
                <br /><br />
                ID - {c.id}<br />
                Customer Name - {c.name}<br />
                {deleteError && (
                  <span className="block mt-2 text-red-500 text-sm">{deleteError}</span>
                )}
                {deleteLoading && (
                  <span className="block mt-2 text-gray-400 text-sm">Deleting...</span>
                )}
              </>
            )}
            onConfirm={handleConfirmDelete}
          />

          {editPopupOpen && (
            <>
              {editError && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700 shadow-md">
                  {editError}
                </div>
              )}
              <EditEntityModal<Customer>
                open={editPopupOpen}
                title={editLoading ? "Saving…" : "Edit Customer"}
                initialValues={selectedCustomer}
                fields={editFields}
                onClose={() => {
                  setEditPopupOpen(false);
                  setEditError("");
                }}
                onSave={handleSaveEdit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}