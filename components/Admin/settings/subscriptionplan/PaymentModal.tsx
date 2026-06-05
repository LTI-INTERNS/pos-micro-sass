"use client";

import { useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { createSubscriptionCheckoutSession } from "@/lib/services/stripe-service";
import type { SubscriptionType } from "@/types/subscription.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentPlan = {
  id:           string;
  subType:      SubscriptionType;
  name:         string;
  price:        string;
  billingCycle: string;
};

type Props = {
  open:     boolean;
  plan:     PaymentPlan | null;
  onClose:  () => void;
  onSuccess?: (newSubType: SubscriptionType) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentModal({ open, plan, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (loading) return;
    setError("");
    onClose();
  };

  const handleContinueToStripe = async () => {
    if (!plan) return;

    setError("");
    setLoading(true);

    const result = await createSubscriptionCheckoutSession(plan.subType);

    if (result.ok) {
      window.location.href = result.url;
      return;
    }

    setError(result.message);
    setLoading(false);
  };

  if (!plan) return null;

  return (
    <ModalShell
      open={open}
      title={`Upgrade to ${plan.name} Plan`}
      onClose={handleClose}
      widthClassName="w-[520px] max-w-[94vw]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-200 px-5 py-3">
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Selected Plan</p>
            <p className="text-sm font-bold text-gray-800">{plan.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-orange-500">{plan.price}</p>
            <p className="text-[11px] text-gray-400">/ {plan.billingCycle}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 leading-relaxed">
          You will be redirected to Stripe Checkout to complete this subscription securely. Card details are entered only on Stripe, not inside the POS app.
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center">
          🔒 Secure payment handled by Stripe
        </p>

        <PopupActions
          actions={[
            { label: "Cancel", onClick: handleClose, variant: "secondary", disabled: loading },
            {
              label: loading ? "Opening Stripe..." : "Continue to Stripe",
              onClick: handleContinueToStripe,
              variant: "primary",
              disabled: loading,
            },
          ]}
        />
      </div>
    </ModalShell>
  );
}
