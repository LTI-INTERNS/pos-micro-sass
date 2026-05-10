import { useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { RegistrationData } from "@/app/companyregistration/page";
import { createCompany } from "@/lib/services/saas-service";

import ActionButton from "@/components/Admin/common/ActionButton";
import {
  InputField,
  FormErrorMessage,
} from "@/components/saas/common/FormFields";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import GlassBackground from "@/components/saas/common/GlassBackground";

import PaymentSuccessPopup from "@/components/saas/paymentProcess/Paymentsuccesspopup";

// Plan pricing 
const PLAN_PRICES: Record<string, number> = {
  free:       0.00,
  pro:        29.99,
  enterprise: 99.99,
};

type Errors = {
  nameOnCard?: string;
  cardNumber?: string;
  expDate?: string;
  cvv?: string;
};

type Touched = {
  nameOnCard?: boolean;
  cardNumber?: boolean;
  expDate?: boolean;
  cvv?: boolean;
};

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

function formatExpDate(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvc(v: string) {
  return v.replace(/\D/g, "").slice(0, 3);
}

function getFieldError(
  field: keyof Errors,
  values: {
    nameOnCard: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
  }
) {
  const { nameOnCard, cardNumber, expDate, cvv } = values;

  switch (field) {
    case "nameOnCard":
      if (!nameOnCard.trim()) return "Name on card is required";
      if (nameOnCard.trim().length < 3) return "Enter a valid name";
      return "";
    case "cardNumber": {
      const digits = cardNumber.replace(/-/g, "");
      if (!digits) return "Card number is required";
      if (!/^\d{16}$/.test(digits)) return "Card number must be 16 digits";
      return "";
    }

    case "expDate": {
      if (!expDate.trim()) return "Expiry date is required";

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate))
        return "Use MM/YY format (e.g. 08/27)";

      const [mm, yy] = expDate.split("/").map(Number);

      const now = new Date();
      const currentFullYear = now.getFullYear();
      const currentMonth    = now.getMonth() + 1;

      const cardFullYear = 2000 + yy; 

      const minFullYear = currentFullYear - 4;
      const maxFullYear = currentFullYear + 4;

      const tooOld =
        cardFullYear < minFullYear ||
        (cardFullYear === minFullYear && mm < currentMonth);

      if (tooOld) {
        const minMM = String(currentMonth).padStart(2, "0");
        const minYY = String(minFullYear).slice(2);
        return `Expiry date cannot be more than 4 years in the past (min ${minMM}/${minYY})`;
      }
      const tooFar =
        cardFullYear > maxFullYear ||
        (cardFullYear === maxFullYear && mm > currentMonth);

      if (tooFar) {
        const maxMM = String(currentMonth).padStart(2, "0");
        const maxYY = String(maxFullYear).slice(2);
        return `Expiry date cannot be more than 4 years in the future (max ${maxMM}/${maxYY})`;
      }

      return "";
    }

    case "cvv":
      if (!cvv.trim()) return "CVV is required";
      if (!/^\d{3}$/.test(cvv)) return "CVV must be exactly 3 digits";
      return "";
    default:
      return "";
  }
}

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

  // Card-form state (only used for paid plans)
  const [nameOnCard, setNameOnCard] = useState(data.nameOnCard);
  const [cardNumber, setCardNumber] = useState(data.cardNumber);
  const [expDate,    setExpDate]    = useState(data.expDate);
  const [cvv,        setCvv]        = useState(data.cvv);

  const [errors,    setErrors]  = useState<Errors>({});
  const [touched,   setTouched] = useState<Touched>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess,         setShowSuccess]         = useState(false);
  const [paymentSuccess,      setPaymentSuccess]      = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const values = useMemo(
    () => ({ nameOnCard, cardNumber, expDate, cvv }),
    [nameOnCard, cardNumber, expDate, cvv]
  );

  function validateField(field: keyof Errors) {
    const msg = getFieldError(field, values);
    setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
    return !msg;
  }

  function markTouched(field: keyof Touched) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function validateAll() {
    const fields: (keyof Errors)[] = ["nameOnCard", "cardNumber", "expDate", "cvv"];
    const next: Errors = {};
    let ok = true;
    for (const f of fields) {
      const msg = getFieldError(f, values);
      if (msg) ok = false;
      next[f] = msg || undefined;
    }
    setErrors(next);
    return ok;
  }

  const isFormValid =
    !getFieldError("nameOnCard", values) &&
    !getFieldError("cardNumber", values) &&
    !getFieldError("expDate",    values) &&
    !getFieldError("cvv",        values);

  // ── Shared company-creation + session-stamp ───────────────────────────────
  async function createAndStamp(): Promise<boolean> {
    setFormError("");
    setSubmitting(true);

    const result = await createCompany({
      companyName:    data.companyName,
      address:        data.address,
      contactNumber:  data.contact,
      email:          data.email,
      logoUrl:        data.logoUrl ?? "",
      businessTypeId: data.businessTypeId,
      subId:          data.subId,
    });

    if (!result.ok) {
      setFormError(result.message);
      setSubmitting(false);
      return false;
    }

    await signIn("select-company", {
      redirect:    false,
      companyId:   result.companyId,
      companyName: result.name,
      role:        session?.user?.role         ?? "",
      email:       session?.user?.email        ?? "",
      name:        session?.user?.name         ?? "",
      branchId:    session?.user?.branchId     ?? "",
      branchName:  session?.user?.branchName   ?? "",
      token:       session?.user?.backendToken ?? "",
    });

    setSubmitting(false);
    return true;
  }

  // ── Free plan — "Create Company" button handler ───────────────────────────
  async function handleCreateCompany() {
    const ok = await createAndStamp();
    setRegistrationSuccess(ok);
    setPaymentSuccess(true);   // no payment involved; treat as passed
    setShowSuccess(true);
  }

  // ── Paid plan — "Pay Now" button handler ──────────────────────────────────
  async function handlePayNow() {
    setTouched({ nameOnCard: true, cardNumber: true, expDate: true, cvv: true });
    if (!validateAll()) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const ok = await createAndStamp();
    setPaymentSuccess(ok);
    setRegistrationSuccess(ok);
    if (!ok) setPaymentSuccess(false);
    setShowSuccess(true);
  }

  // ── Derived summary values ────────────────────────────────────────────────
  const planKey   = data.subId?.toLowerCase().replace("sub_", "") ?? "";
  const planPrice = PLAN_PRICES[planKey] ?? 0;
  const planLabel = planKey
    ? planKey.charAt(0).toUpperCase() + planKey.slice(1).toLowerCase()
    : "—";

  const summary = {
    companyName:       data.companyName    || "—",
    address:           data.address        || "—",
    contact:           data.contact        || "—",
    email:             data.email          || "—",
    businessType:      data.businessTypeId || "—",
    plan:              planLabel,
    branchesRemaining: 3,
    orderEmail:        data.email          || "—",
    currency:          "USD $",
    total:             planPrice.toFixed(2),
  };

  // ── Order Summary panel (shared for both free and paid) ───────────────────
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
        <span>Total</span>
        <span>{summary.currency} {summary.total}</span>
      </div>
    </div>
  );

  // ── Free plan left panel ──────────────────────────────────────────────────
  const freePlanPanel = (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          You&apos;re on the Free Plan
        </h2>
        <p className="text-white/60 text-sm leading-relaxed">
          No payment required. Click below to create your company and get
          started right away.
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

  // ── Paid plan left panel ──────────────────────────────────────────────────
  const paidPlanPanel = (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">
        Payment Details
      </h2>

      <div className="space-y-6">
        <InputField
          id="nameOnCard"
          name="nameOnCard"
          label="Name on Card"
          required
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          onBlur={() => { markTouched("nameOnCard"); validateField("nameOnCard"); }}
          error={touched.nameOnCard ? errors.nameOnCard : ""}
        />

        <InputField
          id="cardNumber"
          name="cardNumber"
          label="Card Number"
          required
          inputMode="numeric"
          placeholder="0000-0000-0000-0000"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          onBlur={() => { markTouched("cardNumber"); validateField("cardNumber"); }}
          error={touched.cardNumber ? errors.cardNumber : ""}
        />

        <div className="grid grid-cols-2 gap-5">
          <InputField
            id="expDate"
            name="expDate"
            label="Valid Through"
            required
            inputMode="numeric"
            placeholder="MM/YY"
            value={expDate}
            onChange={(e) => setExpDate(formatExpDate(e.target.value))}
            onBlur={() => { markTouched("expDate"); validateField("expDate"); }}
            error={touched.expDate ? errors.expDate : ""}
          />

          <InputField
            id="cvv"
            name="cvv"
            label="CVV Code"
            required
            type="password"
            inputMode="numeric"
            placeholder="***"
            value={cvv}
            onChange={(e) => setCvv(formatCvc(e.target.value))}
            onBlur={() => { markTouched("cvv"); validateField("cvv"); }}
            error={touched.cvv ? errors.cvv : ""}
          />
        </div>

        {formError && <FormErrorMessage message={formError} />}

        <ActionButton
          className="w-full py-4 text-base"
          onClick={handlePayNow}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Processing…" : "Pay Now"}
        </ActionButton>
      </div>
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