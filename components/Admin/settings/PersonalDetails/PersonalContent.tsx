"use client";

import * as React from "react";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function PersonalContent({ userRole }: { userRole: string }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [personalDetails, setPersonalDetails] = React.useState({
    name: "Nirmala Azalea",
    email: "abc@gmail.com",
    address: "No: 02, Kandy",
    phone: "071234567",
  });

  const editFields: EditField[] = [
    { name: "name", label: "Name" },
    { 
      name: "email", 
      label: "Email", 
      readOnly: userRole === "admin" || userRole === "manager" 
    },
    { name: "address", label: "Address" },
    { name: "phone", label: "Phone" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
        <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Personal Details</h2>
          </div>
          <div className="px-6 flex-1 overflow-auto min-h-0">
            <SettingsRow label="Name" value={personalDetails.name} />
            <SettingsRow label="Email" value={personalDetails.email} />
            <SettingsRow label="Address" value={personalDetails.address} />
            <SettingsRow label="Phone" value={personalDetails.phone} />
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

        {/* Change Password block */}
        <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
          <div className="px-6 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
          </div>
          <div className="px-6 flex-1 overflow-auto min-h-0">
            <PasswordRow label="Current Password" placeholder="Enter Current Password" />
            <PasswordRow label="New Password" placeholder="Enter New Password" />
            <PasswordRow label="Confirm Password" placeholder="Enter Confirm Password" />
          </div>
          <div className="px-6 py-2">
            <ActionButton label="Change Password" variant="outline" fullWidth={false} className="w-[220px]" onClick={() => alert("Change Password")} />
          </div>
        </section>
      </div>

      <EditEntityModal
        open={modalOpen}
        title="Edit Personal Details"
        initialValues={personalDetails}
        fields={editFields}
        onClose={() => setModalOpen(false)}
        onSave={(values) => {
          setPersonalDetails(values);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-3 border-b border-gray-100">
      <div className="col-span-4 text-sm font-semibold text-gray-900">{label}</div>
      <div className="col-span-8 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function PasswordRow({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100 last:border-0">
      <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-gray-900 mb-3 sm:mb-0">
        {label}
      </div>
      <div className="col-span-12 sm:col-span-8">
        <input
          type="password"
          placeholder={placeholder}
          className="w-full rounded-full border border-gray-200 px-6 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </div>
  );;
}