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
  onAdd?: (values: Record<string, string>) => Promise<void> | void;
  onEdit?: (branch: Branch) => Promise<void> | void;
  onDelete?: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX: Added prop
};

export default function BranchActionsBar({ selectedBranch, onAdd, onEdit, onDelete, showToast }: Props) {
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
    { name: "phone", label: "Phone", type: "tel" },
    { name: "address", label: "Address" },
    { name: "regno", label: "Reg No", type: "text" }, 
    { 
      name: "email", 
      label: "Email", 
      type: "text", 
      readOnly: isAdmin && !isOwner 
    },
    { name: "password", label: "New Password", type: "password" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          label="Delete Branch"
          onClick={() => {
            if (!selectedBranch) {
              showToast("Please select a Branch first!", "error"); // THE FIX: Use showToast
              return;
            }
            setDeletePopupOpen(true);
          }}
        />
        <ActionButton
          label="Edit Branch"
          onClick={() => {
            if (!selectedBranch) {
              showToast("Please select a Branch first!", "error"); // THE FIX: Use showToast
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
          onSubmit={async (values) => {
            // No need to try/catch here, handle it in onAdd logic
            await onAdd?.(values); 
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
        <EditEntityModal<any> 
          open={editPopupOpen}
          title="Edit Branch"
          initialValues={selectedBranch}
          fields={editFields}
          onClose={() => setEditPopupOpen(false)}
          validate={(values) => {
            const errors: Record<string, string> = {};
            // ... (your existing validation logic)
            return errors;
          }}
          onSave={async (updatedBranch) => {
            try {
              await onEdit?.(updatedBranch);
              setEditPopupOpen(false);
            } catch (error) {
              // THE FIX: Do NOT throw here. The error was already shown via showToast in page.tsx
              // Swallowing this error keeps the modal open.
            }
          }}
        />
      )}
    </>
  );
}