"use client";

import { useState } from "react";
import AddCustomerForm from "@/app/components/Admin/customermanagement/AddCustomerForm";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onDelete}
            className="w-full rounded-full border border-orange-400 bg-white py-2
                       text-xs font-semibold text-orange-500
                       hover:bg-orange-50 hover:shadow-sm
                       transition"
          >
            Delete Customer
          </button>

          <button
            onClick={onEdit}
            className="w-full rounded-full border border-orange-400 bg-white py-2
                       text-xs font-semibold text-orange-500
                       hover:bg-orange-50 hover:shadow-sm
                       transition"
          >
            Edit Customer
          </button>

          <button
            onClick={() => setShowPopup(true)}
            className="w-full rounded-full bg-orange-500 py-2
                       text-xs font-semibold text-white
                       hover:bg-orange-600
                       transition"
          >
            Add New Customer
          </button>
        </div>
      </div>

      {showPopup && (
        <AddCustomerForm open={showPopup} 
          onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
