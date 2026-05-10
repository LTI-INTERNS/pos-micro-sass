"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

import { branchService, Branch } from "@/lib/services/branch-service";
import { companyService, CompanyDetails } from "@/lib/services/company-service";

// Contents
import DiscountContent from "@/components/Admin/settings/Discount/DiscountContent";
import PersonalContent from "@/components/Admin/settings/PersonalDetails/PersonalContent";
import SubscriptionPlanCards from "@/components/Admin/settings/subscriptionplan/SubscriptionPlanCards";
import CompanyDetailsContent from "@/components/Admin/settings/Details/CompanyDetailsContent";
import BranchDetailsForm from "@/components/Admin/settings/Details/BranchDetailsContent";
import AdditionalSettingsContent from "@/components/Admin/settings/AdditionalSettings/AdditionalSettingsContent";
import LoadingState from "@/components/Admin/common/LoadingState";

export default function SettingPage() {
  const { data: session, status } = useSession();
  const { storeInfo } = useStoreInfo(); 
  
  const [activeTab, setActiveTab] = useState<string>("personalDetails");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  const [managerBranch, setManagerBranch] = useState<Branch | null>(null);
  const [ownerCompany, setOwnerCompany] = useState<CompanyDetails | null>(null);

  const userRole = session?.user?.role?.toLowerCase() || "";

  useEffect(() => {
    if (storeInfo?.logoUrl) {
      setCompanyLogoUrl(storeInfo.logoUrl);
    }
  }, [storeInfo]);

  useEffect(() => {
    if (userRole === "manager") {
      branchService.getMyBranch()
        .then(setManagerBranch)
        .catch(err => console.error("Failed to load manager branch", err));
    } else if (userRole === "owner" || userRole === "admin" || userRole === "superadmin") {
      companyService.getMyCompany()
        .then(setOwnerCompany)
        .catch(err => console.error("Failed to load company", err));
    }
  }, [userRole]);

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

  if (status === "loading") return <DashboardLayout><LoadingState message="Loading session..." /></DashboardLayout>;

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
          (userRole === "owner" || userRole === "superadmin" || userRole === "admin") ? (
            <CompanyDetailsContent
              initial={{
                name: ownerCompany?.name || "",
                regNo: ownerCompany?.regNo || "",
                email: ownerCompany?.email || "",
                phone: ownerCompany?.phone || "",
                address: ownerCompany?.address || "",
              }}
              logoUrl={companyLogoUrl}
              onSave={async (data) => {
                try {
                  const updated = await companyService.updateMyCompany(data);
                  setOwnerCompany(updated);
                } catch (err: any) {
                  throw new Error(err.response?.data?.message || err.message || "Failed to update company");
                }
              }}
            />
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
                try {
                  // THE FIX: Correctly map 'regNo' to 'registrationNumber' so the backend receives it!
                  const payload = {
                    name: data.name,
                    city: data.city,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    registrationNumber: data.regNo,
                  };
                  const updated = await branchService.update('me', payload);
                  setManagerBranch(updated);
                } catch (err: any) {
                  // Standardize the error string so it triggers a clean alert
                  throw new Error(err.response?.data?.message || err.message || "Failed to update branch");
                }
              }}
            />
          ) : null
        )}

        {activeTab === "settings" && <AdditionalSettingsContent />}
      </div>
    </DashboardLayout>
  );
}