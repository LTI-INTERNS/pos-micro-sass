"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import DeletePopup from "../common/Deletepopup";
import SupplierPopUp from "./SupplierPopUp";
import type { Supplier } from "./SupplierTable";

type Props = {
  selectedSupplier: Supplier | null;
  onDelete?: () => void;
  onEdit?: () => void;
};

export default function SupplierActionsBar({ selectedSupplier, onDelete, onEdit }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

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
            onEdit?.();
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
    </>
  );
}
