import { useEffect, useState } from "react";
import { RegistrationData } from "@/app/companyregistration/page";
import { createCompany } from "@/lib/services/saas-service";
import { createStripeCheckoutSession } from "@/lib/services/stripe-service";
import { settingsService } from "@/lib/services/settings-service";
import type { SubscriptionPlanDetails, SubscriptionType } from "@/types/subscription.types";

import ActionButton from "@/components/Admin/common/ActionButton";
import { FormErrorMessage } from "@/components/saas/common/FormFields";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import GlassBackground from "@/components/saas/common/GlassBackground";

import PaymentSuccessPopup from "@/components/saas/paymentProcess/Paymentsuccesspopup";

function LineText({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}

function normalizePhoneForApi(phone: string) {
  const compact = phone.trim().replace(/[\s().-]/g, "");
  return compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
}

type Props = {
  data: RegistrationData;
  onComplete: () => void;
};

export default function PaymentProcessStep({ data, onComplete }: Props) {
  const planType = data.subId.replace(/^SUB_/, "") as SubscriptionType;
  const isFree = planType === "FREE";

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [planDetails, setPlanDetails] = useState<SubscriptionPlanDetails | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setPlanLoading(true);
    setPlanDetails(null);

    void settingsService.fetchSubscriptionPlanDetails(planType).then((plan) => {
      if (!active) return;
      setPlanDetails(plan);
      setPlanLoading(false);
      if (!plan) setFormError("Unable to load the selected subscription plan. Please try again.");
    });

    return () => {
      active = false;
    };
  }, [planType]);

  async function createAndStamp(): Promise<boolean> {
    setFormError("");
    setSubmitting(true);

    const result = await createCompany({
      companyName: data.companyName,
      address: data.address,
      contactNumber: normalizePhoneForApi(data.contact),
      email: data.email,
      logoUrl: data.logoUrl ?? "",
      businessTypeId: data.businessTypeId,
      subId: data.subId,
    });

    if (!result.ok) {
      setFormError(result.message);
      setSubmitting(false);
      return false;
    }

    // Do not stamp the created company into the NextAuth session here.
    // The company selection page must continue using a token whose companyId
    // matches the session context. Stamping a companyId with the old token causes
    // COMPANY_CONTEXT_MISMATCH and prevents the company list from loading.
    setSubmitting(false);
    return true;
  }

  async function handleCreateCompany() {
    const ok = await createAndStamp();

    if (!ok) {
      setPaymentSuccess(false);
      setRegistrationSuccess(false);
      setShowSuccess(false);
      return;
    }

    setFormError("");
    setPaymentSuccess(true);
    setRegistrationSuccess(true);
    setShowSuccess(true);
  }

  async function handleStripeCheckout() {
    setFormError("");
    setSubmitting(true);

    const result = await createStripeCheckoutSession({
      companyName: data.companyName,
      address: data.address,
      contactNumber: normalizePhoneForApi(data.contact),
      email: data.email,
      logoUrl: data.logoUrl ?? "",
      businessTypeId: data.businessTypeId,
      subId: data.subId,
    });

    if (!result.ok) {
      setFormError(result.message);
      setSubmitting(false);
      return;
    }

    if (!result.url) {
      setFormError("Stripe checkout URL was not returned by the server.");
      setSubmitting(false);
      return;
    }

    window.location.href = result.url;
  }

  const planPrice = Number(planDetails?.priceMonthly ?? 0);
  const planLabel = planDetails?.type ?? (planLoading ? "Loading…" : "—");

  const summary = {
    companyName: data.companyName || "—",
    address: data.address || "—",
    contact: data.contact || "—",
    email: data.email || "—",
    businessType: data.businessTypeId || "—",
    plan: planLabel,
    branchLimit: planDetails
      ? planDetails.branchLimit ?? "Unlimited"
      : planLoading ? "Loading…" : "—",
    orderEmail: data.email || "—",
    currency: "USD $",
    total: planPrice.toFixed(2),
  };

  const orderSummaryPanel = (
    <div className="rounded-2xl bg-linear-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-xl">
      <h2 className="text-[28px] font-bold mb-6">Order Summary</h2>

      <section className="space-y-1">
        <h3 className="text-lg font-semibold">Company Information</h3>
        <LineText>{summary.companyName}</LineText>
        <LineText>{summary.address}</LineText>
        <LineText>{summary.contact}</LineText>
        <LineText>{summary.email}</LineText>
      </section>

      <section className="mt-6 space-y-1">
        <h3 className="text-lg font-semibold">Order Details</h3>
        <LineText>Business Type: {summary.businessType}</LineText>
        <LineText>Plan: {summary.plan}</LineText>
        <LineText>Branch Limit: {summary.branchLimit}</LineText>
        <LineText>Order Email: {summary.orderEmail}</LineText>
      </section>

      <div className="mt-8 flex justify-between font-bold text-lg">
        <span>{isFree ? "Total" : "Monthly Total"}</span>
        <span>
          {summary.currency} {summary.total}{isFree ? "" : " / month"}
        </span>
      </div>
    </div>
  );

  const freePlanPanel = (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          You&apos;re on the Free Plan
        </h2>
        <p className="text-white/60 text-sm leading-relaxed">
          No payment required. Click below to create your company and get started right away.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2 text-sm text-white/70">
        <div className="flex justify-between">
          <span>Plan</span>
          <span className="text-white font-medium">{summary.plan}</span>
        </div>
        <div className="flex justify-between">
          <span>Company</span>
          <span className="text-white font-medium">{summary.companyName}</span>
        </div>
        <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-white">
          <span>Total Due Today</span>
          <span>USD $ 0.00</span>
        </div>
      </div>

      {formError && <FormErrorMessage message={formError} />}

      <ActionButton
        className="w-full py-4 text-base"
        onClick={handleCreateCompany}
        disabled={submitting || planLoading || !planDetails}
      >
        {planLoading ? "Loading plan…" : submitting ? "Creating…" : "Create Company"}
      </ActionButton>
    </div>
  );

  const paidPlanPanel = (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Stripe Checkout</h2>
        <p className="text-white/60 text-sm leading-relaxed">
          Your subscription will be created on Stripe&apos;s secure hosted checkout page. We do not store or process card numbers in this app.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 text-sm text-white/70">
        <div className="flex justify-between">
          <span>Plan</span>
          <span className="text-white font-medium">{summary.plan}</span>
        </div>
        <div className="flex justify-between">
          <span>Company</span>
          <span className="text-white font-medium">{summary.companyName}</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-white">
          <span>Monthly Subscription</span>
          <span>
            {summary.currency} {summary.total} / month
          </span>
        </div>
      </div>

      {formError && <FormErrorMessage message={formError} />}

      <ActionButton
        className="w-full py-4 text-base"
        onClick={handleStripeCheckout}
        disabled={submitting || planLoading || !planDetails}
      >
        {planLoading ? "Loading plan…" : submitting ? "Redirecting…" : "Subscribe with Stripe"}
      </ActionButton>
    </div>
  );

  return (
    <>
      <GlassBackground>
        <div className="px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-3xl">
            <SplitPanelLayout
              showDivider
              left={isFree ? freePlanPanel : paidPlanPanel}
              right={orderSummaryPanel}
            />
          </div>
        </div>
      </GlassBackground>

      <PaymentSuccessPopup
        isOpen={showSuccess}
        paymentSuccess={paymentSuccess}
        registrationSuccess={registrationSuccess}
        onClose={() => {
          setShowSuccess(false);
          onComplete();
        }}
        onTryAgain={() => setShowSuccess(false)}
      />
    </>
  );
}
