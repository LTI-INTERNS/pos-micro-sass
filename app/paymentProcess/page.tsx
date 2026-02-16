//payment process
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField, FormErrorMessage } from "@/app/components/saas/common/FormFields";
import Navigation from "@/app/components/saas/companyCreation/Navigation";
import StepProgressBar from "../components/saas/common/StepProgressBar";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import GlassBackground from "@/app/components/saas/common/GlassBackground";

import { tempCheckoutData } from "@/app/components/saas/paymentProcess/tempCheckoutData";

type PaymentMethod = "mastercard" | "visa" | "amex" | "discover";

type Summary = {
  customer: { name: string; address: string; email: string };
  company: { name: string; address: string; contact: string; email: string };
  order: { type: string; plan: string; branchesRemaining: string; email: string };
  total: number;
  currency: string;
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
  return v.replace(/\D/g, "").slice(0, 4);
}

function getFieldError(
  field: keyof Errors,
  values: { nameOnCard: string; cardNumber: string; expDate: string; cvv: string }
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
    case "expDate":
      if (!expDate.trim()) return "Expiry date is required";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) return "Use MM/YY format";
      return "";
    case "cvv":
      if (!cvv.trim()) return "CVC is required";
      if (!/^\d{3,4}$/.test(cvv)) return "CVC must be 3 or 4 digits";
      return "";
    default:
      return "";
  }
}

