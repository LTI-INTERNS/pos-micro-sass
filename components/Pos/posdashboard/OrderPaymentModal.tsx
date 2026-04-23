"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Delete, Check, X } from "lucide-react";

import DiscountPopup, { DiscountOption } from "@/components/Pos/posdashboard/DiscountPopup";
import { apiClient } from "@/lib/api-client";

export type PaymentSummary = {
  orderNo: string | number;
  paymentMethod: string;
  currencyCode: string;

  baseAmount: number;
  discountId?: string | null;
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

  customer?: {
    customerId?: string;
    name: string;
    phoneNumber: string;
    email: string;
  } | null;
};

type Props = {
  open: boolean;
  onClose: () => void;

  orderNo: string | number;

  tipAmount: number; // kept for compatibility, NOT used
  totalAmount: number; // Base amount

  currencyCode?: string;

  onDone?: (summary: PaymentSummary) => void;

  // when coming back from confirmation, allow editing even if fully paid
  forceEditable?: boolean;

  // discount pre-selected from the order panel before reaching payment
  preSelectedDiscountId?: string | null;
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
  forceEditable = false,
  preSelectedDiscountId = null,
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

  // animation when value is auto-corrected
  const [amountNudge, setAmountNudge] = useState(false);

  // Remaining glow pulse (no bounce)
  const [remainingNudge, setRemainingNudge] = useState(false);

  // Done button pulse
  const [donePulse, setDonePulse] = useState(false);

  // remember last card type for split label
  const [lastCardMethod, setLastCardMethod] = useState<"Visa" | "Master" | null>(null);

  // Live discounts fetched from the backend for this branch
  const [discountOptions, setDiscountOptions] = useState<DiscountOption[]>([]);
  const [discountsLoading, setDiscountsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setDiscountsLoading(true);
    apiClient
      .get<Array<{ discountId: string; title: string; percentage: number; status: boolean; startDate: string; endDate: string }>>("/discounts")
      .then((res) => {
        const now = Date.now();
        const active = (Array.isArray(res.data) ? res.data : []).filter(
          (d) =>
            d.status === true &&
            new Date(d.startDate).getTime() <= now &&
            new Date(d.endDate).getTime() >= now
        );
        setDiscountOptions(
          active.map((d) => ({
            id: d.discountId,
            label: d.title,
            percent: Number(d.percentage),
          }))
        );
      })
      .catch(() => {
        // Non-fatal: discount popup will show empty; cashier can proceed without discount
        setDiscountOptions([]);
      })
      .finally(() => setDiscountsLoading(false));
  }, [open]);

  // rounding helpers
  const round2 = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
  const EPS = 0.005;

  function resetAll() {
    setSelectedMethod("Cash");
    setAmountDraft("");
    setCashPaid(0);
    setCardPaid(0);
    setCardTaxRate(0.03);

    setAmountFocused(false);
    setActiveField(null);

    setSelectedDiscountId(preSelectedDiscountId ?? null);
    setDiscountOptions([]);

    setDiscountOpen(false);
    setHasPromptedDiscount(false);

    setAmountNudge(false);
    setRemainingNudge(false);
    setDonePulse(false);

    setLastCardMethod(null);

    inputRef.current?.blur();
  }

  // Discount prompt only when opening (skip if cashier already picked one in the order panel)
  useEffect(() => {
    if (!open) return;

    if (!hasPromptedDiscount) {
      // Only auto-open discount popup if no discount was pre-selected in the order panel
      if (!preSelectedDiscountId) {
        setDiscountOpen(true);
      }
      setHasPromptedDiscount(true);
    }
  }, [open, hasPromptedDiscount, preSelectedDiscountId]);

  const isCard = selectedMethod === "Visa" || selectedMethod === "Master";
  const showCardPercentages = isCard;

  // When switching to Cash, clear draft focus (keep your behavior)
  useEffect(() => {
    if (selectedMethod === "Cash") {
      setAmountDraft("");
      setAmountFocused(false);
      setActiveField(null);
      setAmountNudge(false);
      inputRef.current?.blur();
    }
    if (selectedMethod === "Visa" || selectedMethod === "Master") {
      setLastCardMethod(selectedMethod);
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

  const cardBasePaid = useMemo(() => {
    if (cardPaid <= 0) return 0;
    const denom = 1 + cardTaxRate;
    if (denom <= 0) return round2(cardPaid);
    return round2(cardPaid / denom);
  }, [cardPaid, cardTaxRate]);

  const cardTaxApplied = useMemo(() => {
    const tax = round2(cardPaid - cardBasePaid);
    return tax > EPS ? tax : 0;
  }, [cardPaid, cardBasePaid]);

  const remainingNet = useMemo(() => {
    return round2(netDue - (cashPaid + cardBasePaid));
  }, [netDue, cashPaid, cardBasePaid]);

  const remainingToPay = useMemo(() => (remainingNet > EPS ? remainingNet : 0), [remainingNet]);

  const isFullyPaid = remainingToPay <= 0;

  //  IMPORTANT: lock only when fully paid AND NOT in forceEditable mode
  const lockInputs = isFullyPaid && !forceEditable;

  const lockCardConfig = cardPaid > EPS;

  const cashCoversBill = cashPaid > EPS && cardPaid <= EPS && remainingToPay <= 0;
  const cardCoversBill = cardPaid > EPS && remainingToPay <= 0;

  useEffect(() => {
    if (!open) return;
    if (!isFullyPaid) return;

    const tick = () => {
      setDonePulse(true);
      window.setTimeout(() => setDonePulse(false), 520);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [open, isFullyPaid]);

  const remainingCardTax = useMemo(() => {
    if (!isCard) return 0;
    if (remainingToPay <= 0) return 0;
    const t = round2(remainingToPay * cardTaxRate);
    return t > EPS ? t : 0;
  }, [isCard, remainingToPay, cardTaxRate]);

  const totalRemainingWithTax = useMemo(() => {
    if (remainingToPay <= 0) return 0;
    return round2(remainingToPay + remainingCardTax);
  }, [remainingToPay, remainingCardTax]);

  const totalPaid = useMemo(() => cashPaid + cardPaid, [cashPaid, cardPaid]);

  const grandTotal = useMemo(() => netDue + cardTaxApplied, [netDue, cardTaxApplied]);

  const cardInvolved = isCard || cardPaid > 0;
  const changeToGive = useMemo(() => {
    if (cardInvolved) return 0;
    return remainingNet < 0 ? -remainingNet : 0;
  }, [cardInvolved, remainingNet]);

  const showRemainingToPay =
    remainingToPay > 0 && (Boolean(selectedDiscount) || (cashPaid > 0 && cashPaid < baseAmount));

  const showCurrencyInAmount = amountFocused;

  function fireRemainingNudge() {
    setRemainingNudge(true);
    window.setTimeout(() => setRemainingNudge(false), 700);
  }

  function nudgeAmount() {
    setAmountNudge(true);
    requestAnimationFrame(() => inputRef.current?.focus());
    window.setTimeout(() => setAmountNudge(false), 420);
  }

  function enforceCardMinDraft(nextRaw: string) {
    if (!isCard) return nextRaw;
    if (totalRemainingWithTax <= 0) return nextRaw;
    if (lockInputs) return nextRaw;

    const n = parseFloat(nextRaw || "0");
    if (!Number.isFinite(n)) return nextRaw;

    if (n < totalRemainingWithTax) {
      nudgeAmount();
      return totalRemainingWithTax.toFixed(2);
    }
    return nextRaw;
  }

  useEffect(() => {
    if (!open) return;
    if (!isCard) return;
    if (lockInputs) return;

    if (totalRemainingWithTax > EPS) {
      setAmountDraft(totalRemainingWithTax.toFixed(2));
      setAmountFocused(true);
      setActiveField("amount");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, isCard, totalRemainingWithTax, lockInputs]);

  function commitCashOrCardPayment() {
    if (lockInputs) return;

    const n = parseFloat(amountDraft);
    if (!Number.isFinite(n) || n <= 0) return;

    if (isCard) {
      const maxAllowed = totalRemainingWithTax;

      if (maxAllowed <= 0) {
        setAmountDraft("");
        return;
      }

      if (n > maxAllowed) {
        const suggested = maxAllowed.toFixed(2);
        setAmountDraft(suggested);

        setAmountNudge(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        window.setTimeout(() => setAmountNudge(false), 420);
        return;
      }

      //  ensure they can’t pay less than suggested
      if (n < maxAllowed) {
        setAmountDraft(maxAllowed.toFixed(2));

        setAmountNudge(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        window.setTimeout(() => setAmountNudge(false), 420);
        return;
      }

      setCardPaid((p) => p + n);
    } else {
      setCashPaid((p) => p + n);
    }

    setAmountDraft("");
    setAmountFocused(false);
    setActiveField(null);
    inputRef.current?.blur();
  }

  const handleKeypadPress = (key: string) => {
    if (!activeField) return;
    if (lockInputs) return;

    if (key === "Add") {
      commitCashOrCardPayment();
      return;
    }

    inputRef.current?.focus();
    setAmountDraft((prev) => {
      const next = handleKeypadValue(prev, key);
      return enforceCardMinDraft(next);
    });
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

  const cardCoveredBill = cardPaid > 0 && remainingToPay <= 0;

  const showCashPaidRow = !(
    (isCard && cashPaid === 0) ||
    (!isCard && cardCoveredBill && cashPaid === 0)
  );

  const showCardBreakdown = cardPaid > 0 || (isCard && remainingToPay > 0);

  const cardTaxForDisplay = useMemo(() => {
    if (cardPaid > 0) return cardTaxApplied;
    if (isCard && remainingToPay > 0) return remainingCardTax;
    return 0;
  }, [cardPaid, cardTaxApplied, isCard, remainingToPay, remainingCardTax]);

  const paymentMethodLabel = useMemo(() => {
    const hasCash = cashPaid > EPS;
    const hasCard = cardPaid > EPS;

    const cardLabel =
      lastCardMethod ??
      (selectedMethod === "Visa" || selectedMethod === "Master" ? selectedMethod : null);

    if (hasCash && hasCard) return `Cash + ${cardLabel ?? "Card"}`;
    if (hasCard) return cardLabel ?? "Card";
    return "Cash";
  }, [cashPaid, cardPaid, lastCardMethod, selectedMethod]);

  return (
    <>
      <div
        className={`fixed inset-0 px-6 z-50 flex justify-end bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`h-full w-md bg-white shadow-xl flex flex-col transform transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold text-black leading-none">Order payment</h2>
              <p className="text-sm text-gray-400 mt-1">Order #{orderNo}</p>
            </div>

            <button
              onClick={() => {
                // X resets + closes
                resetAll();
                onClose();
              }}
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

                    {!isCard && showRemainingToPay && (
                      <div
                        className={`flex justify-between text-sm ${
                          remainingNudge ? "remaining-glow" : ""
                        }`}
                      >
                        <span className="text-gray-500">Remaining to Pay</span>
                        <ValueCell value={formatMoney(currencyCode, remainingToPay)} />
                      </div>
                    )}

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

                    {isCard && showRemainingToPay && (
                      <div
                        className={`flex justify-between text-sm ${
                          remainingNudge ? "remaining-glow" : ""
                        }`}
                      >
                        <span className="text-gray-500">Remaining to Pay</span>
                        <ValueCell value={formatMoney(currencyCode, remainingToPay)} />
                      </div>
                    )}

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
                          <ValueCell value={formatMoney(currencyCode, cardTaxForDisplay)} />
                        </div>

                        {isCard && remainingToPay > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Total remaining with tax
                            </span>
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

                  const disableThis =
                    (cashCoversBill && (pm.id === "Visa" || pm.id === "Master")) ||
                    (cardCoversBill &&
                      (pm.id === "Cash" ||
                        ((pm.id === "Visa" || pm.id === "Master") &&
                          pm.id !== selectedMethod))) ||
                    (lockCardConfig &&
                      (pm.id === "Visa" || pm.id === "Master") &&
                      pm.id !== selectedMethod);

                  return (
                    <button
                      key={pm.id}
                      type="button"
                      disabled={disableThis}
                      onClick={() => !disableThis && setSelectedMethod(pm.id)}
                      className={`h-16 rounded-xl border-2 box-border flex items-center justify-center bg-white transition-all
                        ${
                          isSelected ? "border-orange-500" : "border-gray-200 hover:border-gray-300"
                        }
                        ${disableThis ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
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
                    const disableTax = lockCardConfig;

                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={disableTax}
                        onClick={() => !disableTax && setCardTaxRate(rate)}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={(e) => e.preventDefault()}
                        className={`h-7 rounded-lg border text-sm font-semibold transition-all duration-150
                          active:scale-90 active:bg-orange-50 cursor-pointer
                          ${
                            selected
                              ? "border-orange-500 text-orange-600 bg-orange-50"
                              : "border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500"
                          }
                          ${disableTax ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
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
                    if (lockInputs) return;
                    setAmountFocused(true);
                    setActiveField("amount");
                  }}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => {
                    if (lockInputs) return;
                    const clean = sanitizeAmountInput(e.target.value);
                    setAmountDraft(enforceCardMinDraft(clean));
                  }}
                  className={`w-full h-14 rounded-full border border-gray-400 outline-none focus:border-orange-400
                    text-gray-600 font-semibold placeholder:text-gray-400 placeholder:font-normal
                    ${showCurrencyInAmount ? "text-left pl-20 pr-5" : "text-center px-5"}
                    ${amountNudge ? "shake" : ""} ${lockInputs ? "opacity-70" : ""}`}
                />
              </div>
            </div>

            {/* Keypad */}
            <div className={`grid grid-cols-4 gap-3 text-black ${lockInputs ? "opacity-70" : ""}`}>
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
                    } ${lockInputs ? "pointer-events-none" : ""}`}
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

          {/* Footer (only Done) */}
          <div className="px-5 py-4 border-t flex gap-3">
            <button
              onClick={() => {
                if (!isFullyPaid) {
                  fireRemainingNudge();
                  return;
                }

                onDone?.({
                  orderNo,
                  paymentMethod: paymentMethodLabel,
                  currencyCode,

                  baseAmount,
                  discountId: selectedDiscountId,
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
              className={`flex-1 h-14 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white flex flex-col items-center justify-center gap-1 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                donePulse ? "done-pulse" : ""
              }`}
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
        loading={discountsLoading}
        value={selectedDiscountId}
        onClose={() => setDiscountOpen(false)}
        onApply={(selectedId) => {
          setSelectedDiscountId(selectedId);
          setDiscountOpen(false);
        }}
        title="Select discount"
      />

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

        /*  glow only (no bounce/scale) */
        .remaining-glow {
          border-radius: 10px;
          padding: 10px 10px;
          margin: -6px -6px;
          background: rgba(249, 115, 22, 0.08);
          animation: remainingGlow 700ms ease-in-out;
        }
        @keyframes remainingGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
          40% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0.08),
              0 12px 30px rgba(249, 115, 22, 0.16);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        .done-pulse {
          animation: donePulse 520ms ease-in-out;
          box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.55);
        }
        @keyframes donePulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.55);
          }
          45% {
            transform: scale(1.03);
            box-shadow: 0 0 0 12px rgba(249, 115, 22, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }
      `}</style>
    </>
  );
}