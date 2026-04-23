"use client";

import * as React from "react";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import { branchService } from "@/lib/services/branch-service";

type BranchDetailsProps = {
  userRole?: string;
  initial?: {
    id: string;
    name: string;
    city: string;
    email: string;
    phone: string;
    address: string;
    regNo: string;
  };
  onSave?: (data: any) => Promise<void> | void;
};

export default function BranchDetailsForm({ userRole, initial, onSave }: BranchDetailsProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const normalizedRole = userRole?.toLowerCase();

  const [details, setDetails] = React.useState({
    name: "", city: "", email: "", phone: "", address: "", regNo: "",
  });

  // Password State
  const [passwords, setPasswords] = React.useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  // Sync state when real data arrives
  React.useEffect(() => {
    if (initial) {
      setDetails({
        name: initial.name || "",
        city: initial.city || "",
        email: initial.email || "",
        phone: initial.phone || "",
        address: initial.address || "",
        regNo: initial.regNo || "",
      });
    }
  }, [initial]);

  const isEmailDisabled = normalizedRole === "manager";

  const editFields: EditField[] = [
    { name: "name", label: "Branch Name" },
    { name: "city", label: "City" },
    { name: "email", label: "Email", readOnly: isEmailDisabled },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address" },
    { name: "regNo", label: "Registration No." },
  ];

  const handleSave = async (updatedValues: any) => {
    try {
      if (onSave) await onSave(updatedValues);
      setDetails(updatedValues);
      setModalOpen(false);
      alert("Branch details updated successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update branch details.");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword) return alert("Current password is required");
    if (!passwords.newPassword) return alert("New password is required");
    if (passwords.newPassword.length < 8) return alert("New password must be at least 8 characters");
    if (passwords.newPassword !== passwords.confirmPassword) return alert("New passwords do not match");

    try {
      await branchService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
        
        {/* TOP SECTION: Branch Details */}
        <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Branch Details</h2>
          </div>

          <div className="px-6 flex-1 overflow-auto min-h-0">
            <SettingsRow label="Branch Name" value={details.name} />
            <SettingsRow label="City" value={details.city} />
            <SettingsRow label="Email" value={details.email} />
            <SettingsRow label="Phone" value={details.phone} />
            <SettingsRow label="Address" value={details.address} />
            <SettingsRow label="Registration No." value={details.regNo} />
          </div>

          <div className="px-6 py-2">
            <ActionButton
              label="Edit Details"
              variant="outline"
              fullWidth={false}
              className="w-[220px]"
              onClick={() => setModalOpen(true)}
            />
          </div>
        </section>

        {/* BOTTOM SECTION: Change Password */}
        <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
          <div className="px-6 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
          </div>
          
          <div className="px-6 flex-1 overflow-auto min-h-0">
            <PasswordRow 
              label="Current Password" 
              placeholder="Enter Current Password" 
              value={passwords.currentPassword}
              onChange={(v) => setPasswords(p => ({ ...p, currentPassword: v }))}
            />
            <PasswordRow 
              label="New Password" 
              placeholder="Enter New Password" 
              value={passwords.newPassword}
              onChange={(v) => setPasswords(p => ({ ...p, newPassword: v }))}
            />
            <PasswordRow 
              label="Confirm Password" 
              placeholder="Enter Confirm Password" 
              value={passwords.confirmPassword}
              onChange={(v) => setPasswords(p => ({ ...p, confirmPassword: v }))}
            />
          </div>
          
          <div className="px-6 py-2">
            <ActionButton
              label="Change Password"
              variant="outline"
              fullWidth={false}
              className="w-[220px]"
              onClick={handlePasswordChange}
            />
          </div>
        </section>
      </div>

      <EditEntityModal
        open={modalOpen}
        title="Edit Branch Details"
        initialValues={details}
        fields={editFields}
        onClose={() => setModalOpen(false)}
        validate={(values: any) => {
          const errors: Record<string, string> = {};
          if (
            values.regNo && 
            values.regNo.trim() !== "" && 
            (!/[a-zA-Z]/.test(values.regNo) || !/\d/.test(values.regNo))
          ) {
            errors.regNo = "Registration Number must contain at least one letter and one number";
          }
          return errors;
        }}
        onSave={handleSave}
      />
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-3 border-b border-gray-100 last:border-0">
      <div className="col-span-4 text-sm font-semibold text-gray-900">{label}</div>
      <div className="col-span-8 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function PasswordRow({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100 last:border-0">
      <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-gray-900 mb-3 sm:mb-0">
        {label}
      </div>
      <div className="col-span-12 sm:col-span-8">
        <input
          type="password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-full border border-gray-200 px-6 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </div>
  );
}