"use client";

import { useState } from "react";
import AddBranchForm from "@/app/components/Admin/branchmanagement/AddBranchForm";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BranchActionsBar({ onEdit, onDelete }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onDelete}
            className="w-full rounded-full border border-orange-400 bg-white py-2
                       text-xs font-semibold text-orange-500
                       hover:bg-orange-50 hover:shadow-sm transition cursor-pointer"
          >
            Delete Branch
          </button>

          <button
            onClick={onEdit}
            className="w-full rounded-full border border-orange-400 bg-white py-2
                       text-xs font-semibold text-orange-500
                       hover:bg-orange-50 hover:shadow-sm transition cursor-pointer"
          >
            Edit Branch
          </button>

          <button
            onClick={() => setShowPopup(true)}
            className="w-full rounded-full bg-orange-500 py-2
                       text-xs font-semibold text-white
                       hover:bg-orange-600 transition cursor-pointer"
          >
            Add New Branch
          </button>
        </div>

      {showPopup && (
        <AddBranchForm
          open={showPopup}
          onClose={() => setShowPopup(false)}
          branchId="" 
          onSubmit={(values) => {
            console.log("Branch saved:", values);
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
