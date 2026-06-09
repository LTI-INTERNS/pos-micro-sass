"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarClock, ExternalLink, RefreshCcw, XCircle } from "lucide-react";
import PlanCard from "@/components/Admin/settings/subscriptionplan/PlanCard";
import { planCardsData, PlanCardData } from "@/components/Admin/settings/subscriptionplan/planCardsData";
import PaymentModal, { PaymentPlan } from "@/components/Admin/settings/subscriptionplan/PaymentModal";
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import { cancelScheduledSubscriptionChange, createBillingPortalSession } from "@/lib/services/stripe-service";
import type { SubscriptionType } from "@/types/subscription.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function subTypeToCardId(subType: SubscriptionType | ""): string {
  const map: Record<SubscriptionType, string> = {
    FREE: "free",
    PRO: "pro",
    ENTERPRISE: "enterprise",
  };
  return subType ? (map[subType] ?? "free") : "free";
}

function planRank(subType: SubscriptionType): number {
  const rank: Record<SubscriptionType, number> = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
  return rank[subType] ?? 0;
}

function cardToPaymentPlan(plan: PlanCardData): PaymentPlan {
  return {
    id: plan.id,
    subType: plan.subType,
    name: plan.name,
    price: plan.price,
    billingCycle: plan.billingCycle,
  };
}

