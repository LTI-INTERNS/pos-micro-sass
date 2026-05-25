"use client";

import { useEffect, useState } from "react";
import PlanCard from "@/components/Admin/settings/subscriptionplan/PlanCard";
import { planCardsData, PlanCardData } from "@/components/Admin/settings/subscriptionplan/planCardsData";
import PaymentModal, { PaymentPlan } from "@/components/Admin/settings/subscriptionplan/PaymentModal";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import type { SubscriptionType } from "@/types/subscription.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Maps the DB SubscriptionType enum → planCardsData id.
 * Kept here so there is one place to update if plan names change.
 */
function subTypeToCardId(subType: SubscriptionType | ""): string {
  const map: Record<SubscriptionType, string> = {
    FREE: "free",
    PRO: "pro",
    ENTERPRISE: "enterprise",
  };
  return subType ? (map[subType] ?? "free") : "free";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubscriptionPlanCards() {
  const { storeInfo, setStoreInfo, refreshStoreInfo, isStoreInfoLoading } = useStoreInfo();

  // Derive the current card id directly from the context — no local state.
  // This means after a successful upgrade, a simple context update is enough
  // and the correct "Current Plan" card highlights on every render.
  const currentPlanId = storeInfo.subscription ? subTypeToCardId(storeInfo.subscription.type) : "";

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const handleUpgradeClick = (plan: PlanCardData) => {
    setSelectedPlan({
      id: plan.id,
      subType: plan.subType,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
    });
  };

  /**
   * Called by PaymentModal after a successful payment API call.
   * Updates the context so every part of the app immediately reflects
   * the new plan — no page reload required.
   */
  const handlePaymentSuccess = async (newSubType: SubscriptionType) => {
    // Update the visible plan immediately, then fetch the full latest
    // subscription object from /auth/store-info so limits stay accurate.
    setStoreInfo({
      subscription: storeInfo.subscription
        ? { ...storeInfo.subscription, type: newSubType }
        : null,
    });

    await refreshStoreInfo();
    setSelectedPlan(null);
  };


  useEffect(() => {
    void refreshStoreInfo();
  }, [refreshStoreInfo]);

  if (!storeInfo.subscription && isStoreInfoLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading current subscription plan...
      </div>
    );
  }

  if (!storeInfo.subscription) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Could not load the current subscription plan. Please refresh the page or select the company again.
      </div>
    );
  }

  // Show current plan first, then the rest in their original order.
  const sortedPlans = [...planCardsData].sort((a, b) => {
    if (a.id === currentPlanId) return -1;
    if (b.id === currentPlanId) return 1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {sortedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          return (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              billingCycle={plan.billingCycle}
              description={plan.description}
              badge={plan.badge}
              features={plan.features}
              isCurrent={isCurrent}
              upgradeLabel="Upgrade to this plan"
              onUpgrade={!isCurrent ? () => handleUpgradeClick(plan) : undefined}
            />
          );
        })}
      </div>

      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}