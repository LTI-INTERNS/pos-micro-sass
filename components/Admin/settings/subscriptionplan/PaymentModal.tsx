"use client";

import { useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

export type PaymentPlan = {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
};

type Props = {
  open: boolean;
  plan: PaymentPlan | null;
  onClose: () => void;
  onSuccess?: (planId: string) => void;
};

type CardType = "visa" | "mastercard" | "amex" | "other";

function detectCardType(number: string): CardType {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "other";
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

const CARD_LABELS: Record<CardType, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  other: "",
};

export default function PaymentModal({ open, plan, onClose, onSuccess }: Props) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const cardType = detectCardType(cardNumber);

const validate = () => {
  const e: Record<string, string> = {};

  if (!cardHolder.trim()) e.cardHolder = "Cardholder name is required";

  const digits = cardNumber.replace(/\s/g, "");
  if (digits.length < 16) e.cardNumber = "Enter a valid 16-digit card number";

  const [mmStr, yyStr] = expiry.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);

  if (!expiry || expiry.length < 5 || mm < 1 || mm > 12) {
    e.expiry = "Enter a valid expiry (MM/YY)";
  } else {
    const now = new Date();
    const currentYear  = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const cardYear  = yy;
    const maxYear   = currentYear + 4;

    const isExpired =
      cardYear < currentYear ||
      (cardYear === currentYear && mm < currentMonth);

    const isTooFar = cardYear > maxYear ||
      (cardYear === maxYear && mm > currentMonth);

    if (isExpired) {
      e.expiry = "Card is expired";
    } else if (isTooFar) {
      e.expiry = "Expiry date cannot be more than 4 years from today";
    }
  }

  if (cvv.length < 3) e.cvv = "Enter a valid CVV";

  return e;
};
  const handlePay = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate API call
    setLoading(false);
    setPaid(true);
  };

  const handleClose = () => {
    setCardHolder(""); setCardNumber(""); setExpiry(""); setCvv("");
    setErrors({}); setPaid(false); setLoading(false);
    onClose();
  };

  const handleDone = () => {
    if (plan) onSuccess?.(plan.id);
    handleClose();
  };

  if (!plan) return null;

  return (
    <ModalShell
      open={open}
      title={paid ? "Payment Successful" : `Upgrade to ${plan.name} Plan`}
      onClose={handleClose}
      widthClassName="w-[520px] max-w-[94vw]"
    >
      {paid ? (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-gray-800 font-semibold text-base">
              You are now on the <span className="text-orange-500">{plan.name}</span> plan!
            </p>
            <p className="text-gray-400 text-xs">
              Your subscription of {plan.price}/{plan.billingCycle} is now active.
            </p>
          </div>
          <PopupActions
            actions={[{ label: "Done", onClick: handleDone, variant: "primary" }]}
          />
        </div>
      ) : (
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

          {/* Card Number */}
          <div className="space-y-1">
            <div className="relative">
              <FormField
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(v) => setCardNumber(formatCardNumber(v))}
                type="text"
              />
              {cardNumber && CARD_LABELS[cardType] && (
                <span className="absolute right-4 top-8 text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full pointer-events-none">
                  {CARD_LABELS[cardType]}
                </span>
              )}
            </div>
            {errors.cardNumber && <p className="text-xs text-red-400">{errors.cardNumber}</p>}
          </div>

          {/* Cardholder Name */}
          <div className="space-y-1">
            <FormField
              label="Cardholder Name"
              placeholder="Enter name as on card"
              value={cardHolder}
              onChange={setCardHolder}
              type="text"
            />
            {errors.cardHolder && <p className="text-xs text-red-400">{errors.cardHolder}</p>}
          </div>

          {/* Expiry + CVV row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <FormField
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiry}
                onChange={(v) => setExpiry(formatExpiry(v))}
                type="text"
              />
              {errors.expiry && <p className="text-xs text-red-400">{errors.expiry}</p>}
            </div>
            <div className="space-y-1">
              <FormField
                label="CVV"
                placeholder="•••"
                value={cvv}
                onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                type="password"
              />
              {errors.cvv && <p className="text-xs text-red-400">{errors.cvv}</p>}
            </div>
          </div>

          {/* Security note */}
          <p className="text-[11px] text-gray-400 text-center">
            🔒 Your payment is secured with 256-bit SSL encryption
          </p>

          <PopupActions
            actions={[
              { label: "Cancel", onClick: handleClose, variant: "secondary" },
              {
                label: loading ? "Processing..." : `Pay ${plan.price}`,
                onClick: handlePay,
                variant: "primary",
                disabled: loading,
              },
            ]}
          />
        </div>
      )}
    </ModalShell>
  );
}