function formatDate(value?: string | null): string {
  if (!value) return "the end of the current billing period";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function actionLabelForPlan(plan: PlanCardData, currentType: SubscriptionType, hasStripeCustomer: boolean): string {
  if (plan.subType === currentType) return "Keep this plan";
  if (plan.subType === "FREE") return hasStripeCustomer ? "Schedule cancellation" : "Free plan active";
  if (!hasStripeCustomer || currentType === "FREE") return "Upgrade with Stripe";
  if (planRank(plan.subType) > planRank(currentType)) return "Upgrade now";
  return "Schedule downgrade";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SubscriptionPlanCards() {
  const { storeInfo, refreshStoreInfo, isStoreInfoLoading } = useStoreInfo();
  const { toasts, showToast, dismissToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelScheduleLoading, setCancelScheduleLoading] = useState(false);

  const currentType = storeInfo.subscription?.type ?? "FREE";
  const currentPlanId = storeInfo.subscription ? subTypeToCardId(storeInfo.subscription.type) : "";
  const hasStripeCustomer = storeInfo.hasStripeCustomer;
  const isPaidPlan = currentType === "PRO" || currentType === "ENTERPRISE";
  const billingFailed = storeInfo.subscriptionBillingStatus === "FAILED";
  const currentPlanData = planCardsData.find((plan) => plan.subType === currentType);
  const scheduledSubscription = storeInfo.scheduledSubscription;

  const sortedPlans = useMemo(() => {
    return [...planCardsData].sort((a, b) => {
      if (a.id === currentPlanId) return -1;
      if (b.id === currentPlanId) return 1;
      return 0;
    });
  }, [currentPlanId]);

  const handlePlanClick = (plan: PlanCardData) => {
    if (plan.subType === currentType && scheduledSubscription) {
      void handleCancelScheduledChange();
      return;
    }

    if (plan.subType === currentType) return;
    if (plan.subType === "FREE" && !hasStripeCustomer) return;

    setSelectedPlan(cardToPaymentPlan(plan));
  };

  const handleManageBilling = async () => {
    if (!hasStripeCustomer) {
      showToast(
        "This company is not connected to Stripe yet. Complete Stripe checkout first, then Manage Billing will be available.",
        "error",
      );
      return;
    }

    setPortalLoading(true);
    const result = await createBillingPortalSession();

    if (!result.ok) {
      setPortalLoading(false);
      showToast(result.message, "error");
      return;
    }

    window.location.href = result.url;
  };

  const handleCancelScheduledChange = async () => {
    setCancelScheduleLoading(true);
    const result = await cancelScheduledSubscriptionChange();

    if (!result.ok) {
      setCancelScheduleLoading(false);
      showToast(result.message, "error");
      return;
    }

    showToast(result.message, "success");
    await refreshStoreInfo();
    setCancelScheduleLoading(false);
  };

  useEffect(() => {
    void refreshStoreInfo();
  }, [refreshStoreInfo]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("subscriptionStatus");

    if (status === "success") {
      showToast("Stripe confirmed your checkout. Refreshing your subscription details.", "success");
      void refreshStoreInfo();
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (status === "cancel") {
      showToast("Checkout was cancelled. No subscription change was made.", "info");
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (status === "managed") {
      showToast("Returned from Stripe Billing Portal. Refreshing subscription details.", "success");
      void refreshStoreInfo();
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [refreshStoreInfo, showToast]);

  if (!storeInfo.subscription && isStoreInfoLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Loading current subscription plan...
      </div>
    );
  }

  if (!storeInfo.subscription) {
    return (
      <>
        <ToastNotification toasts={toasts} onDismiss={dismissToast} />
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
          Could not load the current subscription plan. Please refresh the page or select the company again.
        </div>
      </>
    );
  }

  return (
    <>
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      <div className="mb-4 flex flex-col gap-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Current subscription</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{currentType}</p>
              <p className="mt-1 text-xs text-gray-500">
                Stripe connection: {hasStripeCustomer ? "Connected" : "Not connected"}
              </p>
              {storeInfo.currentPeriodEnd && isPaidPlan && (
                <p className="mt-1 text-xs text-gray-500">
                  Current paid access ends/renews on {formatDate(storeInfo.currentPeriodEnd)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  void refreshStoreInfo();
                  showToast("Subscription details refreshed.", "success");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition active:scale-95"
              >
                <RefreshCcw size={13} /> Refresh
              </button>

              {scheduledSubscription && (
                <button
                  type="button"
                  onClick={handleCancelScheduledChange}
                  disabled={cancelScheduleLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition active:scale-95 disabled:opacity-60"
                >
                  <XCircle size={13} /> {cancelScheduleLoading ? "Cancelling..." : "Cancel Scheduled Change"}
                </button>
              )}

              {hasStripeCustomer && (
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 active:scale-95 disabled:opacity-60"
                >
                  <ExternalLink size={13} /> {portalLoading ? "Opening..." : "Manage Billing"}
                </button>
              )}
            </div>
          </div>
        </div>

        {scheduledSubscription && (
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <CalendarClock size={16} className="mt-0.5 shrink-0" />
            <span>
              Scheduled change: your current {currentType} access stays active until {formatDate(scheduledSubscription.effectiveAt)}. Your plan will change to {scheduledSubscription.type} after that date.
            </span>
          </div>
        )}

        {billingFailed && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>Latest subscription payment failed. Open Manage Billing and update the payment method.</span>
          </div>
        )}

        {isPaidPlan && !hasStripeCustomer && (
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                This company is marked as paid in the database, but it is not connected to Stripe. Complete checkout for this paid plan to create the Stripe customer before using Manage Billing.
              </span>
            </div>
            {currentPlanData && currentPlanData.subType !== "FREE" && (
              <button
                type="button"
                onClick={() => setSelectedPlan(cardToPaymentPlan(currentPlanData))}
                className="shrink-0 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-600 active:scale-95"
              >
                Connect with Stripe
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {sortedPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isScheduled = scheduledSubscription?.type === plan.subType;
          const canSelectPlan = !isCurrent || Boolean(scheduledSubscription && plan.subType === currentType);

          return (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              billingCycle={plan.billingCycle}
              description={plan.description}
              badge={isScheduled ? "Scheduled next" : plan.badge}
              features={plan.features}
              isCurrent={isCurrent}
              upgradeLabel={scheduledSubscription && plan.subType === currentType ? "Keep current plan" : actionLabelForPlan(plan, currentType, hasStripeCustomer)}
              onUpgrade={canSelectPlan ? () => handlePlanClick(plan) : undefined}
            />
          );
        })}
      </div>

      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onNotify={showToast}
        onChanged={refreshStoreInfo}
      />
    </>
  );
}
