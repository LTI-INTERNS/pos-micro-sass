"use client";

import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import TabSelector from "../components/Admin/common/TabSelector";
import ProductAnalysisContent from "@/app/components/Admin/aiprediction/Product/ProductAnalysisContent";
import SalesAnalysisContent from "@/app/components/Admin/aiprediction/Sales/SalesAnalysisContent";
import BranchAnalysisContent from "@/app/components/Admin/aiprediction/Branch/BranchAnalysisContent";
import CustomerAnalysisContent from "@/app/components/Admin/aiprediction/Customer/CustomerAnalysisContent";
import StaffAnalysisContent from "@/app/components/Admin/aiprediction/Staff/StaffAnalysisContent";

const TABS = [
  { id: "productAnalysis", label: "Product Analysis" },
  { id: "salesAnalysis", label: "Sales Analysis" },
  { id: "branchAnalysis", label: "Branch Analysis" },
  { id: "customerAnalysis", label: "Customer Analysis" },
  { id: "staffAnalysis", label: "Staff Work Analysis" },
];

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<string>("productAnalysis");

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        
        <TabSelector
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "productAnalysis" && <ProductAnalysisContent />}
        {activeTab === "salesAnalysis" && <SalesAnalysisContent />}
        {activeTab === "branchAnalysis" && <BranchAnalysisContent />}
        {activeTab === "customerAnalysis" && <CustomerAnalysisContent />}
        {activeTab === "staffAnalysis" && <StaffAnalysisContent />}

      </div>
    </DashboardLayout>
  );
}
