"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import DiscountContent from "@/components/Admin/settings/Discount/DiscountContent";
import PersonalContent from "@/components/Admin/settings/PersonalDetails/PersonalContent";
import SubscriptionPlanCards from "@/components/Admin/settings/subscriptionplan/SubscriptionPlanCards";
import CompanyDetailsForm from "@/components/Admin/settings/Details/CompanyDetailsContent";
import BranchDetailsForm from "@/components/Admin/settings/Details/BranchDetailsContent";
import AdditionalSettingsContent from "@/components/Admin/settings/AdditionalSettings/AdditionalSettingsContent";
import ActionButton from "@/components/Admin/common/ActionButton";

type UserRole = "superadmin" | "admin" | "manager";

type Tab = {
  id: string;
  label: string;
  shortLabel: string;
  roles?: UserRole[]; // Optional roles property
};

const getTabs = (userRole: UserRole): Tab[] => {
  const allTabs: Tab[] = [
    { id: "personalDetails", label: "Personal Details", shortLabel: "Personal" },
    { id: "discountManagement", label: "Discount Management", shortLabel: "Discount" },
    {
      id: "companyDetails",
      label: userRole === "superadmin" ? "Company Details" : "Branch Details",
      shortLabel: userRole === "superadmin" ? "Company" : "Branch",
    },
    { 
      id: "subscriptionPlan", 
      label: "Subscription Plan", 
      shortLabel: "Sub. Plan",
      roles: ["superadmin"] // Only visible to superadmin
    },
    { id: "settings", label: "System Settings", shortLabel: "System" },
  ];

  // Filter tabs based on user role
  return allTabs.filter(tab => {
    // If no roles specified, show to everyone
    if (!tab.roles) return true;
    // Otherwise check if user role is in allowed roles
    return tab.roles.includes(userRole);
  });
};

export default function SettingPage() {
  const userRole: UserRole = "manager" as UserRole;
  const TABS = getTabs(userRole);
  const [activeTab, setActiveTab] = useState<string>("personalDetails");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <TabSelector tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "personalDetails" && <PersonalContent />}
        {activeTab === "discountManagement" && <DiscountContent />}
        
        {/* Only render subscription plan for superadmin */}
        {activeTab === "subscriptionPlan" && userRole === "superadmin" && (
          <SubscriptionPlanCards defaultPlanId="basic" />
        )}

        {activeTab === "companyDetails" &&
          (userRole === "superadmin" ? (
            <CompanyDetailsForm
              initial={{
                name: "ABC Pvt Ltd",
                regNo: "PV12345",
                email: "abc@gmail.com",
                phone: "+94 77 123 4567",
                address: "No 10, Main Street, Colombo",
                
              }}
              logoUrl={companyLogoUrl}
              onLogoChange={(url, file) => {
                console.log("Logo changed:", url, file);
                setCompanyLogoUrl(url);
              }}
              onSave={(data) => {
                console.log("SAVE COMPANY", data);
              }}
            />
          ) : (
            <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
            <BranchDetailsForm
              initial={{
                name: "Colombo Branch",
                email: "branch@gmail.com",
                phone: "+94 77 987 6543",
                address: "No 15, High Street, Colombo",
                
              }}
              onSave={(data) => {
                console.log("SAVE BRANCH", data);
              }}
            />
            <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
                      <div className="px-6 py-3">
                        <h2 className="text-md font-semibold text-gray-900">
                          Change Password
                        </h2>
                      </div>
            
                      <div className="px-6 flex-1 overflow-auto min-h-0">
                        <PasswordRow label="Current Password" placeholder="Enter Current Password" />
                        <PasswordRow label="New Password" placeholder="Enter New Password" />
                        <PasswordRow label="Confirm Password" placeholder="Enter Confirm Password" />
                      </div>
            
                      <div className="px-6 py-2">
                        <div className="flex justify-left">
                          <ActionButton
                            label="Change Password"
                            variant="outline"
                            fullWidth={false}
                            className="w-55"
                            onClick={() => alert("Change Password")}
                          />
                        </div>
                      </div>
                    </section>
           </div>        
          ))}

        {activeTab === "settings" && <AdditionalSettingsContent />}
      </div>
    </DashboardLayout>
  );
}


function PasswordRow({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100">
      <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-gray-900 mb-3 sm:mb-0">
        {label}
      </div>

      <div className="col-span-12 sm:col-span-8">
        <input
          type="password"
          placeholder={placeholder}
          className="w-full rounded-full border border-gray-200 px-6 py-2.5
                     text-sm text-gray-700 placeholder:text-gray-400
                     outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </div>
  );
}