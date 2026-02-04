"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";  
import AddBranchForm from "@/app/components/Admin/branchmanagement/AddBranchForm";
import DeletePopup from "../common/Deletepopup";
import type { Branch } from "./branches-table";

type Props = {
  selectedBranch: Branch | null;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BranchActionsBar({ selectedBranch, onEdit, onDelete }: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

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
            onClick={onEdit}
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
    
    </>
  );
}
