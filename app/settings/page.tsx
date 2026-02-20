"use client";

import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import TabSelector from "../components/Admin/common/TabSelector";
import DiscountContent from "@/app/components/Admin/settings/Discount/DiscountContent";
import PersonalContent from "@/app/components/Admin/settings/PersonalDetails/PersonalContent";
import SubscriptionPlanCards from "@/app/components/Admin/settings/subscriptionplan/SubscriptionPlanCards";
import CompanyDetailsForm from "@/app/components/Admin/settings/companydetails/CompanyDetailsContent";

const TABS = [
  { id: "personalDetails", label: "Personal Details" },
  { id: "discountManagement", label: "Discount Managemet" },
  { id: "companuDetails", label: "Company Details" },
  { id: "subscriptionPlan", label: "Subscription Plan" },
];

export default function settingPage() {
  const [activeTab, setActiveTab] = useState<string>("personalDetails");

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        
        <TabSelector
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        
        {activeTab === "personalDetails" && <PersonalContent />}
        {activeTab === "discountManagement" && <DiscountContent />}
        {activeTab === "subscriptionPlan" && (
          <SubscriptionPlanCards
            defaultPlanId="basic"
          />
        )}
        {activeTab === "companuDetails" && 
          <CompanyDetailsForm 
            initial={{
              companyName: "ABC Pvt Ltd",
              regNo: "PV12345",
              email: "abc@gmail.com",
              phone: "+94 77 123 4567",
              addressLine1: "No 10, Main Street",
              addressLine2: "Colombo",
            }}
            onSave={(data) => {
              console.log("SAVE", data);
              // TODO: call API / Supabase update here
            }}
          />
        }
      </div>
    </DashboardLayout>
  );
}
