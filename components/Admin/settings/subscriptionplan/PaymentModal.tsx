"use client";

import { useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { createSubscriptionCheckoutSession } from "@/lib/services/stripe-service";
import type { SubscriptionType } from "@/types/subscription.types";
import type { ToastType } from "@/components/Admin/common/ToastNotification";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentPlan = {
  id: string;
  subType: SubscriptionType;
  name: string;
  price: string;
  billingCycle: string;
};

type Props = {
  open: boolean;
  plan: PaymentPlan | null;
  onClose: () => void;
  onNotify?: (message: string, type?: ToastType) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentModal({ open, plan, onClose, onNotify }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!plan) return;

    if (plan.subType === "FREE") {
      onNotify?.("Free plan does not require Stripe checkout. Use Manage Billing to cancel a paid subscription.", "info");
      return;
    }

    setLoading(true);
    const result = await createSubscriptionCheckoutSession(`SUB_${plan.subType}`);

    if (!result.ok) {
      setLoading(false);
      onNotify?.(result.message, "error");
      return;
    }

    window.location.href = result.url;
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!plan) return null;

  return (
    <ModalShell
      open={open}
      title={`Continue with ${plan.name}`}
      onClose={handleClose}
      widthClassName="w-[520px] max-w-[94vw]"
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-orange-50 border border-orange-200 px-5 py-4">
          <p className="text-[11px] text-gray-400 font-medium">Selected Plan</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <p className="text-base font-bold text-gray-800">{plan.name}</p>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-orange-500">{plan.price}</p>
              <p className="text-[11px] text-gray-400">/ {plan.billingCycle}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 leading-6">
          You will be redirected to Stripe Checkout. Stripe will securely collect the payment method.
          Your app will activate this plan only after Stripe confirms the payment through the webhook.
        </div>

        <PopupActions
          actions={[
            { label: "Cancel", onClick: handleClose, variant: "secondary", disabled: loading },
            {
              label: loading ? "Redirecting..." : "Continue to Stripe",
              onClick: handleCheckout,
              variant: "primary",
              disabled: loading,
            },
          ]}
        />
      </div>
    </ModalShell>
  );
}
