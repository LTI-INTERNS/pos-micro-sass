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
  logoUrl?: string; 
};

type CompanyDetailsProps = {
  initial: Omit<CompanyDetails, "logoUrl">;
  logoUrl?: string | null;
  onSave?: (data: CompanyDetails) => Promise<void> | void;
};

export default function CompanyDetailsContent({ initial, logoUrl, onSave }: CompanyDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [details, setDetails] = useState<CompanyDetails>({
    ...initial,
    logoUrl: logoUrl || "",
  });

  useEffect(() => {
    setDetails({
      ...initial,
      logoUrl: logoUrl || "",
    });
  }, [initial, logoUrl]);

  const editFields: EditField[] = [
    { name: "name", label: "Company Name" },
    { name: "regNo", label: "Registration No" },
    { name: "email", label: "Email", type: "text" },
    // THE FIX: Removed the 'prefix' lock so the user can type the full number including the + code
    { name: "phone", label: "Phone", type: "tel" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "logoUrl", label: "Company Logo", type: "image" },
  ];

  const handleSave = async (updatedValues: CompanyDetails) => {
    try {
      if (onSave) {
        await onSave(updatedValues);
      }
      setDetails(updatedValues);
      setIsModalOpen(false);
      alert("Company details updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update company details.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <section className="bg-white rounded-xl border border-gray-100 flex flex-col p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Company Details</h2>
        
        <div className="space-y-0">
          <SettingsRow label="Company Name" value={details.name} />
          <SettingsRow label="Registration No" value={details.regNo || "N/A"} />
          <SettingsRow label="Email" value={details.email} />
          <SettingsRow label="Phone" value={details.phone} />
          <SettingsRow label="Address" value={details.address} />
          
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
                    unoptimized 
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

      <EditEntityModal
        open={isModalOpen}
        title="Edit Company Details"
        initialValues={details}
        fields={editFields}
        onClose={() => setIsModalOpen(false)}
        
        validate={(values) => {
          const errors: Record<string, string> = {};
          
          if (!values.name?.trim()) errors.name = "Company name is required";
          
          if (values.regNo) {
            if (!/[a-zA-Z]/.test(values.regNo) || !/\d/.test(values.regNo)) {
              errors.regNo = "Registration Number must contain at least one letter and one number";
            }
          } else {
             errors.regNo = "Registration Number is required";
          }

          if (values.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(values.email.trim())) {
                errors.email = "Please enter a valid email address";
            }
          } else {
            errors.email = "Email is required";
          }

          // THE FIX: Dynamic Prefix Validation
          if (values.phone) {
            // Remove any spaces the user might have typed so we can accurately count digits
            const phoneWithoutSpaces = values.phone.replace(/\s+/g, "");

            const allowedPrefixes = [
              { code: "+94", len: 9 },
              { code: "+1",  len: 10 },
              { code: "+44", len: 10 },
              { code: "+91", len: 10 },
              { code: "+61", len: 9 },
              { code: "+65", len: 8 },
              { code: "+60", len: 10 },
              { code: "0",   len: 9 }, // Local format without country code, assuming it should be 9 digits for Sri Lanka
            ];

            // Find which country code the typed number starts with
            const matchedConfig = allowedPrefixes.find(p => phoneWithoutSpaces.startsWith(p.code));

            if (!matchedConfig) {
              errors.phone = "Phone must start with a valid code (+94, +1, +44, +91, +61, +65, +60 or 0)";
            } else {
              // Slice off the country code to isolate the actual phone digits
              const numberPart = phoneWithoutSpaces.slice(matchedConfig.code.length);
              
              // Ensure the remainder is ONLY numbers and exactly the required length
              if (!/^\d+$/.test(numberPart) || numberPart.length !== matchedConfig.len) {
                errors.phone = `For ${matchedConfig.code}, the number must be exactly ${matchedConfig.len} digits long.`;
              }
            }
          } else {
            errors.phone = "Phone number is required";
          }

          if (!values.address?.trim()) errors.address = "Address is required";

          return errors;
        }}
        onSave={handleSave}
      />
    </div>
  );
}

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