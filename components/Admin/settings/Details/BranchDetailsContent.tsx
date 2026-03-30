"use client";

import * as React from "react";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import ActionButton from "@/components/Admin/common/ActionButton";

type BranchDetailsProps = {
  userRole?: string;
  initial?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    
  };
  onSave?: (data: any) => Promise<void> | void;
};

export default function BranchDetailsForm({ userRole, initial, onSave }: BranchDetailsProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const normalizedRole = userRole?.toUpperCase();

  // Local state to manage the displayed branch details
  const [details, setDetails] = React.useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    addressLine1: initial?.addressLine1 ?? "",
    addressLine2: initial?.addressLine2 ?? "",
  });

  // Requirement: Manager cannot change branch email
  const isEmailDisabled = normalizedRole === "MANAGER";

  const editFields: EditField[] = [
    { name: "name", label: "Branch Name" },
    { 
      name: "email", 
      label: "Email", 
      readOnly: isEmailDisabled 
    },
    { name: "phone", label: "Phone" },
    { name: "addressLine1", label: "Address Line 1" },
    { name: "addressLine2", label: "Address Line 2" },
  ];

  const handleSave = async (updatedValues: any) => {
    setDetails(updatedValues);
    if (onSave) {
      await onSave(updatedValues);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Branch Details</h2>
        </div>

        {/* 1. Read-Only View (Bold values) */}
        <div className="px-6 py-2">
          <SettingsRow label="Branch Name" value={details.name} />
          <SettingsRow label="Email" value={details.email} />
          <SettingsRow label="Phone" value={details.phone} />
          <SettingsRow label="Address" value={`${details.addressLine1}, ${details.addressLine2}`} />
        </div>

        {/* 2. Edit Button (No Save Changes button here) */}
        <div className="px-6 py-4">
          <ActionButton
            label="Edit Details"
            variant="outline"
            fullWidth={false}
            className="w-[220px]"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </section>

      {/* 3. The Popup Modal */}
      <EditEntityModal
        open={modalOpen}
        title="Edit Branch Details"
        initialValues={details}
        fields={editFields}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

/**
 * Helper component for the read-only rows
 */
function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100 last:border-0">
      <div className="col-span-4 sm:col-span-3 text-sm font-semibold text-gray-900">
        {label}
      </div>
      <div className="col-span-8 sm:col-span-9 text-sm font-bold text-gray-900">
        {value}
      </div>
    </div>
  );
}