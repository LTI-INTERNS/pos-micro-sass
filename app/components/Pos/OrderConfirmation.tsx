"use client";

import React, { useState, useEffect } from "react";
import Buttons from "../Admin/common/ActionButton";
import type { PaymentSummary } from "./posdashboard/OrderPaymentModal";
import { useCurrency } from "@/app/context/CurrencyContext";
import { Mail, X } from "lucide-react";

import OrderSummaryContent, {
  PaymentIcons,
  type CommonPaymentSummary,
  type CommonOrderItem,
} from "./OrderSummaryContent";

import FormField from "../Admin/common/FormField";
import PopupActions from "../Admin/common/PopupActions";

export type ConfirmItem = CommonOrderItem;

type Props = {
  open: boolean;
  onClose: () => void;
  items: ConfirmItem[];
  payment: PaymentSummary;
  customerEmail?: string | null;
  onCancelEdit?: () => void;
  onConfirm?: (email?: string) => void;
};

export default function OrderConfirmation({
  open,
  onClose,
  items,
  payment,
  customerEmail,
  onCancelEdit,
  onConfirm,
}: Props) {
  const { currency } = useCurrency();

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [manualEmail, setManualEmail] = useState<string>("");
  const [addedEmail, setAddedEmail] = useState<string>("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (open) {
      const initial = customerEmail?.trim() || "";
      setAddedEmail(initial);
      setManualEmail(initial);
      setEmailError("");
      setShowEmailPopup(false);
    }
  }, [customerEmail, open]);

  if (!open) return null;

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleAddEmail() {
    const trimmed = manualEmail.trim();
    if (!validateEmail(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setAddedEmail(trimmed);
    setEmailError("");
    setShowEmailPopup(false);
  }

  function handleCancelPopup() {
    setManualEmail(addedEmail);
    setEmailError("");
    setShowEmailPopup(false);
  }

  const effectiveEmail = addedEmail || payment.customer?.email || undefined;

  const commonPayment: CommonPaymentSummary = {
    orderNo: payment.orderNo,
    currencyCode: payment.currencyCode ?? currency ?? "LKR",
    discountValue: payment.discountValue,
    cardTax: payment.cardTax,
    grandTotal: payment.grandTotal,
    paymentMethod: payment.paymentMethod,
    cashPaid: payment.cashPaid,
    cardPaid: payment.cardPaid,
    
    customer: payment.customer
      ? { ...payment.customer, email: effectiveEmail ?? payment.customer.email }
      : null,
    customerEmail: effectiveEmail,
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl p-8 space-y-8 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="mb-4 -mt-6">
          <OrderSummaryContent
            title="Order confirmation"
            subtitle="Please confirm the order below to completed payment"
            orderNoLabel={payment.orderNo}
            items={items}
            payment={commonPayment}
            leftBlock={
              <div className="border rounded-xl p-4 bg-slate-50 h-full flex flex-col">
                <h3 className="font-semibold mb-2 text-black">NOTES</h3>
                <textarea
                  placeholder="Add a note for this order (Optional)"
                  className="flex-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
            }
            rightAction={
              addedEmail ? (
                <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer">
                  <Mail size={16} />
                  <span>Email</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowEmailPopup(true)}
                  className="flex-1 h-12 rounded-xl border border-orange-400 text-orange-500 flex items-center justify-center gap-2 text-xs transition active:scale-95 cursor-pointer hover:bg-orange-50"
                >
                  <Mail size={16} />
                  <span>Add Email</span>
                </button>
              )
            }
          />
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              <p className="text-sm text-slate-500">Payment method</p>
              <div className="flex items-center gap-3">
                <PaymentIcons paymentMethod={payment.paymentMethod} />
                <p className="font-medium text-black">{payment.paymentMethod}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 w-full max-w-md ml-auto">
              <Buttons
                label="Cancel"
                onClick={() => {
                  onClose();
                  onCancelEdit?.();
                }}
                className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"
              />
              <Buttons
                label="confirm"
                variant="primary"
                onClick={() => onConfirm?.(effectiveEmail)}
                className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"
              />
            </div>
          </div>
        </div>
      </div>

      {showEmailPopup && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-black">Add Customer Email</h3>

            <FormField
              label="Email"
              type="email"
              value={manualEmail}
              onChange={(next) => setManualEmail(next)}
              placeholder="Enter email address"
            />

            {emailError && <p className="text-xs text-red-500">{emailError}</p>}

            <PopupActions
              actions={[
                { label: "Cancel", onClick: handleCancelPopup, variant: "secondary" },
                { label: "Add", onClick: handleAddEmail, variant: "primary" },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}