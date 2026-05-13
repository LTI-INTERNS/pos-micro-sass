"use client";

import { useState } from "react";
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
    FREE:       "free",
    PRO:        "pro",
    ENTERPRISE: "enterprise",
  };
  return subType ? (map[subType] ?? "free") : "free";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubscriptionPlanCards() {
  const { storeInfo, setStoreInfo } = useStoreInfo();

  // Derive the current card id directly from the context — no local state.
  // This means after a successful upgrade, a simple context update is enough
  // and the correct "Current Plan" card highlights on every render.
  const currentPlanId = subTypeToCardId(storeInfo.subscription?.type ?? "FREE");

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const handleUpgradeClick = (plan: PlanCardData) => {
    setSelectedPlan({
      id:          plan.id,
      subType:     plan.subType,
      name:        plan.name,
      price:       plan.price,
      billingCycle: plan.billingCycle,
    });
  };

  /**
   * Called by PaymentModal after a successful payment API call.
   * Updates the context so every part of the app immediately reflects
   * the new plan — no page reload required.
   */
  const handlePaymentSuccess = (newSubType: SubscriptionType) => {
    // Update subscription type in context.
    // The full subscription object (limits, analytics flag, etc.) will be
    // refreshed on the next page load when /auth/store-info is called again.
    // For the current session we update just the type so plan cards re-render.
    setStoreInfo({
      subscription: storeInfo.subscription
        ? { ...storeInfo.subscription, type: newSubType }
        : null,
    });
    setSelectedPlan(null);
  };

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