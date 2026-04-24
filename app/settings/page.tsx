"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

// 1. Add this import at the top
import { branchService, Branch } from "@/lib/services/branch-service";

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

  // 2. Inside your SettingPage component, add this state:
  const [managerBranch, setManagerBranch] = useState<Branch | null>(null);

  const userRole = session?.user?.role?.toLowerCase() || "";

  // Sync the logo from the database context to the local state
  useEffect(() => {
    if (storeInfo?.logoUrl) {
      setCompanyLogoUrl(storeInfo.logoUrl);
    }
  }, [storeInfo]);

  // 3. Fetch the data inside a useEffect
  useEffect(() => {
    if (userRole === "manager") {
      branchService.getMyBranch()
        .then(setManagerBranch)
        .catch(err => console.error("Failed to load manager branch", err));
    }
  }, [userRole]);

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
          // 4. Update the <BranchDetailsForm /> inside the return statement to pass the real data:
          ) : userRole === "manager" ? (
            <BranchDetailsForm
              userRole={userRole}
              initial={{
                id: managerBranch?.id || "",
                name: managerBranch?.name || "",
                city: managerBranch?.city || "",
                email: managerBranch?.email || "",
                phone: managerBranch?.phone || "",
                address: managerBranch?.address || "",
                regNo: managerBranch?.regno || "",
              }}
              onSave={async (data) => {
                const updated = await branchService.update('me', data);
                setManagerBranch(updated);
              }}
            />
          ) : null
        )}

        {activeTab === "settings" && <AdditionalSettingsContent />}
      </div>
    </DashboardLayout>
  );
}