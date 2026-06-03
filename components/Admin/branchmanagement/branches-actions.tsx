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
          onSubmit={async (values) => {
            try {
              await onAdd?.(values); 
              setShowPopup(false); 
            } catch (error) {
              // THE FIX: Re-throw the error so AddBranchForm knows it failed and doesn't wipe the data!
              throw error; 
            }
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
            
            if (!values.name || !values.name.trim()) {
              errors.name = "Name is required";
            }

            if (!values.city || !values.city.trim()) {
              errors.city = "City is required";
            }

            if (
              values.regno && 
              values.regno.trim() !== "" && 
              (!/[a-zA-Z]/.test(values.regno) || !/\d/.test(values.regno))
            ) {
              errors.regno = "Registration Number must contain at least one letter and one number";
            }

            if (values.email) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(values.email.trim())) {
                  errors.email = "Please enter a valid email address";
              }
            } else {
              errors.email = "Email is required";
            }

            if (values.phone) {
              const phoneWithoutSpaces = values.phone.replace(/\s+/g, "");

              const allowedPrefixes = [
                { code: "+94", len: 9 },
                { code: "+1",  len: 10 },
                { code: "+44", len: 10 },
                { code: "+91", len: 10 },
                { code: "+61", len: 9 },
                { code: "+65", len: 8 },
                { code: "+60", len: 10 },
                { code: "0",   len: 9 },
              ];

              const matchedConfig = allowedPrefixes.find(p => phoneWithoutSpaces.startsWith(p.code));

              if (!matchedConfig) {
                errors.phone = "Phone must start with a valid code (+94, +1, +44, +91, +61, +65, +60 or 0)";
              } else {
                const numberPart = phoneWithoutSpaces.slice(matchedConfig.code.length);
                if (!/^\d+$/.test(numberPart) || numberPart.length !== matchedConfig.len) {
                  errors.phone = `For ${matchedConfig.code}, the number must be exactly ${matchedConfig.len} digits long.`;
                }
              }
            } else {
              errors.phone = "Phone number is required";
            }

            if (values.password && values.password.trim() !== "") {
              if (values.password.length < 8) {
                errors.password = "Password must be at least 8 characters";
              } else if (!/[a-zA-Z]/.test(values.password) || !/\d/.test(values.password)) {
                errors.password = "Password must contain at least one letter and one number";
              }
            }

            return errors;
          }}
          onSave={async (updatedBranch) => {
            try {
              await onEdit?.(updatedBranch);
              setEditPopupOpen(false);
            } catch (error) {
              // THE FIX: Re-throw the error here as well for the edit modal
              throw error; 
            }
          }}
        />
      )}
    </>
  );
}