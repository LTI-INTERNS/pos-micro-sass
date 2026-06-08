"use client";

import { useRef, useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { changeSubscriptionPlan } from "@/lib/services/stripe-service";
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
  onChanged?: () => Promise<void> | void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentModal({ open, plan, onClose, onNotify, onChanged }: Props) {
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handleCheckout = async () => {
    if (!plan || submittingRef.current) return;

    submittingRef.current = true;
    setLoading(true);
    const result = await changeSubscriptionPlan(`SUB_${plan.subType}`);

    if (!result.ok) {
      submittingRef.current = false;
      setLoading(false);
      onNotify?.(result.message, "error");
      return;
    }

    if (result.action === "checkout") {
      window.location.href = result.url;
      return;
    }

    submittingRef.current = false;
    setLoading(false);
    onNotify?.(result.message, "success");
    onClose();
    await onChanged?.();
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!plan) return null;

  const isFree = plan.subType === "FREE";

  return (
    <ModalShell
      open={open}
      title={`${isFree ? "Schedule" : "Continue with"} ${plan.name}`}
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
          {isFree ? (
            <>
              Your paid access will stay active until the current billing period ends. After that, Stripe will cancel the paid subscription and the app will move this company to the Free plan.
            </>
          ) : (
            <>
              If this is an upgrade, Stripe will apply it immediately and charge the prorated difference. If you already scheduled a cancellation or downgrade, this request will replace the previous scheduled change so only one future change stays active.
            </>
          )}
        </div>

        <PopupActions
          actions={[
            { label: "Cancel", onClick: handleClose, variant: "secondary", disabled: loading },
            {
              label: loading ? "Processing..." : isFree ? "Schedule Free Plan" : "Continue",
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
