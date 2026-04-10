"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

// Contents
import DiscountContent from "@/components/Admin/settings/Discount/DiscountContent";
import PersonalContent from "@/components/Admin/settings/PersonalDetails/PersonalContent";
import SubscriptionPlanCards from "@/components/Admin/settings/subscriptionplan/SubscriptionPlanCards";
import CompanyDetailsContent from "@/components/Admin/settings/Details/CompanyDetailsContent";
import BranchDetailsForm from "@/components/Admin/settings/Details/BranchDetailsContent";
import AdditionalSettingsContent from "@/components/Admin/settings/AdditionalSettings/AdditionalSettingsContent";

export default function SettingPage() {
  const { data: session, status } = useSession();
  const { storeInfo } = useStoreInfo(); // Get data from your database context
  
  const [activeTab, setActiveTab] = useState<string>("personalDetails");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  const userRole = session?.user?.role?.toLowerCase() || "";

  // Sync the logo from the database context to the local state
  useEffect(() => {
    if (storeInfo?.logoUrl) {
      setCompanyLogoUrl(storeInfo.logoUrl);
    }
  }, [storeInfo]);

  // Define TABS
  const TABS = useMemo(() => {
    const tabs = [
      { id: "personalDetails", label: "Personal Details", shortLabel: "Personal" },
      { id: "discountManagement", label: "Discount Management", shortLabel: "Discount" },
    ];

    if (userRole === "owner" || userRole === "superadmin") {
      tabs.push({ id: "companyDetails", label: "Company Details", shortLabel: "Company" });
      tabs.push({ id: "subscriptionPlan", label: "Subscription Plan", shortLabel: "Sub. Plan" });
    } else if (userRole === "manager") {
      tabs.push({ id: "companyDetails", label: "Branch Details", shortLabel: "Branch" });
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
        
        {activeTab === "subscriptionPlan" && (userRole === "owner" || userRole === "superadmin") && (
          <SubscriptionPlanCards /> 
        )}

        {activeTab === "companyDetails" && (
          (userRole === "owner" || userRole === "superadmin") ? (
            <CompanyDetailsContent
              initial={{
                name: storeInfo?.storeName || "ABC Pvt Ltd",
                regNo: "PV12345",
                email: "abc@gmail.com",
                phone: "+94 77 123 4567",
                address: "No 10, Main Street, Colombo",
              }}
              logoUrl={companyLogoUrl}
              onSave={(data) => console.log("SAVE COMPANY", data)}
            />
          ) : userRole === "manager" ? (
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
          ) : null
        )}

        {activeTab === "settings" && <AdditionalSettingsContent />}
      </div>
    </DashboardLayout>
  );
}