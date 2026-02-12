"use client";

import { useMemo, useState } from "react";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField } from "@/app/components/saas/common/FormFields";

type PaymentMethod = "card" | "bank";

export default function PaymentProcessPage() {
  const [method, setMethod] = useState<PaymentMethod>("card");

  const [nameOnCard, setNameOnCard] = useState("John Smith");
  const [cardNumber, setCardNumber] = useState("0000-0000-0000-0000");
  const [expDate, setExpDate] = useState("12/25");
  const [cvv, setCvv] = useState("123");

  const summary = useMemo(
    () => ({
      company: {
        name: "Company Name",
        address: "No 12, Main Street, Colombo",
        email: "company@gmail.com",
        contact: "+94 77 123 4567",
      },
      order: {
        plan: "Pro Plan (Monthly)",
        branches: 3,
        users: 10,
      },
      total: 1000,
      currency: "$",
    }),
    []
  );

  return (
    <GlassBackground backgroundImage="/saasbg.png" showFrame={false}>
      <div className="w-full px-4 sm:px-8 py-10">
        {/* Header + Stepper */}
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4">

          </div>

          {/* Main white card */}
          <div className="mt-10 rounded-2xl bg-white shadow-2xl">
            <div className="px-6 sm:px-10 py-10">
              <SplitPanelLayout
                showDivider
                leftClassName="!p-0 !pr-8"
                rightClassName="!p-0 !pl-8"
                left={
                  <div className="w-full">
                    {/* Payment Details */}
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-black">Payment Details</h2>
                    </div>

                    {/* Method cards */}
                    <div className="mt-6 flex gap-4">
                      <PayMethodCard
                        title="Card Payment"
                        selected={method === "card"}
                        onClick={() => setMethod("card")}
                      />
                      <PayMethodCard
                        title="Bank Transfer"
                        selected={method === "bank"}
                        onClick={() => setMethod("bank")}
                      />
                    </div>

                    {/* Form */}
                    <div className="mt-8 space-y-5">
                      <InputField
                        label="Name on Card"
                        variant="solid"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                      />
                      <InputField
                        label="Card Number"
                        variant="solid"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Exp. Date"
                          variant="solid"
                          value={expDate}
                          onChange={(e) => setExpDate(e.target.value)}
                        />
                        <InputField
                          label="CVV"
                          variant="solid"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>

                      {/* Total */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xl font-bold text-black">Total</div>
                        <div className="text-2xl font-bold text-black">
                          {summary.currency} {summary.total}
                        </div>
                      </div>

                      {/* Pay Now */}
                      <PrimaryButton
                        className="w-full py-4 text-base"
                        onClick={() => alert("Pay Now (demo) ✅")}
                      >
                        Pay Now
                      </PrimaryButton>

                      <p className="text-xs text-black/50 text-center">
                        By continuing, you agree to the payment terms.
                      </p>
                    </div>
                  </div>
                }
                right={
                  <div className="w-full">
                    {/* Shipping Details (title from your JSON is 32px) */}
                    <h2 className="text-3xl font-bold text-black">Shipping Details</h2>

                    {/* Company Information */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-black">Company Information</h3>

                      <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5 space-y-2">
                        <Row label="Company" value={summary.company.name} />
                        <Row label="Address" value={summary.company.address} />
                        <Row label="Email" value={summary.company.email} />
                        <Row label="Contact" value={summary.company.contact} />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-black">Order Details</h3>

                      <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5 space-y-2">
                        <Row label="Plan" value={summary.order.plan} />
                        <Row label="Branches" value={`${summary.order.branches}`} />
                        <Row label="Users" value={`${summary.order.users}`} />
                        <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between">
                          <span className="text-sm font-semibold text-black">Total</span>
                          <span className="text-sm font-bold text-black">
                            {summary.currency} {summary.total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Small helper */}
                    <div className="mt-8 text-xs text-black/50">
                      Need help? Contact support at{" "}
                      <span className="font-semibold text-black/70">
                        info@lankatechinnovations.com
                      </span>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </GlassBackground>
  );
}



function PayMethodCard({
  title,
  selected,
  onClick,
}: {
  title: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 rounded-2xl border p-4 text-left transition",
        selected ? "border-orange-500 bg-orange-500/10" : "border-black/10 bg-white",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-black">{title}</span>
        <span
          className={[
            "h-4 w-4 rounded-full border",
            selected ? "border-orange-500 bg-orange-500" : "border-black/20 bg-white",
          ].join(" ")}
        />
      </div>
      <p className="mt-2 text-sm text-black/50">
        {title === "Card Payment"
          ? "Visa, MasterCard, AMEX supported."
          : "Manual verification may take time."}
      </p>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="text-sm font-semibold text-black/60">{label}</div>
      <div className="text-sm text-black text-right">{value}</div>
    </div>
  );
}
