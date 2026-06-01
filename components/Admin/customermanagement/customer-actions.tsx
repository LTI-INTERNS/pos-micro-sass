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
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX: Accept showToast
};

export default function CustomerActionsBar({
  selectedCustomer,
  onAdd,
  onEdit,
  onDelete,
  showToast,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const [editLoading, setEditLoading]     = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    try {
      const updated = await customerService.update(selectedCustomer.id, {
        name:         formValues.name      || undefined,
        email:        formValues.email     || undefined,
        phoneNumber1: formValues.phone     || undefined,
        promocard:    formValues.promoCard || undefined,
      });
      onEdit?.(updated);
      setEditPopupOpen(false);
      showToast("Customer updated successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Failed to update customer. Please try again.", "error");
      throw err; // THE FIX: Re-throw to ensure EditPopup doesn't wipe data
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    setDeleteLoading(true);
    try {
      await customerService.remove(selectedCustomer.id);
      onDelete?.();
      setDeletePopupOpen(false);
      showToast("Customer deleted successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Failed to delete customer. Please try again.", "error");
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
            showToast("Please select a customer first!", "error"); // Replaced alert
            return;
          }
          setDeletePopupOpen(true);
        }}
      />

      <ActionButton
        label="Edit Customer"
        onClick={() => {
          if (!selectedCustomer) {
            showToast("Please select a customer first!", "error"); // Replaced alert
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
          showToast={showToast}
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
            }}
            item={selectedCustomer}
            itemName="Customer"
            getDisplayText={(c) => (
              <>
                <br /><br />
                ID - {c.id}<br />
                Customer Name - {c.name}<br />
                {deleteLoading && (
                  <span className="block mt-2 text-gray-400 text-sm">Deleting...</span>
                )}
              </>
            )}
            onConfirm={handleConfirmDelete}
          />

          {editPopupOpen && (
            <EditEntityModal<Customer>
              open={editPopupOpen}
              title={editLoading ? "Saving…" : "Edit Customer"}
              initialValues={selectedCustomer}
              fields={editFields}
              onClose={() => {
                setEditPopupOpen(false);
              }}
              onSave={handleSaveEdit}
            />
          )}
        </>
      )}
    </div>
  );
}