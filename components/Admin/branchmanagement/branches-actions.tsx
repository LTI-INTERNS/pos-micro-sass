"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";  
import AddBranchForm from "@/app/components/Admin/branchmanagement/AddBranchForm";
import DeletePopup from "../common/Deletepopup";
import type { Branch } from "./branches-table";
import EditEntityModal, {EditField} from "@/app/components/Admin/common/EditPopup";

type Props = {
  selectedBranch: Branch | null;
  onEdit?: (branch: Branch) => void;
  onDelete?: () => void;
};

export default function BranchActionsBar({ selectedBranch, onEdit, onDelete }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const editFields: EditField[] = [
    { name: "name", label: "Branch Name" },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "regno", label: "Reg No", type: "number" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
  ];

  return (
    <>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            label="Delete Branch"
            onClick={() => {
            if (!selectedBranch) {
              alert("Please select a Branch first!");
              return;
            }
            setDeletePopupOpen(true);
        }}
          />
          <ActionButton
            label="Edit Branch"
            onClick={() => {
              if (!selectedBranch) {
                alert("Please select a branch first!");
                return;
              }
              setEditPopupOpen(true);
            }}
          />

          <ActionButton
            label="Add New Branch"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        </div>
      {showPopup && (
        <AddBranchForm
          open={showPopup}
          onClose={() => setShowPopup(false)}
          branchId=""
          onSubmit={() => setShowPopup(false)}
        />
      )}
      {selectedBranch && (
        <DeletePopup
          isOpen={deletePopupOpen}
          onClose={() => setDeletePopupOpen(false)}
          item={selectedBranch}
          itemName="Branch"
          getDisplayText={(c) => (
            <>
              <br /><br />
              Reg.No - {c.regno}<br />
              Branch Name - {c.name}<br />
              Address - {c.address}
            </>
          )}
          onConfirm={() => {
            onDelete?.();
            setDeletePopupOpen(false);
          }}
        />
      )}
      {selectedBranch && editPopupOpen && (
        <EditEntityModal<Branch>
          open={editPopupOpen}
          title="Edit Branch"
          initialValues={selectedBranch}
          fields={editFields}
          onClose={() => setEditPopupOpen(false)}
          onSave={(updatedBranch) => {
            onEdit?.(updatedBranch); // pass updated branch to parent
            setEditPopupOpen(false);
          }}
        />
      )}
    </>
  );
}
