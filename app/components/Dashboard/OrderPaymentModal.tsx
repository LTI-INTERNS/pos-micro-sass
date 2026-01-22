"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Delete, Printer, Mail, Check } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;

  orderNo: string | number;
  tipAmount: number;
  totalAmount: number;

  currencyCode?: string; // default "LKR"
};

type ActiveField = "amount" | "tip" | null;

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
  return current.includes(".") ? next.toFixed(2) : String(Math.trunc(next));
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
  tipAmount,
  totalAmount,
  currencyCode = "LKR",
}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<string>("Cash");

  const [amount, setAmount] = useState<string>("");
  const [tipInput, setTipInput] = useState<string>("");

  const [amountFocused, setAmountFocused] = useState(false);
  const [tipFocused, setTipFocused] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const tipInputRef = useRef<HTMLInputElement | null>(null);

  const tipText = useMemo(
    () => formatMoney(currencyCode, tipAmount),
    [currencyCode, tipAmount]
  );
  const totalText = useMemo(
    () => formatMoney(currencyCode, totalAmount),
    [currencyCode, totalAmount]
  );

  const isCash = selectedMethod === "Cash";
  const showCurrencyInInput = isCash && amountFocused;

  const showCardPercentages =
    selectedMethod === "Visa" || selectedMethod === "Master";

  const handleKeypadPress = (key: string) => {
    if (!activeField) return;

    if (activeField === "amount") {
      inputRef.current?.focus();
      setAmount((prev) => handleKeypadValue(prev, key));
    }

    if (activeField === "tip") {
      tipInputRef.current?.focus();
      setTipInput((prev) => handleKeypadValue(prev, key));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-[420px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-black leading-none">
              Order payment
            </h2>
            <p className="text-sm text-gray-400 mt-1">Order #{orderNo}</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl leading-none mt-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Amount summary */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tip Amount</span>
              <span className="font-semibold text-black">{tipText}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-orange-500 font-semibold">{totalText}</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="mb-2 text-sm font-semibold text-black">
              Payment method
            </p>

            <div className="grid grid-cols-4 gap-3">
              {[
                { id: "Cash", src: "/Cash.png", alt: "Cash" },
                { id: "Master", src: "/Master.png", alt: "Mastercard" },
                { id: "Visa", src: "/Visa.png", alt: "Visa" },
                { id: "GiftCard", src: "/GiftCard.png", alt: "Gift card" },
              ].map((pm) => {
                const isSelected = selectedMethod === pm.id;

                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(pm.id);

                      if (pm.id !== "Cash") {
                        setAmountFocused(false);
                        setTipFocused(false);
                        setActiveField(null);
                      }
                    }}
                    className={`h-14 rounded-xl border-2 box-border
                      flex items-center justify-center bg-white transition-all
                      ${
                        isSelected
                          ? "border-orange-500"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <Image
                      src={pm.src}
                      alt={pm.alt}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </button>
                );
              })}
            </div>

            {/* Card percentage buttons (Visa / Master only) */}
            {showCardPercentages && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {["3%", "4%", "5%"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                      className="h-7 rounded-lg border border-gray-300
                                text-sm font-semibold text-gray-700
                                transition-all duration-150
                                hover:border-orange-400 hover:text-orange-500
                                active:scale-90 active:bg-orange-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Inputs (Cash only) */}
          {isCash && (
            <div>
              <p className="mb-2 text-sm font-semibold text-black">
                Input amount
              </p>

              <div className="relative">
                {showCurrencyInInput && (
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    {currencyCode}
                  </span>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="Input amount"
                  value={amount}
                  onFocus={() => {
                    setAmountFocused(true);
                    setTipFocused(false);
                    setActiveField("amount");
                  }}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(sanitizeAmountInput(e.target.value))}
                  className={`w-full h-14 rounded-full border border-gray-400 outline-none focus:border-orange-400
                    text-gray-600 font-semibold placeholder:text-gray-400 placeholder:font-normal
                    ${
                      showCurrencyInInput
                        ? "text-left pl-20 pr-5"
                        : "text-center px-5"
                    }
                  `}
                />
              </div>

              <p className="mt-4 mb-2 text-sm font-semibold text-black">
                Tip amount
              </p>

              <div className="relative">
                {tipFocused && (
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    {currencyCode}
                  </span>
                )}

                <input
                  ref={tipInputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="Tip amount"
                  value={tipInput}
                  onFocus={() => {
                    setTipFocused(true);
                    setAmountFocused(false);
                    setActiveField("tip");
                  }}
                  onBlur={() => setTipFocused(false)}
                  onChange={(e) =>
                    setTipInput(sanitizeAmountInput(e.target.value))
                  }
                  className={`w-full h-14 rounded-full border border-gray-400 outline-none focus:border-orange-400
                    text-gray-600 font-semibold placeholder:text-gray-400 placeholder:font-normal
                    ${
                      tipFocused
                        ? "text-left pl-20 pr-5"
                        : "text-center px-5"
                    }
                  `}
                />
              </div>
            </div>
          )}

          {/* Keypad (ONLY for Cash) */}
          {isCash && (
            <div className="grid grid-cols-4 gap-3 text-black">
              {[
                "1", "2", "3", "10",
                "4", "5", "6", "20",
                "7", "8", "9", "⌫",
                "C", "0", ".", "Add",
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  onClick={() => handleKeypadPress(key)}
                  className={`h-14 rounded-full text-lg font-bold transition-all active:scale-90 flex items-center justify-center
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
                    }
                  `}
                >
                  {key === "⌫" ? (
                    <Delete
                      size={28}
                      strokeWidth={2}
                      color="#ffffff"
                      fill="#f97316"
                    />
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex gap-3">
          <button
            className="flex-1 h-14 rounded-xl bg-gray-900 text-white
                       flex flex-col items-center justify-center gap-1
                       text-xs transition active:scale-95"
          >
            <Printer size={18} />
            <span>Gift receipt</span>
          </button>

          <button
            className="flex-1 h-14 rounded-xl bg-gray-900 text-white
                       flex flex-col items-center justify-center gap-1
                       text-xs transition active:scale-95"
          >
            <Mail size={18} />
            <span>Email</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 h-14 rounded-xl
                       bg-gradient-to-r from-orange-400 to-pink-500
                       text-white
                       flex flex-col items-center justify-center gap-1
                       text-xs font-semibold transition active:scale-95"
          >
            <Check size={18} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
