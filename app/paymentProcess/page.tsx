"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Card from "@/app/components/saas/common/formCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField, FormErrorMessage } from "@/app/components/saas/common/FormFields";
import Navbar from "@/app/components/saas/common/Navbar";

import { tempCheckoutData } from "@/app/components/saas/paymentProcess/tempCheckoutData";

type PaymentMethod = "mastercard" | "visa";

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

export default function PaymentProcessPage() {
  const router = useRouter();

  const [method, setMethod] = useState<PaymentMethod>("mastercard");

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

    alert("Payment Successful ✅ (Demo)");
  }

  const handleBack = () => router.push("/subscriptionPlan");

  return (
    <CommonLayout
      navbar={
        <Navbar
          middleContent={
            <span className="text-white font-semibold">
              Micro-saas Registration Dashboard
            </span>
          }
          rightContent={
            <button
              type="button"
              className="rounded-full bg-orange-500 px-6 py-2 text-white font-semibold"
            >
              Log Out
            </button>
          }
        />
      }
    >
      <div className="relative">
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 pt-24 pb-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <Card variant="glass" padding="lg" className="w-full">
              <div className="flex flex-col md:flex-row items-stretch gap-10">
                {/* LEFT */}
                <div className="w-full md:w-[417px]">
                  <h2 className="text-2xl font-bold text-white">Payment Details</h2>

                  <div className="mt-8 space-y-6">
                    <InputField
                      id="nameOnCard"
                      name="nameOnCard"
                      label="Name on Card"
                      required
                      variant="solid"
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
                      variant="solid"
                      inputMode="numeric"
                      placeholder="0000-0000-0000-0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
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
                        variant="solid"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={expDate}
                        onChange={(e) => setExpDate(formatExpDate(e.target.value))}
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
                        variant="solid"
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

                {/* DIVIDER */}
                <div className="hidden md:flex items-center">
                  <div className="h-full w-1 bg-[#B0B0B0]/80 rounded-full" />
                </div>

                {/* RIGHT (dynamic) */}
                <div className="w-full md:flex-1">
                  <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-2xl">
                    <h2 className="text-[32px] leading-tight font-bold">
                      Shipping Details
                    </h2>

                    {!summary ? (
                      <div className="mt-8 text-white/80 text-sm">
                        Loading details...
                      </div>
                    ) : (
                      <>
                        <section className="mt-8">
                          <h3 className="text-[20px] font-bold">
                            Customer Information
                          </h3>
                          <div className="mt-4 space-y-1 text-[16px] opacity-95">
                            <LineText>{summary.customer.name}</LineText>
                            <LineText>{summary.customer.address}</LineText>
                            <LineText>{summary.customer.email}</LineText>
                          </div>
                        </section>

                        <section className="mt-7">
                          <h3 className="text-[20px] font-bold">
                            Company Information
                          </h3>
                          <div className="mt-4 space-y-1 text-[16px] opacity-95">
                            <LineText>{summary.company.name}</LineText>
                            <LineText>{summary.company.address}</LineText>
                            <LineText>{summary.company.contact}</LineText>
                            <LineText>{summary.company.email}</LineText>
                          </div>
                        </section>

                        <section className="mt-7">
                          <h3 className="text-[20px] font-bold">Order Details</h3>
                          <div className="mt-4 space-y-1 text-[16px] opacity-95">
                            <LineText>{summary.order.type}</LineText>
                            <LineText>{summary.order.plan}</LineText>
                            <LineText>{summary.order.branchesRemaining}</LineText>
                            <LineText>{summary.order.email}</LineText>
                          </div>
                        </section>

                        <div className="mt-10 flex items-center justify-between">
                          <span className="text-[20px] font-bold">Total</span>
                          <span className="text-[20px] font-bold">
                            {summary.currency} {summary.total}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Bottom nav */}
            <div className="mt-10 flex justify-start text-white">
              <button onClick={handleBack} className="font-semibold hover:opacity-80">
                {"< Back"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
