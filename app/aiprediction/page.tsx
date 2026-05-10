"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import ProductAnalysisContent from "@/components/Admin/aiprediction/Product/ProductAnalysisContent";
import SalesAnalysisContent from "@/components/Admin/aiprediction/Sales/SalesAnalysisContent";
import BranchAnalysisContent from "@/components/Admin/aiprediction/Branch/BranchAnalysisContent";
import CustomerAnalysisContent from "@/components/Admin/aiprediction/Customer/CustomerAnalysisContent";
import StaffAnalysisContent from "@/components/Admin/aiprediction/Staff/StaffAnalysisContent";
import { branchService } from "@/lib/services/branch-service";
import type { Branch } from "@/lib/services/branch-service";

export default function AiPredictionPage() {
  const { data: session } = useSession();
  const role = session?.user?.role?.toUpperCase() ?? "";
  const isManager = role === "MANAGER";

  const [activeTab, setActiveTab] = useState<string>("productAnalysis");
  const [branches, setBranches]   = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Tabs — Branch Analysis hidden for MANAGER or if a branch is selected
  const TABS = [
    { id: "productAnalysis",  label: "Product Analysis" },
    { id: "salesAnalysis",    label: "Sales Analysis" },
    ...((isManager || selectedBranchId) ? [] : [{ id: "branchAnalysis", label: "Branch Analysis" }]),
    { id: "customerAnalysis", label: "Customer Analysis" },
    { id: "staffAnalysis",    label: "Staff Work Analysis" },
  ];

  // Fetch branches for OWNER/ADMIN dropdown
  useEffect(() => {
    if (isManager) return;
    branchService.getAll().then(setBranches).catch(() => {});
  }, [isManager]);

  // Reset active tab if it becomes hidden due to branch selection
  useEffect(() => {
    if (selectedBranchId && activeTab === "branchAnalysis") {
      setActiveTab("productAnalysis");
    }
  }, [selectedBranchId, activeTab]);

  const branchIdProp = isManager ? undefined : (selectedBranchId || undefined);

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">

        {/* Branch dropdown — OWNER / ADMIN only */}
        {!isManager && branches.length > 0 && (
          <div className="flex items-center gap-3">
            <label htmlFor="ai-branch-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
              View Branch:
            </label>
            <select
              id="ai-branch-select"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <TabSelector
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "productAnalysis"  && <ProductAnalysisContent  branchId={branchIdProp} />}
        {activeTab === "salesAnalysis"    && <SalesAnalysisContent    branchId={branchIdProp} />}
        {activeTab === "branchAnalysis"   && <BranchAnalysisContent   branchId={branchIdProp} />}
        {activeTab === "customerAnalysis" && <CustomerAnalysisContent branchId={branchIdProp} isManager={isManager} />}
        {activeTab === "staffAnalysis"    && <StaffAnalysisContent    branchId={branchIdProp} />}

      </div>
    </DashboardLayout>
  );
}
