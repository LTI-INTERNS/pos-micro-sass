"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import ProductAnalysisContent from "@/components/Admin/aiprediction/Product/ProductAnalysisContent";
import SalesAnalysisContent from "@/components/Admin/aiprediction/Sales/SalesAnalysisContent";
import BranchAnalysisContent from "@/components/Admin/aiprediction/Branch/BranchAnalysisContent";
import CustomerAnalysisContent from "@/components/Admin/aiprediction/Customer/CustomerAnalysisContent";
import StaffAnalysisContent from "@/components/Admin/aiprediction/Staff/StaffAnalysisContent";
import { branchService } from "@/lib/services/branch-service";
import type { Branch } from "@/lib/services/branch-service";
import { useStoreInfo } from '@/lib/context/StoreInfoContext';
import { hasAIPrediction } from '@/types/subscription.types';
import ActionButton from "@/components/Admin/common/ActionButton";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { notificationService } from "@/lib/services/notification-service";

export default function AiPredictionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role?.toUpperCase() ?? "";
  const isManager = role === "MANAGER";
  const isOwner = role === "OWNER";

  const { storeInfo } = useStoreInfo();
  const hasAI = hasAIPrediction(storeInfo.subscription?.aiPredictionLevel);

  const [activeTab, setActiveTab] = useState<string>("productAnalysis");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Tabs — Branch Analysis hidden for MANAGER or if a branch is selected
  const TABS = [
    { id: "productAnalysis", label: "Product Analysis" },
    { id: "salesAnalysis", label: "Sales Analysis" },
    ...((isManager || selectedBranchId) ? [] : [{ id: "branchAnalysis", label: "Branch Analysis" }]),
    { id: "customerAnalysis", label: "Customer Analysis" },
    { id: "staffAnalysis", label: "Staff Work Analysis" },
  ];

  // Fetch branches for OWNER/ADMIN dropdown
  useEffect(() => {
    if (isManager) return;
    branchService.getAll().then(setBranches).catch(() => { });
  }, [isManager]);

  // Reset active tab if it becomes hidden due to branch selection
  useEffect(() => {
    if (selectedBranchId && activeTab === "branchAnalysis") {
      setActiveTab("productAnalysis");
    }
  }, [selectedBranchId, activeTab]);

  const branchIdProp = isManager ? undefined : (selectedBranchId || undefined);

  const [isNotifying, setIsNotifying] = useState(false);
  const { addNotification } = useNotifications();

  const handleNotifyOwner = async () => {
    try {
      setIsNotifying(true);
      await notificationService.submitSubscriptionUpgrade();
      addNotification({
        message: "Upgrade request sent to the owner successfully.",
        type: "success",
      });
    } catch {
      addNotification({
        message: "Failed to send upgrade request. Please try again.",
        type: "error",
      });
    } finally {
      setIsNotifying(false);
    }
  };

  const isProLimited = storeInfo.subscription?.type === 'PRO' && selectedBranchId !== "";
  const shouldBlur = !hasAI || isProLimited;

  useEffect(() => {
    if (shouldBlur) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldBlur]);

  return (
    <DashboardLayout>
      <div className="relative w-full h-full min-h-[500px]">

        {/* Branch dropdown — OWNER / ADMIN only */}
        {!isManager && branches.length > 0 && (
          <div className={`flex items-center gap-3 mb-5 relative z-20 ${!hasAI ? 'blur-md pointer-events-none select-none' : ''}`}>
            <label htmlFor="ai-branch-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
              View Branch:
            </label>
            <select
              id="ai-branch-select"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!hasAI}
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

        <div className={`w-full space-y-5 ${shouldBlur ? 'blur-md pointer-events-none select-none' : ''}`}>
          <TabSelector
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "productAnalysis" && <ProductAnalysisContent branchId={branchIdProp} />}
          {activeTab === "salesAnalysis" && <SalesAnalysisContent branchId={branchIdProp} />}
          {activeTab === "branchAnalysis" && <BranchAnalysisContent branchId={branchIdProp} />}
          {activeTab === "customerAnalysis" && <CustomerAnalysisContent branchId={branchIdProp} isManager={isManager} />}
          {activeTab === "staffAnalysis" && <StaffAnalysisContent branchId={branchIdProp} />}
        </div>

        {/* Upgrade Plan Overlay (FREE Plan) */}
        {!hasAI && (
          <div className="absolute inset-0 z-10 bg-white/40">
            <div className="sticky top-[20vh] mx-auto bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Insights Locked</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                You are using the <span className="font-bold text-gray-800">{storeInfo.subscription?.type || 'FREE'}</span> plan. To generate AI insights, upgrade your plan to <span className="font-bold text-gray-800">Pro</span> or <span className="font-bold text-gray-800">Enterprise</span> version.
              </p>
              {isOwner ? (
                <ActionButton
                  className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
                  label="Upgrade Plan"
                  variant="primary"
                  onClick={() => router.push('/settings?tab=subscriptionPlan')}
                />
              ) : (
                <ActionButton
                  className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
                  label={isNotifying ? "Notifying..." : "Notify Owner to Upgrade"}
                  variant="primary"
                  onClick={handleNotifyOwner}
                  disabled={isNotifying}
                />
              )}
            </div>
          </div>
        )}

        {/* Upgrade Plan Overlay (PRO Plan - Branch Selection) */}
        {hasAI && isProLimited && (
          <div className="absolute inset-0 z-10 bg-white/40">
            <div className="sticky top-[20vh] mx-auto bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 mt-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Branch Insights Locked</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                You are using the <span className="font-bold text-gray-800">PRO</span> plan, which only includes company-wide AI predictions. To view detailed AI insights for individual branches, upgrade your plan to <span className="font-bold text-gray-800">Enterprise</span>.
              </p>
              {isOwner ? (
                <ActionButton
                  className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
                  label="Upgrade to Enterprise"
                  variant="primary"
                  onClick={() => router.push('/settings?tab=subscriptionPlan')}
                />
              ) : (
                <ActionButton
                  className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
                  label={isNotifying ? "Notifying..." : "Notify Owner to Upgrade"}
                  variant="primary"
                  onClick={handleNotifyOwner}
                  disabled={isNotifying}
                />
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
