"use client";
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import ItemGrid from "@/components/Pos/posdashboard/ItemGrid";
import CustomerInfoPanel, {
  CustomerInfoPanelHandle,
} from "@/components/Pos/posdashboard/CustomerInfoPanel";
import DashboardLayout from "@/components/Pos/posdashboard/posdashboardlayout";
import SearchBar from "@/components/Admin/common/Search-bar";
import OrderPaymentModal, {
  PaymentSummary,
} from "@/components/Pos/posdashboard/OrderPaymentModal";
import OrderConfirmation, { ConfirmItem } from "@/components/Pos/OrderConfirmation";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { usePosSettings } from "@/lib/context/PosSettingsContext";
import { Check, X, Printer, AlertCircle } from "lucide-react";
import SessionExpiryGuard from "@/components/Pos/SessionExpiryGuard";
import { usePosStore } from "@/store/usePosStore";
import { orderService } from "@/lib/services/order-service";
import { useReceiptPrinter } from "@/hooks/useReceiptActions";
import type { CreateOrderInput } from "@/types/order.types";

// ── Receipt data captured after a successful order save ──────────────────────

type SavedReceiptData = {
  orderNo: string;
  currencyCode: string;
  items: { name: string; qty: number; price: number }[];
  discountValue: number;
  cardTax: number;
  grandTotal: number;
  paymentMethod: string;
  cashPaid: number;
  cardPaid: number;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
};

// ── OrderCompletePopup ────────────────────────────────────────────────────────

