import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { RegistrationData } from "@/app/companyregistration/page";
import { createCompany } from "@/lib/services/saas-service";
import { createStripeCheckoutSession } from "@/lib/services/stripe-service";

import ActionButton from "@/components/Admin/common/ActionButton";
import { FormErrorMessage } from "@/components/saas/common/FormFields";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import GlassBackground from "@/components/saas/common/GlassBackground";

import PaymentSuccessPopup from "@/components/saas/paymentProcess/Paymentsuccesspopup";

const PLAN_PRICES: Record<string, number> = {
  free: 0.0,
  pro: 29.99,
  enterprise: 99.99,
};

function LineText({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}

type Props = {
  data: RegistrationData;
  onComplete: () => void;
  onBack: () => void;
};

export default function PaymentProcessStep({ data, onComplete, onBack }: Props) {
  const { data: session } = useSession();

  const isFree = data.subId === "SUB_FREE";

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  async function createAndStamp(): Promise<boolean> {
    setFormError("");
    setSubmitting(true);

    const result = await createCompany({
      companyName: data.companyName,
      address: data.address,
      contactNumber: data.contact,
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

    await signIn("select-company", {
      redirect: false,
      companyId: result.companyId,
      companyName: result.name,
      role: session?.user?.role ?? "",
      email: session?.user?.email ?? "",
      name: session?.user?.name ?? "",
      branchId: session?.user?.branchId ?? "",
      branchName: session?.user?.branchName ?? "",
      token: session?.user?.backendToken ?? "",
    });

    setSubmitting(false);
    return true;
  }

  async function handleCreateCompany() {
    const ok = await createAndStamp();
    setRegistrationSuccess(ok);
    setPaymentSuccess(true);
    setShowSuccess(true);
  }

  async function handleStripeCheckout() {
    setFormError("");
    setSubmitting(true);

    const result = await createStripeCheckoutSession({
      companyName: data.companyName,
      address: data.address,
      contactNumber: data.contact,
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

  const planKey = data.subId?.toLowerCase().replace("sub_", "") ?? "";
  const planPrice = PLAN_PRICES[planKey] ?? 0;
  const planLabel = planKey
    ? planKey.charAt(0).toUpperCase() + planKey.slice(1).toLowerCase()
    : "—";

  const summary = {
    companyName: data.companyName || "—",
    address: data.address || "—",
    contact: data.contact || "—",
    email: data.email || "—",
    businessType: data.businessTypeId || "—",
    plan: planLabel,
    branchesRemaining: 3,
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
        <LineText>Branches Remaining: {summary.branchesRemaining}</LineText>
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
        disabled={submitting}
      >
        {submitting ? "Creating…" : "Create Company"}
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
        disabled={submitting}
      >
        {submitting ? "Redirecting…" : "Subscribe with Stripe"}
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

      <div className="mt-10 ml-50 lg:ml-110 md:ml-50 xl:ml-150 flex justify-start text-white mb-20">
        <button
          onClick={onBack}
          className="font-semibold hover:opacity-80 cursor-pointer"
          disabled={submitting}
        >
          {"< Back"}
        </button>
      </div>

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
