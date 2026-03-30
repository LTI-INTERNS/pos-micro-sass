"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import DiscountContent from "@/components/Admin/settings/Discount/DiscountContent";
import PersonalContent from "@/components/Admin/settings/PersonalDetails/PersonalContent";
import SubscriptionPlanCards from "@/components/Admin/settings/subscriptionplan/SubscriptionPlanCards";
import CompanyDetailsForm from "@/components/Admin/settings/Details/CompanyDetailsContent";
import BranchDetailsForm from "@/components/Admin/settings/Details/BranchDetailsContent";
import AdditionalSettingsContent from "@/components/Admin/settings/AdditionalSettings/AdditionalSettingsContent";
import ActionButton from "@/components/Admin/common/ActionButton";

type UserRole = "OWNER" | "ADMIN" | "MANAGER";

type Tab = {
  id: string;
  label: string;
  shortLabel: string;
};

export default function SettingPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("personalDetails");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  // Normalize role from session
  const userRole = session?.user?.role?.toUpperCase() as UserRole;

  const TABS = useMemo(() => {
    if (!userRole) return [];

    const tabs: Tab[] = [
      { id: "personalDetails", label: "Personal Details", shortLabel: "Personal" },
      { id: "discountManagement", label: "Discount Management", shortLabel: "Discount" },
    ];

    // Role-based logic for Company/Branch Details tab
    if (userRole === "OWNER") {
      tabs.push({ id: "companyDetails", label: "Company Details", shortLabel: "Company" });
    } else if (userRole === "MANAGER") {
      tabs.push({ id: "companyDetails", label: "Branch Details", shortLabel: "Branch" });
    }
    // ADMIN sees neither Company nor Branch details

    // Role-based logic for Subscription
    if (userRole === "OWNER") {
      tabs.push({ id: "subscriptionPlan", label: "Subscription Plan", shortLabel: "Sub. Plan" });
    }

    tabs.push({ id: "settings", label: "System Settings", shortLabel: "System" });

    return tabs;
  }, [userRole]);

  if (status === "loading") return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <TabSelector tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "personalDetails" && <PersonalContent userRole={userRole} />}
        
        {activeTab === "discountManagement" && <DiscountContent />}
        
        {activeTab === "subscriptionPlan" && userRole === "OWNER" && (
          <SubscriptionPlanCards defaultPlanId="basic" />
        )}

        {activeTab === "companyDetails" &&
          (userRole === "OWNER" ? (
            <CompanyDetailsForm
              initial={{
                name: "ABC Pvt Ltd",
                regNo: "PV12345",
                email: "abc@gmail.com",
                phone: "+94 77 123 4567",
                address: "No 10, Main Street, Colombo",
                
              }}
              logoUrl={companyLogoUrl}
              onLogoChange={(url) => setCompanyLogoUrl(url)}
              onSave={(data) => console.log("SAVE COMPANY", data)}
            />
          ) : userRole === "MANAGER" ? (
            <BranchDetailsForm
              userRole={userRole}
              initial={{
                name: "Colombo Branch",
                email: "branch@gmail.com",
                phone: "+94 77 987 6543",
                address: "No 15, High Street, Colombo",
                
              }}
              onSave={(data) => console.log("SAVE BRANCH", data)}
            />
          ) : null)}

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