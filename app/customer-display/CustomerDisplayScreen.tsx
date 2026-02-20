"use client";

import { useState, useCallback } from "react";
import { usePosChannel, PosMessage } from "@/app/hooks/usePosChannel";
import { CustomerFormValues } from "@/app/components/Admin/common/AddCustomerModal";
import { OrderItem } from "@/app/components/Pos/posdashboard/CustomerInfoPanel";
import { PaymentSummary } from "@/app/components/Pos/posdashboard/OrderPaymentModal";
import { useCurrency } from "@/app/context/CurrencyContext";
import { useImage } from "@/app/context/ImageContext";
import Image from "next/image";
import { Delete, CheckCircle, Clock, MonitorOff } from "lucide-react";

const customers = [
  { id: 1, name: "Kavindu Madushan", phone: "083894771983", email: "KavinduMadushan@mail.com" },
  { id: 2, name: "Manuga Dewhan",    phone: "081829748835", email: "ManugaDewhan@mail.com" },
  { id: 3, name: "Malsha Ashen",     phone: "0773760818",   email: "MalshaAshen@mail.com" },
];

function findCustomerByPhone(phone: string): CustomerFormValues | null {
  const found = customers.find((c) => c.phone === phone.trim());
  if (!found) return null;
  return { name: found.name, phoneNumber: found.phone, email: found.email };
}

