"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import DeletePopup from "../common/Deletepopup";
import SupplierPopUp from "./SupplierPopUp";
import type { Supplier } from "./SupplierTable";
import EditEntityModal, {EditField} from "@/app/components/Admin/common/EditPopup";

type Props = {
  selectedSupplier: Supplier | null;
  onDelete?: () => void;
  onEdit?: (updatedSupplier: Supplier) => void;
};

export default function SupplierActionsBar({ selectedSupplier, onDelete, onEdit }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const editFields: EditField[] = [
  { name: "type", label: "Supplier Type" },
  { name: "name", label: "Supplier Name" },
  { name: "phone", label: "Phone", type: "number" },
  { name: "email", label: "Email" },
  { name: "coverarea", label: "Cover Area" },
  { name: "regNo", label: "Registration No" },
  { name: "branches", label: "Branches" }, 
];

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          label="Delete Supplier"
          onClick={() => {
            if (!selectedSupplier) {
              alert("Please select a supplier first!");
              return;
            }
            setDeletePopupOpen(true);
          }}
        />

        <ActionButton
          label="Edit Supplier"
          onClick={() => {
            if (!selectedSupplier) {
              alert("Please select a supplier first!");
              return;
            }
            setEditPopupOpen(true); 
          }}
        />

        <ActionButton
          label="Add New Supplier"
          variant="primary"
          onClick={() => setShowPopup(true)}
        />
      </div>

      {showPopup && (
        <SupplierPopUp
          open={showPopup}
          onClose={() => setShowPopup(false)}
          supplierId="A001"
          onSave={(vals) => {
            console.log(vals);
            setShowPopup(false);
          }}
        />
      )}

      {selectedSupplier && (
        <DeletePopup
          isOpen={deletePopupOpen}
          onClose={() => setDeletePopupOpen(false)}
          item={selectedSupplier}
          itemName="Supplier"
          getDisplayText={(s) => (
            <>
              <br /><br />
              ID - {s.id}<br />
              Type - {s.type}<br />
              Supplier Name - {s.name}<br />
              Cover Area - {s.coverarea}
            </>
          )}
          onConfirm={() => {
            onDelete?.();
            setDeletePopupOpen(false);
          }}
        />
      )}
      {selectedSupplier && editPopupOpen && (
        <EditEntityModal<Supplier>
          open={editPopupOpen}
          title="Edit Supplier"
          initialValues={selectedSupplier}
          fields={editFields}
          onClose={() => setEditPopupOpen(false)}
          onSave={(updatedSupplier) => {
            onEdit?.(updatedSupplier); // call parent handler
            setEditPopupOpen(false);
          }}
        />
      )}

    </>
  );
}
