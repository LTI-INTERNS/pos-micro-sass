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
  const userRole: UserRole = "superadmin" as UserRole;
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
                addressLine1: "No 10, Main Street",
                addressLine2: "Colombo",
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
            <BranchDetailsForm
              initial={{
                name: "Colombo Branch",
                email: "branch@gmail.com",
                phone: "+94 77 987 6543",
                addressLine1: "No 15, High Street",
                addressLine2: "Colombo",
              }}
              onSave={(data) => {
                console.log("SAVE BRANCH", data);
              }}
            />
          ))}

        {activeTab === "settings" && <AdditionalSettingsContent />}
      </div>
    </DashboardLayout>
  );
}