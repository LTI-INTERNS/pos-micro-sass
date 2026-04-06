"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ActionButton from "@/components/Admin/common/ActionButton";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";

type CompanyDetails = {
  name: string;
  regNo?: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string; // The modal uses this field name for the image upload
};

type CompanyDetailsProps = {
  initial: Omit<CompanyDetails, "logoUrl">;
  logoUrl?: string | null;
  onSave?: (data: CompanyDetails) => Promise<void> | void;
};

export default function CompanyDetailsContent({ initial, logoUrl, onSave }: CompanyDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. Initialize local state
  const [details, setDetails] = useState<CompanyDetails>({
    ...initial,
    logoUrl: logoUrl || "",
  });

  // 2. SYNC EFFECT: Updates the view automatically when database data arrives
  useEffect(() => {
    setDetails({
      ...initial,
      logoUrl: logoUrl || "",
    });
  }, [initial, logoUrl]);

  // 3. Define fields for the generic EditEntityModal
  const editFields: EditField[] = [
    { name: "name", label: "Company Name" },
    { name: "regNo", label: "Registration No" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "logoUrl", label: "Company Logo", type: "image" },
  ];

  const handleSave = async (updatedValues: CompanyDetails) => {
    if (onSave) {
      await onSave(updatedValues);
    }
    setDetails(updatedValues);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="bg-white rounded-xl border border-gray-100 flex flex-col p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Company Details</h2>
        
        {/* Requirement 1: Gray-900 Bold Text Display (Read-Only) */}
        <div className="space-y-0">
          <SettingsRow label="Company Name" value={details.name} />
          <SettingsRow label="Registration No" value={details.regNo || "N/A"} />
          <SettingsRow label="Email" value={details.email} />
          <SettingsRow label="Phone" value={details.phone} />
          <SettingsRow label="Address" value={details.address} />
          
          {/* Requirement 2: Display current logo from database */}
          <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100">
            <div className="col-span-4 text-sm font-semibold text-gray-900">Company Logo</div>
            <div className="col-span-8">
              {details.logoUrl ? (
                <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                  <Image 
                    src={details.logoUrl} 
                    alt="Company Logo" 
                    fill 
                    className="object-contain p-1"
                    unoptimized // Helps render base64 or external S3 URLs without strict config
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 border border-dashed border-gray-200">
                  No Logo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Requirement 3: Only "Edit Details" button is visible here */}
        <div className="pt-6">
          <ActionButton
            label="Edit Details"
            variant="outline"
            fullWidth={false}
            className="w-[220px]"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </section>

      {/* Requirements 4, 5 & 6: Generic Modal for Editing */}
      <EditEntityModal
        open={isModalOpen}
        title="Edit Company Details"
        initialValues={details}
        fields={editFields}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

/**
 * Helper component for Requirement 1 
 * Renders label and value in Gray-900 Bold
 */
function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100">
      <div className="col-span-4 text-sm font-semibold text-gray-900">
        {label}
      </div>
      <div className="col-span-8 text-sm font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}