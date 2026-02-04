"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Delete, Printer, Mail, Check, X } from "lucide-react";

import DiscountPopup, { DiscountOption } from "./DiscountPopup";

export type PaymentSummary = {
  orderNo: string | number;
  paymentMethod: string;
  currencyCode: string;

  baseAmount: number;
  discountPercent?: number;
  discountValue: number;

  cashPaid: number; // cash paid (gross)
  cardPaid: number; // card paid (gross, including tax)

  cardTaxRate: number;
  cardTax: number; // computed from cardPaid split OR remaining

  totalPaid: number; // cashPaid + cardPaid (gross)
  remainingToPay: number; // remaining NET amount (excluding card tax)
  changeToGive: number; // only for pure-cash flow

  grandTotal: number; // netDue + cardTaxApplied
};

type Props = {
  open: boolean;
  onClose: () => void;

  orderNo: string | number;

  tipAmount: number; // kept for compatibility, NOT used
  totalAmount: number; // Base amount

  currencyCode?: string; // default "LKR"

  onDone?: (summary: PaymentSummary) => void;
};

type ActiveField = "amount" | null;

function formatMoney(currency: string, amount: number) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safe.toFixed(2)}`;
}

function sanitizeAmountInput(raw: string) {
  let v = raw.replace(/[^0-9.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  if (v.startsWith(".")) v = "0" + v;

  if (v.length > 1 && v.startsWith("0") && v[1] !== ".") {
    v = v.replace(/^0+/, "");
    if (v === "") v = "0";
  }

  if (/^0+$/.test(v)) v = "0";

  return v;
}

function addWholeAmount(current: string, addBy: number) {
  const cur = parseFloat(current || "0");
  const next = cur + addBy;
  const hasDot = current.includes(".");
  return hasDot ? next.toFixed(2) : String(Math.trunc(next));
}

function handleKeypadValue(prev: string, key: string) {
  if (key === "⌫") return prev.slice(0, -1);
  if (key === "C") return "";
  if (key === "10" || key === "20") {
    return sanitizeAmountInput(addWholeAmount(prev, Number(key)));
  }
  if (key === ".") {
    if (prev.includes(".")) return prev;
    if (prev === "" || prev === "0") return "0.";
    return sanitizeAmountInput(prev + ".");
  }
  if (/^\d$/.test(key)) {
    return sanitizeAmountInput(prev + key);
  }
  return prev;
}

export default function OrderPaymentModal({
  open,
  onClose,
  orderNo,
  totalAmount,
  currencyCode = "LKR",
  onDone,
}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>("Cash");

  const [amountDraft, setAmountDraft] = useState<string>("");

  const [cashPaid, setCashPaid] = useState<number>(0);
  const [cardPaid, setCardPaid] = useState<number>(0); // gross (includes tax)

  const [amountFocused, setAmountFocused] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [cardTaxRate, setCardTaxRate] = useState<number>(0.03);

  const [discountOpen, setDiscountOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(null);

  // Auto-open discount popup once per modal open
  const [hasPromptedDiscount, setHasPromptedDiscount] = useState(false);

  // "nice animation" when value is auto-corrected
  const [amountNudge, setAmountNudge] = useState(false);

  const discountOptions: DiscountOption[] = useMemo(
    () => [
      { id: "disc_broccoli_staff", label: "Broccoli Staff (on total)", percent: 50 },
      { id: "disc_better_homes", label: "Better homes (on total)", percent: 50 },
      { id: "disc_fly_dubai", label: "Fly Dubai (on total)", percent: 50 },
    ],
    []
  );

  useEffect(() => {
    if (!open) {
      setHasPromptedDiscount(false);
      return;
    }

    if (!hasPromptedDiscount) {
      setDiscountOpen(true);
      setHasPromptedDiscount(true);
    }
  }, [open, hasPromptedDiscount]);

  const isCard = selectedMethod === "Visa" || selectedMethod === "Master";
  const showCardPercentages = isCard;

  // ✅ If user switches back to Cash, clear any suggested/corrected card value
  useEffect(() => {
    if (selectedMethod === "Cash") {
      setAmountDraft("");
      setAmountFocused(false);
      setActiveField(null);
      setAmountNudge(false);
      inputRef.current?.blur();
    }
  }, [selectedMethod]);

  const baseAmount = totalAmount;

  const selectedDiscount = useMemo(() => {
    if (!selectedDiscountId) return null;
    return discountOptions.find((o) => o.id === selectedDiscountId) ?? null;
  }, [selectedDiscountId, discountOptions]);

  const discountValue = useMemo(() => {
    if (!selectedDiscount) return 0;
    return baseAmount * (selectedDiscount.percent / 100);
  }, [selectedDiscount, baseAmount]);

  const netDue = useMemo(() => baseAmount - discountValue, [baseAmount, discountValue]);

  // ✅ IMPORTANT FIX:
  // Treat cardPaid as GROSS (includes tax). Only its BASE portion reduces the NET due.
  const cardBasePaid = useMemo(() => {
    if (cardPaid <= 0) return 0;
    const denom = 1 + cardTaxRate;
    if (denom <= 0) return cardPaid;
    return cardPaid / denom;
  }, [cardPaid, cardTaxRate]);

  const cardTaxApplied = useMemo(() => {
    const tax = cardPaid - cardBasePaid;
    return tax > 0 ? tax : 0;
  }, [cardPaid, cardBasePaid]);

  // NET remaining (excluding tax)
  const remainingNet = useMemo(() => netDue - (cashPaid + cardBasePaid), [netDue, cashPaid, cardBasePaid]);

  const remainingToPay = useMemo(() => (remainingNet > 0 ? remainingNet : 0), [remainingNet]);

  // If still remaining and card selected, the tax to apply on the remaining amount
  const remainingCardTax = useMemo(() => {
    if (!isCard) return 0;
    if (remainingToPay <= 0) return 0;
    return remainingToPay * cardTaxRate;
  }, [isCard, remainingToPay, cardTaxRate]);

  const totalRemainingWithTax = useMemo(() => {
    if (remainingToPay <= 0) return 0;
    return remainingToPay + remainingCardTax;
  }, [remainingToPay, remainingCardTax]);

  const totalPaid = useMemo(() => cashPaid + cardPaid, [cashPaid, cardPaid]);

  // ✅ Grand total should keep the card tax even after payment is completed
  const grandTotal = useMemo(() => netDue + cardTaxApplied, [netDue, cardTaxApplied]);

  // ✅ If card is involved, do not show (and do not compute) change-to-give
  // (Previously you saw change because the old math subtracted gross card payment from net due.)
  const cardInvolved = isCard || cardPaid > 0;
  const changeToGive = useMemo(() => {
    if (cardInvolved) return 0;
    return remainingNet < 0 ? -remainingNet : 0;
  }, [cardInvolved, remainingNet]);

  // Remaining to Pay visibility rule (your previous rule)
  const showRemainingToPay =
    remainingToPay > 0 && (Boolean(selectedDiscount) || (cashPaid > 0 && cashPaid < baseAmount));

  const showCurrencyInAmount = amountFocused;

  function commitCashOrCardPayment() {
    const n = parseFloat(amountDraft);
    if (!Number.isFinite(n) || n <= 0) return;

    if (isCard) {
      const maxAllowed = totalRemainingWithTax;

      // If nothing remaining, just clear the draft
      if (maxAllowed <= 0) {
        setAmountDraft("");
        return;
      }

      // ✅ No alert. Just suggest/correct + animate.
      if (n > maxAllowed) {
        const suggested = maxAllowed.toFixed(2);
        setAmountDraft(suggested);

        setAmountNudge(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        window.setTimeout(() => setAmountNudge(false), 420);
        return;
      }

      // Add gross card payment (includes tax)
      setCardPaid((p) => p + n);
    } else {
      setCashPaid((p) => p + n);
    }

    setAmountDraft("");
    setAmountFocused(false);
    setActiveField(null);

    // Unfocus input after Add
    inputRef.current?.blur();
  }

  const handleKeypadPress = (key: string) => {
    if (!activeField) return;

    if (key === "Add") {
      commitCashOrCardPayment();
      return;
    }

    inputRef.current?.focus();
    setAmountDraft((prev) => handleKeypadValue(prev, key));
  };

  function removeDiscount() {
    setSelectedDiscountId(null);
  }
  function resetCashPaid() {
    setCashPaid(0);
  }
  function resetCardPaid() {
    setCardPaid(0);
  }

  const amountLabel = isCard ? "Card payment received" : "Cash received";

  // Hide "Cash Paid" row when card selected AND cashPaid is 0.00
  const showCashPaidRow = !(isCard && cashPaid === 0);

  // Show card breakdown if any card amount exists, or if card selected and still remaining
  const showCardBreakdown = cardPaid > 0 || (isCard && remainingToPay > 0);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 px-6 z-50 flex justify-end bg-black/30">
        <div className="h-full w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold text-black leading-none">Order payment</h2>
              <p className="text-sm text-gray-400 mt-1">Order #{orderNo}</p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black text-xl leading-none mt-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Details section */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-2">
              {(() => {
                const ValueCell = ({
                  value,
                  showClear,
                  onClear,
                }: {
                  value: string;
                  showClear?: boolean;
                  onClear?: () => void;
                }) => (
                  <div className="flex items-center justify-end gap-3 min-w-[180px]">
                    <span className="font-semibold text-black tabular-nums">{value}</span>
                    <span className="w-5 h-5 grid place-items-center">
                      {showClear && onClear && (
                        <button
                          type="button"
                          onClick={onClear}
                          className="text-gray-500 hover:text-black"
                          aria-label="Clear"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </span>
                  </div>
                );

                return (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Base Amount</span>
                      <ValueCell value={formatMoney(currencyCode, baseAmount)} />
                    </div>

                    {/* Discount details ONLY when selected */}
                    {selectedDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Discount ({selectedDiscount.percent}%)
                        </span>
                        <ValueCell
                          value={`- ${formatMoney(currencyCode, discountValue)}`}
                          showClear
                          onClear={removeDiscount}
                        />
                      </div>
                    )}

                    {/* ✅ CASH MODE: Remaining to Pay above Cash Paid (same as before) */}
                    {!isCard && showRemainingToPay && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining to Pay</span>
                        <ValueCell value={formatMoney(currencyCode, remainingToPay)} />
                      </div>
                    )}

                    {/* Cash Paid (hidden when card selected and cash=0) */}
                    {showCashPaidRow && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cash Paid</span>
                        <ValueCell
                          value={formatMoney(currencyCode, cashPaid)}
                          showClear={cashPaid > 0}
                          onClear={resetCashPaid}
                        />
                      </div>
                    )}

                    {/* ✅ CARD MODE: Remaining to Pay must appear under Cash Paid */}
                    {isCard && showRemainingToPay && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining to Pay</span>
                        <ValueCell value={formatMoney(currencyCode, remainingToPay)} />
                      </div>
                    )}

                    {/* ✅ Change to give must NOT be visible when card involved (and now it won't compute either) */}
                    {!cardInvolved && changeToGive > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Change to Give</span>
                        <ValueCell value={formatMoney(currencyCode, changeToGive)} />
                      </div>
                    )}

                    {showCardBreakdown && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Card Tax ({Math.round(cardTaxRate * 100)}%)
                          </span>
                          {/* ✅ Keep tax even after fully paid */}
                          <ValueCell value={formatMoney(currencyCode, cardTaxApplied)} />
                        </div>

                        {remainingToPay > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total remaining with tax</span>
                            <ValueCell value={formatMoney(currencyCode, totalRemainingWithTax)} />
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Card Payment Received</span>
                          <ValueCell
                            value={formatMoney(currencyCode, cardPaid)}
                            showClear={cardPaid > 0}
                            onClear={resetCardPaid}
                          />
                        </div>
                      </>
                    )}

                    <div className="pt-3 border-t border-dashed flex justify-between text-sm">
                      <span className="font-semibold text-gray-600">Grand Total</span>
                      <span className="text-orange-500 font-semibold text-[16px] tabular-nums">
                        {formatMoney(currencyCode, grandTotal)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Payment method */}
            <div>
              <p className="mb-2 text-sm font-semibold text-black">Payment method</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Cash", src: "/Cash.png", alt: "Cash" },
                  { id: "Master", src: "/Master.png", alt: "Mastercard" },
                  { id: "Visa", src: "/Visa.png", alt: "Visa" },
                ].map((pm) => {
                  const isSelected = selectedMethod === pm.id;

                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedMethod(pm.id)}
                      className={`h-16 rounded-xl border-2 box-border flex items-center justify-center bg-white transition-all
                        ${isSelected ? "border-orange-500" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <Image
                        src={pm.src}
                        alt={pm.alt}
                        width={44}
                        height={44}
                        className="object-contain cursor-pointer"
                      />
                    </button>
                  );
                })}
              </div>

              {showCardPercentages && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { label: "3%", rate: 0.03 },
                    { label: "4%", rate: 0.04 },
                    { label: "5%", rate: 0.05 },
                  ].map(({ label, rate }) => {
                    const selected = cardTaxRate === rate;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setCardTaxRate(rate)}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        className={`h-7 rounded-lg border text-sm font-semibold transition-all duration-150
                          active:scale-90 active:bg-orange-50 cursor-pointer
                          ${
                            selected
                              ? "border-orange-500 text-orange-600 bg-orange-50"
                              : "border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inputs */}
            <div>
              <p className="mb-2 text-sm font-semibold text-black">
                Input amount ({amountLabel})
              </p>

              <div className="relative">
                {showCurrencyInAmount && (
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    {currencyCode}
                  </span>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="Input amount"
                  value={amountDraft}
                  onFocus={() => {
                    setAmountFocused(true);
                    setActiveField("amount");
                  }}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmountDraft(sanitizeAmountInput(e.target.value))}
                  className={`w-full h-14 rounded-full border border-gray-400 outline-none focus:border-orange-400
                    text-gray-600 font-semibold placeholder:text-gray-400 placeholder:font-normal
                    ${showCurrencyInAmount ? "text-left pl-20 pr-5" : "text-center px-5"}
                    ${amountNudge ? "shake" : ""}`}
                />
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-3 text-black">
              {[
                "1",
                "2",
                "3",
                "10",
                "4",
                "5",
                "6",
                "20",
                "7",
                "8",
                "9",
                "⌫",
                "C",
                "0",
                ".",
                "Add",
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  onClick={() => handleKeypadPress(key)}
                  className={`h-14 rounded-full text-lg font-bold transition-all active:scale-90 flex items-center justify-center cursor-pointer
                    ${
                      ["10", "20"].includes(key)
                        ? "bg-blue-50 text-blue-600"
                        : key === "C"
                        ? "bg-orange-50 text-orange-500"
                        : key === "⌫"
                        ? "bg-orange-50"
                        : key === "Add"
                        ? "bg-gray-100 text-gray-800 font-normal"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {key === "⌫" ? (
                    <Delete size={28} strokeWidth={2} color="#ffffff" fill="#f97316" />
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t flex gap-3">
            <button className="flex-1 h-14 rounded-xl bg-gray-900 text-white flex flex-col items-center justify-center gap-1 text-xs transition active:scale-95 cursor-pointer">
              <Printer size={18} />
              <span>Get receipt</span>
            </button>

            <button className="flex-1 h-14 rounded-xl bg-gray-900 text-white flex flex-col items-center justify-center gap-1 text-xs transition active:scale-95 cursor-pointer">
              <Mail size={18} />
              <span>Email</span>
            </button>

            <button
              onClick={() => {
                onDone?.({
                  orderNo,
                  paymentMethod: selectedMethod,
                  currencyCode,

                  baseAmount,
                  discountPercent: selectedDiscount?.percent,
                  discountValue,

                  cashPaid,
                  cardPaid,

                  cardTaxRate,
                  cardTax: cardTaxApplied,

                  totalPaid,
                  remainingToPay,
                  changeToGive,

                  grandTotal,
                });
                onClose();
              }}
              className="flex-1 h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white flex flex-col items-center justify-center gap-1 text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              <Check size={18} />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>

      <DiscountPopup
        open={discountOpen}
        options={discountOptions}
        value={selectedDiscountId}
        onClose={() => setDiscountOpen(false)}
        onApply={(selectedId) => {
          setSelectedDiscountId(selectedId);
          setDiscountOpen(false);
        }}
        title="Select discount"
      />

      {/* local CSS for "nice animation" */}
      <style jsx>{`
        .shake {
          animation: shake 420ms ease-in-out;
        }
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          18% {
            transform: translateX(-6px);
          }
          36% {
            transform: translateX(6px);
          }
          54% {
            transform: translateX(-4px);
          }
          72% {
            transform: translateX(4px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
