"use client";

import { useState } from "react";
import TabSelector from "@/components/Admin/common/TabSelector";
import CustomerGrowthChart from "@/components/Admin/aiprediction/Customer/CustomerGrowthChart";
import CustomerBranchChart from "@/components/Admin/aiprediction/Customer/CustomerBranchChart";

const CUSTOMER_TABS = [
  { id: "growth", label: "Customer Growth" },
  { id: "branch", label: "Branch Breakdown" },
];

export default function CustomerReportChart() {
  const [activeTab, setActiveTab] = useState("growth");

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] p-6 flex flex-col gap-4 min-w-0">
      <TabSelector
        tabs={CUSTOMER_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "growth" && <CustomerGrowthChart />}
      {activeTab === "branch" && <CustomerBranchChart />}
    </div>
  );
}