function LineText({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}

function CardTypeSelector({
  selected,
  onSelect,
}: {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}) {
  const cardTypes: { type: PaymentMethod }[] = [
    { type: "visa" },
    { type: "mastercard" },
  ];

  const CardIcon = ({ type }: { type: PaymentMethod }) => {
    if (type === "visa") {
      return (
        <svg viewBox="0 0 48 16" className="h-6">
          <text
            x="0"
            y="14"
            fontSize="14"
            fontWeight="bold"
            fill="#1A1F71"
          >
            VISA
          </text>
        </svg>
      );
    }

    if (type === "mastercard") {
      return (
        <svg viewBox="0 0 48 30" className="h-6">
          <circle cx="18" cy="15" r="10" fill="#EB001B" />
          <circle cx="30" cy="15" r="10" fill="#F79E1B" />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white">
        Card Type <span className="text-red-400">*</span>
      </label>

      {/* Center container */}
      <div className="flex justify-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xs sm:max-w-md">
          {cardTypes.map((card) => {
            const isSelected = selected === card.type;

            return (
              <button
                key={card.type}
                type="button"
                onClick={() => onSelect(card.type)}
                className={`
                  rounded-lg
                  px-3 py-2
                  flex items-center justify-between
                  transition-all duration-200
                  border
                  active:scale-[0.97]
                  ${
                    isSelected
                      ? "border-white bg-white shadow-md"
                      : "border-white/20 bg-white hover:bg-white/90"
                  }
                `}
              >
                <CardIcon type={card.type} />

                <div
                  className={`
                    w-4 h-4 rounded-full border-2
                    flex items-center justify-center
                    ${
                      isSelected
                        ? "border-blue-600"
                        : "border-gray-400"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}



export default function PaymentProcessPage() {
  const router = useRouter();

  const [method, setMethod] = useState<PaymentMethod>("visa");

  // Payment fields
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [formError, setFormError] = useState("");

  const summary = tempCheckoutData;

  //const [summary, setSummary] = useState<Summary | null>(null);
  
 // useEffect(() => {
  //  const raw = localStorage.getItem("checkout_summary");
  //  if (!raw) return;

 //   try {
  //    const parsed = JSON.parse(raw) as Summary;
 //     setSummary(parsed);
//    } catch {
 //     setSummary(null);
//    }
 // }, []);

  const values = useMemo(() => ({ nameOnCard, cardNumber, expDate, cvv }), [
    nameOnCard,
    cardNumber,
    expDate,
    cvv,
  ]);

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
    !getFieldError("expDate", values) &&
    !getFieldError("cvv", values);

  function handleSubmit() {
    setFormError("");

    setTouched({ nameOnCard: true, cardNumber: true, expDate: true, cvv: true });

    if (!validateAll()) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    alert(`Payment Successful ✅ (Demo) - Paid with ${method.toUpperCase()}`);
  }

  const handleBack = () => router.push("/subscription");

  return (
    <CommonLayout navbar={<Navigation />} >
      <div className="h-20" />

      <StepProgressBar
        currentStep={4}
        steps={[
          { id: "1", label: "Account" },
          { id: "2", label: "Business" },
          { id: "3", label: "Subscription" },
          { id: "4", label: "Checkout" },
        ]}
      />
    <GlassBackground>  
      <div className="px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl">

    <SplitPanelLayout
      showDivider
      left={
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">
            Payment Details
          </h2>

          <div className="space-y-6">
            {/* Card Type Selector */}
            <CardTypeSelector selected={method} onSelect={setMethod} />

            <InputField
              id="nameOnCard"
              name="nameOnCard"
              label="Name on Card"
              placeholder="Enter Name"
              required
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              onBlur={() => {
                markTouched("nameOnCard");
                validateField("nameOnCard");
              }}
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
              onChange={(e) =>
                setCardNumber(formatCardNumber(e.target.value))
              }
              onBlur={() => {
                markTouched("cardNumber");
                validateField("cardNumber");
              }}
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
                onChange={(e) =>
                  setExpDate(formatExpDate(e.target.value))
                }
                onBlur={() => {
                  markTouched("expDate");
                  validateField("expDate");
                }}
                error={touched.expDate ? errors.expDate : ""}
              />

              <InputField
                id="cvc"
                name="cvc"
                label="CVC Code"
                required
                type="password"
                inputMode="numeric"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCvv(formatCvc(e.target.value))}
                onBlur={() => {
                  markTouched("cvv");
                  validateField("cvv");
                }}
                error={touched.cvv ? errors.cvv : ""}
              />
            </div>

            {formError && <FormErrorMessage message={formError} />}

            <PrimaryButton
              className="w-full py-4 text-base"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Pay Now
            </PrimaryButton>
          </div>
        </div>
      }
      right={
        <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-xl">
          <h2 className="text-[28px] font-bold mb-6">
            Shipping Details
          </h2>

          {!summary ? (
            <div className="text-white/80 text-sm">
              Loading details...
            </div>
          ) : (
            <>
              <section className="space-y-1">
                <h3 className="text-lg font-semibold">
                  Customer Information
                </h3>
                <LineText>{summary.customer.name}</LineText>
                <LineText>{summary.customer.address}</LineText>
                <LineText>{summary.customer.email}</LineText>
              </section>

              <section className="mt-6 space-y-1">
                <h3 className="text-lg font-semibold">
                  Company Information
                </h3>
                <LineText>{summary.company.name}</LineText>
                <LineText>{summary.company.address}</LineText>
                <LineText>{summary.company.contact}</LineText>
                <LineText>{summary.company.email}</LineText>
              </section>

              <section className="mt-6 space-y-1">
                <h3 className="text-lg font-semibold">
                  Order Details
                </h3>
                <LineText>{summary.order.type}</LineText>
                <LineText>{summary.order.plan}</LineText>
                <LineText>{summary.order.branchesRemaining}</LineText>
                <LineText>{summary.order.email}</LineText>
              </section>

              <div className="mt-8 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {summary.currency} {summary.total}
                </span>
              </div>
            </>
          )}
        </div>
      }
    />
  </div>
</div>
</GlassBackground>
            <div className="mt-10 ml-50 flex justify-start text-white mb-20" >
              <button onClick={handleBack} className="font-semibold hover:opacity-80 cursor-pointer">
                {"< Back"}
              </button>
            </div>
    </CommonLayout>
  );
}
