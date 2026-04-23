"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; 
import ActionButton from "@/components/Admin/common/ActionButton";
import AddBranchForm from "@/components/Admin/branchmanagement/AddBranchForm";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import { Branch } from "@/lib/services/branch-service";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";

type Props = {
  selectedBranch: Branch | null;
  onAdd?: (values: Record<string, string>) => void;
  onEdit?: (branch: Branch) => void;
  onDelete?: () => void;
};

export default function BranchActionsBar({ selectedBranch, onAdd, onEdit, onDelete }: Props) {
  const { data: session } = useSession(); 
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  const userRole = session?.user?.role?.toUpperCase(); 
  const isAdmin = userRole === "ADMIN";
  const isOwner = userRole === "OWNER";

  const editFields: EditField[] = [
    { name: "name", label: "Branch Name" },
    { name: "city", label: "City" },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "regno", label: "Reg No", type: "text" }, 
    { 
      name: "email", 
      label: "Email", 
      readOnly: isAdmin && !isOwner 
    },
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
          onSubmit={(values) => {
            onAdd?.(values); 
            setShowPopup(false);
          }}
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
          
          // THE FIX: Pass our custom validation rules here!
          validate={(values) => {
            const errors: Record<string, string> = {};
            
            // Check if Registration Number contains at least one letter AND one number
            if (
              values.regno && 
              values.regno.trim() !== "" && 
              (!/[a-zA-Z]/.test(values.regno) || !/\d/.test(values.regno))
            ) {
              errors.regno = "Registration Number must contain at least one letter and one number";
            }

            return errors;
          }}

          onSave={(updatedBranch) => {
            onEdit?.(updatedBranch);
            setEditPopupOpen(false);
          }}
        />
      )}
    </>
  );
}