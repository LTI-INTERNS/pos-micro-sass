"use client";

import { useMemo, useState } from "react";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import Card from "@/app/components/saas/common/formCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField } from "@/app/components/saas/common/FormFields";
import Navbar from "@/app/components/saas/common/Navbar";
import Footer from "@/app/components/saas/common/Footer";

type PaymentMethod = "mastercard" | "visa";

export default function PaymentProcessPage() {
  const [method, setMethod] = useState<PaymentMethod>("mastercard");

  const [nameOnCard, setNameOnCard] = useState("John Smith");
  const [cardNumber, setCardNumber] = useState("0000-0000-0000-0000");
  const [expDate, setExpDate] = useState("mm/dd");
  const [cvv, setCvv] = useState("000");

const summary = useMemo(
  () => ({
    customer: {
      name: "Nimal Perera",
      address: "No. 45, Galle Road, Dehiwala, Sri Lanka",
      email: "nimal.perera@gmail.com",
    },
    company: {
      name: "Perera Retail (Pvt) Ltd",
      address: "128 High Level Road, Nugegoda, Sri Lanka",
      contact: "+94 77 456 7890",
      email: "info@pereraretail.lk",
    },
    order: {
      type: "Retail Business",
      plan: "Pro Plan – Monthly",
      branchesRemaining: "3 Branches",
      email: "billing@pereraretail.lk",
    },
    total: 1000,
    currency: "$",
  }),
  []
);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar (like screenshot) */}
      <Navbar
        middleContent={
          <span className="text-white font-semibold">
            Micro-saas Registration Dashboard
          </span>
        }
        rightContent={
          <button className="rounded-full bg-orange-500 px-6 py-2 text-white font-semibold hover:brightness-110">
            Log Out
          </button>
        }
      />

      {/* Page Background */}
      <main className="flex-1">
        <GlassBackground
          backgroundImage="/saasbg.png"
          showFrame={false}
          constrained={false}
          className="pt-24 pb-10"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            {/* Main Glass Container */}
            <Card
              variant="glass"
              padding="lg"
              radius="2xl"
              elevation="lg"
              className="w-full"
            >
              <div className="flex flex-col md:flex-row items-stretch gap-10">
                {/* LEFT - Payment Details */}
                <div className="w-full md:w-[417px]">
                  <h2 className="text-2xl font-bold text-white">
                    Payment Details
                  </h2>

                  {/* Payment Logos row (like screenshot) */}
                  <div className="mt-8 flex gap-6 justify-center md:justify-start">
                    <PaymentLogoButton
                      label="MasterCard"
                      selected={method === "mastercard"}
                      onClick={() => setMethod("mastercard")}
                    >
                      {/* Simple MasterCard circles (no external asset needed) */}
                      <div className="relative h-6 w-12">
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-red-500/90" />
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-yellow-400/90 mix-blend-screen" />
                      </div>
                    </PaymentLogoButton>

                    <PaymentLogoButton
                      label="VISA"
                      selected={method === "visa"}
                      onClick={() => setMethod("visa")}
                    >
                      <span className="text-blue-600 font-extrabold tracking-widest">
                        VISA
                      </span>
                    </PaymentLogoButton>
                  </div>

                  {/* Form */}
                  <div className="mt-8 space-y-6">
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

                    <div className="grid grid-cols-2 gap-5">
                      <InputField
                        label="Valid Through"
                        variant="solid"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                      />
                      <InputField
                        label="CVC Code"
                        variant="solid"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>

                    <PrimaryButton
                      className="w-full py-4 text-base"
                      onClick={() => alert("Pay Now (demo) ✅")}
                    >
                      Pay Now
                    </PrimaryButton>
                  </div>
                </div>

                {/* CENTER DIVIDER (matches JSON: 4px, rgb(176,176,176)) */}
                <div className="hidden md:flex items-center">
                  <div className="h-full w-1 bg-[#B0B0B0]/80 rounded-full" />
                </div>

                {/* RIGHT - Shipping Details Orange Panel */}
                <div className="w-full md:flex-1">
                  <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-2xl">
                    <h2 className="text-[32px] leading-tight font-bold">
                      Shipping Details
                    </h2>

                    {/* Customer Information */}
                    <section className="mt-8">
                      <h3 className="text-[20px] font-bold">
                        Customer Information
                      </h3>
                      <div className="mt-4 space-y-1 text-[16px] font-normal opacity-95">
                        <LineText>{summary.customer.name}</LineText>
                        <LineText>{summary.customer.address}</LineText>
                        <LineText>{summary.customer.email}</LineText>
                      </div>
                    </section>

                    {/* Company Information */}
                    <section className="mt-7">
                      <h3 className="text-[20px] font-bold">
                        Company Information
                      </h3>
                      <div className="mt-4 space-y-1 text-[16px] font-normal opacity-95">
                        <LineText>{summary.company.name}</LineText>
                        <LineText>{summary.company.address}</LineText>
                        <LineText>{summary.company.contact}</LineText>
                        <LineText>{summary.company.email}</LineText>
                      </div>
                    </section>

                    {/* Order Details */}
                    <section className="mt-7">
                      <h3 className="text-[20px] font-bold">Order Details</h3>
                      <div className="mt-4 space-y-1 text-[16px] font-normal opacity-95">
                        <LineText>{summary.order.type}</LineText>
                        <LineText>{summary.order.plan}</LineText>
                        <LineText>{summary.order.branchesRemaining}</LineText>
                        <LineText>{summary.order.email}</LineText>
                      </div>
                    </section>

                    {/* Total Row */}
                    <div className="mt-10 flex items-center justify-between">
                      <span className="text-[20px] font-bold">Total</span>
                      <span className="text-[20px] font-bold">
                        {summary.currency} {summary.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bottom nav (< Back / Next>) like JSON */}
            <div className="mt-10 flex items-center justify-center">
              <div className="flex w-full max-w-xl items-center justify-between text-white">
                <button className="font-semibold hover:opacity-80">
                  {"< Back"}
                </button>
                <button className="font-semibold hover:opacity-80">
                  {"Next>"}
                </button>
              </div>
            </div>
          </div>
        </GlassBackground>
      </main>

      {/* Footer (like screenshot) */}
      <Footer />
    </div>
  );
}

function PaymentLogoButton({
  children,
  selected,
  onClick,
  label,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        "h-12 w-28 rounded-xl flex items-center justify-center",
        "bg-white/95",
        "transition",
        selected ? "ring-2 ring-orange-400" : "ring-1 ring-black/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LineText({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}