function fmt(currency: string, amount: number) {
  return `${currency} ${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

type Screen = "dialpad" | "customer" | "billing" | "payment_preview" | "payment_success";

export default function CustomerDisplayScreen() {
  const { currency } = useCurrency();
  const { backgroundImage } = useImage();

  const [screen, setScreen] = useState<Screen>("dialpad");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<CustomerFormValues | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);

  // Feature enabled/disabled driven by the settings toggle via BroadcastChannel
  const [featureEnabled, setFeatureEnabled] = useState(true);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  const handleMessage = useCallback(
    (msg: PosMessage) => {
      switch (msg.type) {
        case "FEATURE_TOGGLE":
          setFeatureEnabled(msg.enabled);
          // Reset to dialpad when disabled
          if (!msg.enabled) {
            setScreen("dialpad");
            setPhone("");
            setError("");
            setCustomer(null);
            setItems([]);
            setSubtotal(0);
            setTotal(0);
            setPaymentSummary(null);
          }
          break;
        case "CUSTOMER_SELECTED":
          setCustomer(msg.customer);
          setScreen("customer");
          break;
        case "CUSTOMER_CLEARED":
          setCustomer(null);
          setScreen("dialpad");
          setPhone("");
          setError("");
          setPaymentSummary(null);
          break;
        case "ORDER_UPDATED":
          setItems(msg.items);
          setSubtotal(msg.subtotal);
          setTotal(msg.total);
          if (msg.items.length > 0) setScreen("billing");
          break;
        case "ORDER_CLEARED":
          setItems([]);
          setSubtotal(0);
          setTotal(0);
          setPaymentSummary(null);
          setScreen(customer ? "customer" : "dialpad");
          break;
        case "PAYMENT_SUMMARY":
          setPaymentSummary(msg.summary);
          setScreen("payment_preview");
          break;
        case "ORDER_CONFIRMED":
          setScreen("payment_success");
          break;
        case "PAYMENT_DONE":
          setScreen("payment_success");
          break;
      }
    },
    [customer]
  );

  const { send } = usePosChannel(handleMessage);

  const handleKey = (key: string) => {
    setError("");
    if (phone.length >= 12) return;
    setPhone((p) => p + key);
  };
  const handleBackspace = () => { setError(""); setPhone((p) => p.slice(0, -1)); };
  const handleClear = () => { setError(""); setPhone(""); };
  const handleConfirm = () => {
    if (phone.length < 7) { setError("Enter a valid phone number"); return; }
    const found = findCustomerByPhone(phone);
    if (found) {
      setCustomer(found);
      setScreen("customer");
      send({ type: "CUSTOMER_SELECTED", customer: found });
    } else {
      setError("No customer found with this number.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <Image
        src={backgroundImage || "/backgrounds/mount.png"}
        alt="bg" fill priority className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Feature disabled screen */}
        {!featureEnabled && <DisabledScreen />}

        {featureEnabled && (
          <>
            {screen === "dialpad" && (
              <DialpadScreen
                phone={phone} error={error}
                onKey={handleKey} onBackspace={handleBackspace}
                onClear={handleClear} onConfirm={handleConfirm}
              />
            )}
            {screen === "customer" && customer && (
              <CustomerScreen customer={customer} />
            )}
            {screen === "billing" && (
              <BillingScreen
                customer={customer} items={items}
                subtotal={subtotal} total={total} formatter={formatter}
              />
            )}
            {screen === "payment_preview" && (
              <PaymentPreviewScreen customer={customer} summary={paymentSummary} currency={currency} />
            )}
            {screen === "payment_success" && (
              <PaymentSuccessScreen customer={customer} summary={paymentSummary} currency={currency} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Feature Disabled ──────────────────────────────────────────────────────────
function DisabledScreen() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-white text-center shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-5">
        <MonitorOff className="w-9 h-9 text-white/50" />
      </div>
      <h2 className="text-2xl font-bold text-white/80">Customer Display Disabled</h2>
      <p className="text-white/50 text-sm mt-3 leading-relaxed">
        This feature has been turned off in settings.<br />
        Enable "Customer displays" to use this screen.
      </p>
    </div>
  );
}

// ── Dialpad ───────────────────────────────────────────────────────────────────
function DialpadScreen({ phone, error, onKey, onBackspace, onClear, onConfirm }: {
  phone: string; error: string;
  onKey: (k: string) => void; onBackspace: () => void;
  onClear: () => void; onConfirm: () => void;
}) {
  const keys = ["1","2","3","4","5","6","7","8","9","*","0","#"];
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-white text-center shadow-2xl">
      <h1 className="text-2xl font-bold mb-1">Welcome</h1>
      <p className="text-white/70 text-sm mb-6">Enter your phone number to get started</p>

      <div className="bg-white/10 rounded-2xl px-6 py-4 mb-2 min-h-[56px] flex items-center justify-center">
        <span className="text-3xl font-mono tracking-widest">
          {phone || <span className="text-white/30 text-lg font-sans font-normal">Enter number</span>}
        </span>
      </div>

      {error ? <p className="text-red-300 text-sm mb-3">{error}</p> : <div className="mb-3 h-5" />}

      <div className="grid grid-cols-3 gap-3 mb-4">
        {keys.map((k) => (
          <button key={k} onClick={() => onKey(k)}
            className="py-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xl font-semibold border border-white/10">
            {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={onClear} className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-sm font-semibold border border-white/10">Clear</button>
        <button onClick={onConfirm} disabled={phone.length < 7}
          className="py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          Confirm
        </button>
        <button onClick={onBackspace} className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10">
          <Delete size={18} />
        </button>
      </div>
    </div>
  );
}

// ── Customer found ────────────────────────────────────────────────────────────
function CustomerScreen({ customer }: { customer: CustomerFormValues }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-white text-center shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
        {customer.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <h2 className="text-2xl font-bold">{customer.name}</h2>
      <p className="text-white/60 text-sm mt-1">{customer.phoneNumber}</p>
      {customer.email && <p className="text-white/60 text-sm">{customer.email}</p>}
      <div className="mt-6 bg-white/10 rounded-2xl px-6 py-4 text-white/80 text-sm">
        Waiting for items to be added...
      </div>
    </div>
  );
}

// ── Billing ───────────────────────────────────────────────────────────────────
function BillingScreen({ customer, items, subtotal, total, formatter }: {
  customer: CustomerFormValues | null;
  items: OrderItem[];
  subtotal: number;
  total: number;
  formatter: Intl.NumberFormat;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white shadow-2xl max-h-[90vh] overflow-auto">
      {customer && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold shrink-0">
            {customer.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold">{customer.name}</p>
            <p className="text-white/60 text-xs">{customer.phoneNumber}</p>
            <p className="text-white/60 text-xs">{customer.email}</p>
          </div>
        </div>
      )}
      <h3 className="font-semibold text-white/80 text-sm mb-3">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 rounded-lg px-2 py-0.5 text-xs">{item.qty}×</span>
              <span>{item.name}</span>
            </div>
            <span className="font-semibold">{formatter.format(item.price * item.qty)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/20 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Subtotal</span>
          <span>{formatter.format(subtotal)}</span>
        </div>
        <div className="flex justify-between font-bold text-orange-400 text-lg">
          <span>Total</span>
          <span>{formatter.format(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Payment Preview (cashier hit Done — awaiting confirm) ─────────────────────
function PaymentPreviewScreen({ customer, summary, currency }: {
  customer: CustomerFormValues | null;
  summary: PaymentSummary | null;
  currency: string;
}) {
  const c = summary?.currencyCode ?? currency;
  const rows: { label: string; value: string; highlight?: boolean; dim?: boolean }[] = summary ? [
    { label: "Base Amount", value: fmt(c, summary.baseAmount) },
    ...(summary.discountValue > 0 ? [{ label: `Discount (${summary.discountPercent ?? 0}%)`, value: `- ${fmt(c, summary.discountValue)}`, dim: true }] : []),
    ...(summary.cashPaid > 0 ? [{ label: "Cash Paid", value: fmt(c, summary.cashPaid) }] : []),
    ...(summary.cardTax > 0 ? [{ label: `Card Tax (${Math.round(summary.cardTaxRate * 100)}%)`, value: fmt(c, summary.cardTax), dim: true }] : []),
    ...(summary.cardPaid > 0 ? [{ label: "Card Paid", value: fmt(c, summary.cardPaid) }] : []),
    { label: "Grand Total", value: fmt(c, summary.grandTotal), highlight: true },
  ] : [];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white shadow-2xl">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-orange-400 flex items-center justify-center mb-3">
          <Clock className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold">Please Wait</h2>
        <p className="text-white/60 text-sm mt-1">Confirming your order...</p>
      </div>
      {customer && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
            {customer.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-sm">{customer.name}</p>
            <p className="text-white/60 text-xs">{customer.phoneNumber}</p>
            <p className="text-white/60 text-xs">{customer.email}</p>
          </div>
        </div>
      )}
      {summary && (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className={`flex justify-between text-sm ${row.highlight ? "font-bold text-orange-400 text-base" : row.dim ? "text-white/50" : "text-white/80"}`}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-center text-white/40 text-xs mt-6">Awaiting cashier confirmation...</p>
    </div>
  );
}

// ── Payment Success (cashier hit Confirm) ─────────────────────────────────────
function PaymentSuccessScreen({ customer, summary, currency }: {
  customer: CustomerFormValues | null;
  summary: PaymentSummary | null;
  currency: string;
}) {
  const c = summary?.currencyCode ?? currency;
  const rows: { label: string; value: string; highlight?: boolean; dim?: boolean }[] = summary ? [
    { label: "Base Amount", value: fmt(c, summary.baseAmount) },
    ...(summary.discountValue > 0 ? [{ label: `Discount (${summary.discountPercent ?? 0}%)`, value: `- ${fmt(c, summary.discountValue)}`, dim: true }] : []),
    ...(summary.cashPaid > 0 ? [{ label: "Cash Paid", value: fmt(c, summary.cashPaid) }] : []),
    ...(summary.cardTax > 0 ? [{ label: `Card Tax (${Math.round(summary.cardTaxRate * 100)}%)`, value: fmt(c, summary.cardTax), dim: true }] : []),
    ...(summary.cardPaid > 0 ? [{ label: "Card Paid", value: fmt(c, summary.cardPaid) }] : []),
    { label: "Grand Total", value: fmt(c, summary.grandTotal), highlight: true },
    ...(summary.changeToGive > 0 ? [{ label: "Change", value: fmt(c, summary.changeToGive), highlight: true }] : []),
  ] : [];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-white shadow-2xl">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-3 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-white/60 text-sm mt-1">via {summary?.paymentMethod}</p>
      </div>
      {customer && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/20">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
            {customer.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-sm">{customer.name}</p>
            <p className="text-white/60 text-xs">{customer.phoneNumber}</p>
            <p className="text-white/60 text-xs">{customer.email}</p>
          </div>
        </div>
      )}
      {summary && (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className={`flex justify-between text-sm ${row.highlight ? "font-bold text-orange-400 text-base" : row.dim ? "text-white/50" : "text-white/80"}`}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-center mt-6 space-y-1">
        <p className="text-2xl font-bold text-white">
          Thank you{customer?.name ? `, ${customer.name.split(" ")[0]}!` : "!"} 
        </p>
        <p className="text-base text-white/60 font-medium">Have a nice day</p>
        <p className="text-sm text-white/40">See you soon!</p>
      </div>
    </div>
  );
}