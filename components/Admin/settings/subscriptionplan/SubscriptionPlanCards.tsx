"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PlanCard from "@/components/Admin/settings/subscriptionplan/PlanCard";
import { planCardsData, PlanCardData } from "@/components/Admin/settings/subscriptionplan/planCardsData";
import PaymentModal, { PaymentPlan } from "@/components/Admin/settings/subscriptionplan/PaymentModal";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import { createBillingPortalSession } from "@/lib/services/stripe-service";
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

function planRank(type: SubscriptionType): number {
  const ranks: Record<SubscriptionType, number> = {
    FREE: 0,
    PRO: 1,
    ENTERPRISE: 2,
  };
  return ranks[type];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubscriptionPlanCards() {
  const { storeInfo, refreshStoreInfo, isStoreInfoLoading } = useStoreInfo();
  const searchParams = useSearchParams();
  const subscriptionStatus = searchParams.get("subscriptionStatus");

  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  const currentSubType = storeInfo.subscription?.type ?? "FREE";
  const currentPlanId = subTypeToCardId(currentSubType);
  const hasStripeCustomer = Boolean(storeInfo.hasStripeCustomer);

  const handleUpgradeClick = (plan: PlanCardData) => {
    setPortalError("");
    setSelectedPlan({
      id: plan.id,
      subType: plan.subType,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
    });
  };

  const handleOpenBillingPortal = async () => {
    setPortalError("");

    if (!hasStripeCustomer) {
      setPortalError("This company does not have a Stripe billing profile yet. Please upgrade through Stripe Checkout first.");
      return;
    }

    setPortalLoading(true);

    const result = await createBillingPortalSession();

    if (result.ok) {
      window.location.href = result.url;
      return;
    }

    setPortalError(result.message);
    setPortalLoading(false);
  };

  useEffect(() => {
    void refreshStoreInfo();
  }, [refreshStoreInfo]);

  const statusMessage = useMemo(() => {
    if (subscriptionStatus === "success") {
      return {
        tone: "success" as const,
        text: "Stripe confirmed your subscription. Your plan will update after the webhook is received.",
      };
    }
    if (subscriptionStatus === "cancel") {
      return {
        tone: "warning" as const,
        text: "Subscription checkout was cancelled. Your current plan was not changed.",
      };
    }
    return null;
  }, [subscriptionStatus]);

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
        {statusMessage && (
          <div
            className={[
              "rounded-2xl border px-5 py-4 text-sm",
              statusMessage.tone === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-yellow-200 bg-yellow-50 text-yellow-700",
            ].join(" ")}
          >
            {statusMessage.text}
          </div>
        )}

        {portalError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {portalError}
          </div>
        )}

        {currentSubType !== "FREE" && hasStripeCustomer && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Stripe billing portal</p>
              <p className="text-xs text-gray-500">
                Open Stripe to manage payment method, invoices, cancellation, or billing details.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenBillingPortal}
              disabled={portalLoading}
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-150 active:scale-95 cursor-pointer"
            >
              {portalLoading ? "Opening..." : "Manage billing"}
            </button>
          </div>
        )}

        {currentSubType !== "FREE" && !hasStripeCustomer && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
            Your current plan is active in the POS database, but it is not connected to a Stripe customer yet.
            Select a higher paid plan to create the Stripe billing profile. After that, the billing portal will be available.
          </div>
        )}

        {sortedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isUpgrade = planRank(plan.subType) > planRank(currentSubType);
          const shouldUseCheckout = !isCurrent && isUpgrade && (currentSubType === "FREE" || !hasStripeCustomer);
          const shouldUsePortal = !isCurrent && hasStripeCustomer;

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
              upgradeLabel={shouldUseCheckout ? "Upgrade with Stripe Checkout" : "Manage in Stripe"}
              onUpgrade={
                isCurrent
                  ? undefined
                  : shouldUseCheckout
                    ? () => handleUpgradeClick(plan)
                    : shouldUsePortal
                      ? handleOpenBillingPortal
                      : undefined
              }
            />
          );
        })}
      </div>

      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}
