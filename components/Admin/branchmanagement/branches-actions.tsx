"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; 
import ActionButton from "@/components/Admin/common/ActionButton";
import AddBranchForm from "@/components/Admin/branchmanagement/AddBranchForm";
import { Branch } from "@/lib/services/branch-service";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";

type Props = {
  selectedBranch: Branch | null;
  onAdd?: (values: Record<string, string>) => Promise<void> | void;
  onEdit?: (branch: Branch) => Promise<void> | void;
  onDelete?: () => void;
  deleteLoading?: boolean;
  showToast: (message: string, type: "success" | "error" | "info") => void;
};

export default function BranchActionsBar({ selectedBranch, onAdd, onEdit, onDelete, deleteLoading, showToast }: Props) {
  const { data: session } = useSession(); 
  const [showPopup, setShowPopup] = useState(false);
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
          label={deleteLoading ? "Checking..." : "Delete Branch"}
          disabled={deleteLoading}
          onClick={() => {
            if (!selectedBranch) {
              showToast("Please select a Branch first!", "error");
              return;
            }
            onDelete?.();
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


      {selectedBranch && editPopupOpen && (
        <EditEntityModal<Branch> 
          open={editPopupOpen}
          title="Edit Branch"
          initialValues={selectedBranch}
          fields={editFields}
          onClose={() => setEditPopupOpen(false)}
          validate={(vals) => {
            const errors: Record<string, string> = {};
            const name = (vals.name ?? "").trim();
            const city = (vals.city ?? "").trim();
            const address = (vals.address ?? "").trim();

            if (!name) errors.name = "Name is required";
            else if (!/[a-zA-Z]/.test(name)) errors.name = "Name must contain at least one letter (only numbers not allowed)";
            else if (name.length > 15) errors.name = "Name must be less than or equal to 15 characters";

            if (!city) errors.city = "City is required";
            else if (!/[a-zA-Z]/.test(city)) errors.city = "City must contain at least one letter (only numbers not allowed)";

            const email = (vals.email ?? "").trim();

            if (!address) errors.address = "Address is required";
            else if (!/[a-zA-Z]/.test(address)) errors.address = "Address must contain at least one letter (only numbers not allowed)";

            if (!email) errors.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";
            else if (/[A-Z]/.test(email)) errors.email = "Email must contain lowercase letters only";

            return errors;
          }}
          onSave={async (updatedBranch) => {
            try {
              await onEdit?.(updatedBranch);
              setEditPopupOpen(false);
            } catch {
              // THE FIX: Do NOT throw here. The error was already shown via showToast in page.tsx
              // Swallowing this error keeps the modal open.
            }
          }}
        />
      )}
    </>
  );
}