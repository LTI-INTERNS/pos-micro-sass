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
    // THE FIX: Defined this specifically as a password type so it masks characters
    { name: "password", label: "New Password", type: "password" },
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
        <EditEntityModal<any> // Used <any> here since we are injecting "password" which might not be strictly typed in your Branch interface
          open={editPopupOpen}
          title="Edit Branch"
          initialValues={selectedBranch}
          fields={editFields}
          onClose={() => setEditPopupOpen(false)}
          
          validate={(values) => {
            const errors: Record<string, string> = {};
            
            // Check Registration Number
            if (
              values.regno && 
              values.regno.trim() !== "" && 
              (!/[a-zA-Z]/.test(values.regno) || !/\d/.test(values.regno))
            ) {
              errors.regno = "Registration Number must contain at least one letter and one number";
            }

            // THE FIX: Validate Password ONLY if the user typed something into the box
            if (values.password && values.password.trim() !== "") {
              if (values.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
              } else if (!/[a-zA-Z]/.test(values.password) || !/\d/.test(values.password)) {
                errors.password = "Password must contain at least one letter and one number";
              }
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