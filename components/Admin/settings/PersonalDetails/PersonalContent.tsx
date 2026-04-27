"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import { fetchPersonalDetails, updatePersonalDetails, updatePassword } from "@/lib/services/user-service";

export default function PersonalContent({ userRole }: { userRole: string; userId?: string }) {
  const { data: session } = useSession();
  const token = (session as any)?.user?.backendToken;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [personalDetails, setPersonalDetails] = React.useState({
    name: "",
    email: "",
    phone: "",     
  });

  const [passwords, setPasswords] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const data = await fetchPersonalDetails(token);
        setPersonalDetails({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",     
        });
      } catch (error) {
        console.error("Error fetching personal details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token]);

  const handleSaveDetails = async (values: any) => {
    try {
      const updatedData = await updatePersonalDetails(values, token);
      setPersonalDetails((prev) => ({ ...prev, ...updatedData }));
      setModalOpen(false);
      alert("Details updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update details"); 
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return alert("Please fill in all password fields.");
    }
    if (passwords.newPassword.length < 8) {
      return alert("New password must be at least 8 characters long.");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New password and confirm password do not match.");
    }

    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, token);
      
      alert("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error.message || "Failed to change password");
    }
  };

  const editFields: EditField[] = [
    { name: "name", label: "Name" },
    { 
      name: "email", 
      label: "Email", 
      readOnly: userRole === "admin" || userRole === "manager" 
    },
  ];

  if (userRole !== "owner") {
    // Added type: "tel" to match your Company Details component behavior
    editFields.push({ name: "phone", label: "Phone", type: "tel" });
  }

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading details...</div>;

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
            {userRole !== "owner" && (
              <SettingsRow label="Phone" value={personalDetails.phone || "N/A"} />
            )}
          </div>
          <div className="px-6 py-2">
            <ActionButton label="Edit Details" variant="outline" fullWidth={false} className="w-[220px]" onClick={() => setModalOpen(true)} />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
          <div className="px-6 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
          </div>
          <div className="px-6 flex-1 overflow-auto min-h-0">
            <PasswordRow label="Current Password" placeholder="Enter Current Password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
            <PasswordRow label="New Password" placeholder="Enter New Password (min 8 characters)" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            <PasswordRow label="Confirm Password" placeholder="Enter Confirm Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
          </div>
          <div className="px-6 py-2">
            <ActionButton label="Change Password" variant="outline" fullWidth={false} className="w-[220px]" onClick={handlePasswordChange} />
          </div>
        </section>
      </div>

      <EditEntityModal
        open={modalOpen}
        title="Edit Personal Details"
        initialValues={personalDetails}
        fields={editFields}
        onClose={() => setModalOpen(false)}
        
        validate={(values) => {
          const errors: Record<string, string> = {};
          
          if (!values.name?.trim()) {
            errors.name = "Name is required";
          }

          // Validate Email
          if (values.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(values.email.trim())) {
              errors.email = "Please enter a valid email address";
            }
          } else {
            errors.email = "Email is required";
          }

          // Validate Phone (Only if the user role isn't 'owner')
          if (userRole !== "owner") {
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
          }

          return errors;
        }}
        onSave={handleSaveDetails}
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

function PasswordRow({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100 last:border-0">
      <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-gray-900 mb-3 sm:mb-0">{label}</div>
      <div className="col-span-12 sm:col-span-8">
        <input type="password" placeholder={placeholder} value={value} onChange={onChange} className="w-full rounded-full border border-gray-200 px-6 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-200" />
      </div>
    </div>
  );
}