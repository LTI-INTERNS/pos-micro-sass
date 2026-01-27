"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";  
import AddBranchForm from "@/app/components/Admin/branchmanagement/AddBranchForm";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BranchActionsBar({ onEdit, onDelete }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="bg-transparent rounded-xl border border-gray-100 px-6 py-3"
>
        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            label="Delete Branch"
            onClick={onDelete}
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
      </div>
      {showPopup && (
        <AddBranchForm
          open={showPopup}
          onClose={() => setShowPopup(false)}
          branchId=""
          onSubmit={() => setShowPopup(false)}
        />
      )}
    
    </>
  );
}