function OrderCompletePopup({
  open,
  onClose,
  orderNo,
  receiptData,
}: {
  open: boolean;
  onClose: () => void;
  orderNo: string | number;
  receiptData: SavedReceiptData | null;
}) {
  // Hook must always be called — use safe fallbacks when receiptData is null
  const { handlePrint } = useReceiptPrinter(
    receiptData
      ? {
          orderId:       receiptData.orderNo,
          currencyCode:  receiptData.currencyCode,
          items:         receiptData.items,
          discountValue: receiptData.discountValue,
          cardTax:       receiptData.cardTax,
          grandTotal:    receiptData.grandTotal,
          paymentMethod: receiptData.paymentMethod,
          cashPaid:      receiptData.cashPaid,
          cardPaid:      receiptData.cardPaid,
          customerName:  receiptData.customerName,
          customerPhone: receiptData.customerPhone,
          customerEmail: receiptData.customerEmail,
        }
      : {
          orderId:       orderNo,
          currencyCode:  "LKR",
          items:         [],
          discountValue: 0,
          cardTax:       0,
          grandTotal:    0,
          paymentMethod: "",
          cashPaid:      0,
          cardPaid:      0,
          customerName:  null,
          customerPhone: null,
          customerEmail: null,
        }
  );

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden transform transition-all duration-300 ${
          open ? "scale-100 translate-y-0" : "scale-95 translate-y-2"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 grid place-items-center text-slate-500 hover:text-black transition z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          <div className="relative mx-auto w-20 h-20 grid place-items-center">
            <span className="absolute inset-0 rounded-full glow" />
            <span className="absolute inset-[-14px] rounded-full glow-strong" />
            <div className="w-16 h-16 rounded-full bg-orange-400 grid place-items-center relative z-10">
              <Check className="text-white" size={34} />
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-black">Order Completed!</h2>
          <p className="text-sm text-slate-500 mt-1">Order {orderNo}</p>

          <div className="my-6 h-px bg-slate-200" />

          <p className="text-slate-500">The order has been successfully completed.</p>

          <div className="mt-7 flex justify-center gap-3">
            {receiptData && (
              <button
                onClick={handlePrint}
                className="px-6 py-3 h-12 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Printer size={16} />
                Print Receipt
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-3 h-12 min-w-[140px] rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition active:scale-95 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>

        <style jsx>{`
          .glow {
            background: radial-gradient(
              circle,
              rgba(249, 115, 22, 0.7),
              rgba(249, 115, 22, 0) 65%
            );
            filter: blur(10px);
          }
          .glow-strong {
            background: radial-gradient(
              circle,
              rgba(249, 115, 22, 0.5),
              rgba(249, 115, 22, 0) 80%
            );
            filter: blur(26px);
          }
        `}</style>
      </div>
    </div>
  );
}

// ── PosToast — lightweight non-blocking toast for page-level notices ─────────

function PosToast({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900 text-white text-sm shadow-xl max-w-sm w-full mx-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <AlertCircle size={18} className="shrink-0 text-orange-400" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-400 hover:text-white transition cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type SelectedCustomer = {
  customerId?: string;
  name: string;
  phoneNumber: string;
  email: string;
} | null;

// ── Page ──────────────────────────────────────────────────────────────────────

const Page = () => {
  const { currency } = useCurrency();
  const { posSettings } = usePosSettings();
  const { orderItems, addItem, increaseQty, decreaseQty, setQty, clearCart } = usePosStore();
  const { data: session } = useSession();

  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    orderNo: string;
    totalAmount: number;
    tipAmount: number;
  } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>(null);

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completedOrderNo, setCompletedOrderNo] = useState<string | number>("-");

  // Holds receipt data built from the REAL order returned by the backend.
  // This ensures the receipt shows the correct order number and finalised totals.
  const [savedReceipt, setSavedReceipt] = useState<SavedReceiptData | null>(null);

  const [paymentModalKey, setPaymentModalKey] = useState(0);
  const [paymentForceEditable, setPaymentForceEditable] = useState(false);

  const panelRef = useRef<CustomerInfoPanelHandle>(null);

  const confirmItems: ConfirmItem[] = useMemo(
    () =>
      orderItems.map((it) => ({
        id: it.id,
        name: it.name,
        qty: it.qty,
        price: it.price,
        subtotal: it.price * it.qty,
      })),
    [orderItems]
  );

  const handleAddItem = (item: { id: string; name: string; price: number; image?: string }) => {
    addItem(item);
  };

  const hardResetPaymentFlow = useCallback(() => {
    setPaymentOpen(false);
    setPaymentData(null);
    setPaymentSummary(null);
    setConfirmOpen(false);
    setPaymentForceEditable(false);
    setSelectedCustomer(null);
    setPaymentModalKey((k) => k + 1);
  }, []);

  // Called by OrderConfirmation when cashier clicks "Confirm".
  // Receives the optional email (may have been added/edited in the modal)
  // and the optional note typed by the cashier.
  const handleConfirm = useCallback(
    async (email?: string, note?: string) => {
      if (isSubmitting || !paymentSummary) return;

      // Guard: session must be fully loaded before attempting order creation.
      if (!session?.user?.branchId || !session?.user?.cashierId) {
        setSubmitError("Session is not ready. Please wait a moment and try again.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const branchId  = session.user.branchId;
        const cashierId = session.user.cashierId;

        const hasCash = paymentSummary.cashPaid > 0;
        const hasCard = paymentSummary.cardPaid > 0;
        const paymentType: "CASH" | "CARD" | "SPLIT" =
          hasCash && hasCard ? "SPLIT" :
          hasCard             ? "CARD"  : "CASH";

        // backend payment.method only accepts CASH | CARD (single value).
        // For SPLIT, use the dominant method.
        const method: "CASH" | "CARD" =
          paymentSummary.cashPaid >= paymentSummary.cardPaid ? "CASH" : "CARD";

        // Backend requires transactionId for any CARD payment.
        const transactionId = hasCard
          ? `POS-${Date.now()}`
          : undefined;

        const effectiveEmail = email?.trim() || selectedCustomer?.email || null;

        const payload: CreateOrderInput = {
          branchId,
          cashierId,
          ...(selectedCustomer?.customerId && { customerId: selectedCustomer.customerId }),
          ...(paymentSummary.discountId    && { discountId: paymentSummary.discountId }),
          ...(note?.trim()                 && { note: note.trim() }),
          ...(effectiveEmail               && { customerEmail: effectiveEmail }),
          items: orderItems.map((it) => ({
            variantId: it.id,
            quantity:  it.qty,
            unitPrice: it.price,
          })),
          payment: {
            paymentType,
            method,
            amount: paymentSummary.grandTotal,
            // Send cash fields whenever cash was involved (CASH or SPLIT with cash).
            ...(hasCash && {
              cashReceived: paymentSummary.cashPaid,
              changeToGive: paymentSummary.changeToGive,
            }),
            ...(transactionId && { transactionId }),
          },
        };

        const order = await orderService.create(payload);

        // Build receipt data from the REAL saved order so the receipt shows
        // the backend-assigned order number (e.g. "003") not the temp ORD-timestamp.
        const receipt: SavedReceiptData = {
          orderNo:       order.orderNumber,
          currencyCode:  paymentSummary.currencyCode ?? currency ?? "LKR",
          items:         orderItems.map((it) => ({
            name:  it.name,
            qty:   it.qty,
            price: it.price,
          })),
          discountValue: paymentSummary.discountValue,
          cardTax:       paymentSummary.cardTax,
          grandTotal:    paymentSummary.grandTotal,
          paymentMethod: paymentSummary.paymentMethod,
          cashPaid:      paymentSummary.cashPaid,
          cardPaid:      paymentSummary.cardPaid,
          customerName:  selectedCustomer?.name        ?? null,
          customerPhone: selectedCustomer?.phoneNumber  ?? null,
          customerEmail: effectiveEmail,
        };

        setSavedReceipt(receipt);
        setCompletedOrderNo(order.orderNumber);

        // Show the completion popup first, THEN tear down the payment flow.
        // Order matters: hardResetPaymentFlow clears selectedCustomer and
        // paymentSummary — the popup must already be open before that happens.
        setCompleteOpen(true);
        setConfirmOpen(false);
        setPaymentOpen(false);
        clearCart();
        hardResetPaymentFlow();
        panelRef.current?.sendOrderConfirmed();
      } catch (err: unknown) {
        console.error("Order creation failed:", err);

        const code: string =
          (err as any)?.response?.data?.error?.code ?? "UNKNOWN";

        const messages: Record<string, string> = {
          INSUFFICIENT_STOCK:
            "One or more items are out of stock. Please remove them from the cart and try again.",
          VARIANT_NOT_FOUND:
            "One or more products are no longer available. Please refresh the product list and try again.",
          DISCOUNT_NOT_VALID:
            "The selected discount has expired or is not valid for this branch. Please remove it and try again.",
          MISSING_CASH_FIELDS:
            "Cash payment details are incomplete. Please go back and re-enter the payment.",
          MISSING_TRANSACTION_ID:
            "Card transaction ID is missing. Please go back and re-enter the payment.",
          EMPTY_ORDER:
            "The order has no items. Please add at least one item before confirming.",
          FORBIDDEN:
            "Only cashiers can create orders. Please log in with a cashier account.",
        };

        setSubmitError(messages[code] ?? "Failed to save the order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      paymentSummary,
      session,
      selectedCustomer,
      orderItems,
      currency,
      clearCart,
      hardResetPaymentFlow,
    ]
  );

  return (
    <DashboardLayout>
      <SessionExpiryGuard variant="pos" />

      <div className="flex gap-6 h-[calc(100vh-96px)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="pt-2 shrink-0">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search Name or ID"
              className="py-2"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 mt-2">
            <ItemGrid search={search} onAdd={handleAddItem} />
          </div>
        </div>

        <div className="w-md sticky top-0 h-[calc(100vh-76px)]">
          <CustomerInfoPanel
            ref={panelRef}
            items={orderItems}
            customerDisplayEnabled={posSettings.customerDisplayEnabled}
            onInc={(id) => increaseQty(id)}
            onDec={(id) => decreaseQty(id)}
            onSetQty={(id, qty) => setQty(id, qty)}
            onCancel={() => {
              clearCart();
              hardResetPaymentFlow();
            }}
            onPay={(summary) => {
              if (summary.total <= 0) {
                setToast("Please add items to proceed with payment.");
                return;
              }

              setSelectedCustomer(
                summary.customer
                  ? {
                      customerId:  summary.customer.customerId ?? undefined,
                      name:        summary.customer.name ?? "",
                      phoneNumber: summary.customer.phoneNumber1 ?? "",
                      email:       summary.customer.email ?? "",
                    }
                  : null
              );

              setPaymentForceEditable(false);
              setPaymentData({ orderNo: `Pending`, totalAmount: summary.total, tipAmount: 0 });
              setPaymentOpen(true);
            }}
          />
        </div>
      </div>

      <OrderPaymentModal
        key={paymentModalKey}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderNo={paymentData?.orderNo ?? "-"}
        totalAmount={paymentData?.totalAmount ?? 0}
        tipAmount={paymentData?.tipAmount ?? 0}
        currencyCode={currency}
        forceEditable={paymentForceEditable}
        onDone={(summary) => {
          const summaryWithCustomer: PaymentSummary = {
            ...summary,
            customer: selectedCustomer,
          };

          setPaymentSummary(summaryWithCustomer);
          setPaymentOpen(false);
          setConfirmOpen(true);
          setPaymentForceEditable(true);

          panelRef.current?.sendPaymentSummary(summaryWithCustomer);
        }}
      />

      {paymentSummary && (
        <OrderConfirmation
          open={confirmOpen}
          onClose={() => {
            setConfirmOpen(false);
            setSubmitError(null);
          }}
          items={confirmItems}
          payment={paymentSummary}
          customerEmail={selectedCustomer?.email ?? null}
          isSubmitting={isSubmitting}
          submitError={submitError}
          requiresCustomer={false}
          onCancelEdit={() => {
            setConfirmOpen(false);
            setSubmitError(null);
            setPaymentForceEditable(true);
            setPaymentOpen(true);
          }}
          onConfirm={handleConfirm}
        />
      )}

      <OrderCompletePopup
        open={completeOpen}
        orderNo={completedOrderNo}
        receiptData={savedReceipt}
        onClose={() => {
          setCompleteOpen(false);
          setSavedReceipt(null);
          panelRef.current?.sendOrderCleared();
        }}
      />

      <PosToast message={toast} onDismiss={() => setToast(null)} />
    </DashboardLayout>
  );
};

export default Page;