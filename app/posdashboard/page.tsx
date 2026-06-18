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
import PosNegativeStockToast, { type PosNegativeToastInfo } from "@/components/Pos/notifications/PosNegativeStockToast";
import { orderService } from "@/lib/services/order-service";
import { useReceiptPrinter } from "@/hooks/useReceiptActions";
import type { CreateOrderInput } from "@/types/order.types";
import { getApiErrorCode, getApiErrorMessage } from "@/lib/utils/api-error";


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

type SelectedCustomer = {
  customerId?: string;
  name: string;
  phoneNumber: string;
  email: string;
} | null;

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

  const [savedReceipt, setSavedReceipt] = useState<SavedReceiptData | null>(null);

  const [paymentModalKey, setPaymentModalKey] = useState(0);
  const [paymentForceEditable, setPaymentForceEditable] = useState(false);

  const panelRef = useRef<CustomerInfoPanelHandle>(null);

  // -- Negative Stock Notifications Logic --
  const [negativeStockToasts, setNegativeStockToasts] = useState<PosNegativeToastInfo[]>([]);

  const triggerNegativeStockAlert = (itemName: string, stockQty: number, attemptedQty: number) => {
    const id = `neg-toast-${Date.now()}-${Math.random()}`;
    const newToast: PosNegativeToastInfo = {
      id,
      productName: itemName,
      stockQty,
      attemptedQty,
    };
    setNegativeStockToasts((prev) => [...prev, newToast]);

    // If out of stock, require manual dismiss. If low stock (negative warning), auto-dismiss in 6s.
    if (stockQty > 0) {
      setTimeout(() => {
        setNegativeStockToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    }
  };

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

  const handleAddItem = (item: { id: string; name: string; price: number; image?: string; stockQty?: number }) => {
    const stock = item.stockQty ?? 0;
    const existing = orderItems.find((it) => it.id === String(item.id));
    const newQty = (existing ? existing.qty : 0) + 1;

    if (newQty > stock) {
      if (posSettings.negativeStockAlertsEnabled) {
        triggerNegativeStockAlert(item.name, stock, newQty);
      }
      return; // <-- Block adding if stock is exceeded ALWAYS
    }

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

  const handleConfirm = useCallback(
    async (email?: string, note?: string) => {
      if (isSubmitting || !paymentSummary) return;

      if (!session?.user?.cashierId) {
        setSubmitError("Session is not ready. Please wait a moment and try again.");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {

        const hasCash = paymentSummary.cashPaid > 0;
        const hasCard = paymentSummary.cardPaid > 0;
        const isSplit = hasCash && hasCard;

        const transactionId = hasCard ? `POS-${Date.now()}` : undefined;

        // Build payment payload based on method
        let paymentPayload: CreateOrderInput["payment"];

        if (isSplit) {
          // Split: both cash and card were used
          paymentPayload = {
            method:       "SPLIT",
            amount:       paymentSummary.grandTotal,
            cashAmount:   paymentSummary.cashPaid,
            cardAmount:   paymentSummary.cardPaid,
            cashReceived: paymentSummary.cashPaid,
            changeToGive: 0,
            transactionId: transactionId!,
          };
        } else if (hasCard) {
          // Pure card
          paymentPayload = {
            method:        "CARD",
            amount:        paymentSummary.grandTotal,
            transactionId: transactionId!,
          };
        } else {
          // Pure cash
          paymentPayload = {
            method:       "CASH",
            amount:       paymentSummary.grandTotal,
            cashReceived: paymentSummary.cashPaid,
            changeToGive: paymentSummary.changeToGive,
          };
        }

        const effectiveEmail = email?.trim() || selectedCustomer?.email || null;

        const payload: CreateOrderInput = {
          ...(selectedCustomer?.customerId && { customerId: selectedCustomer.customerId }),
          ...(paymentSummary.discountId    && { discountId: paymentSummary.discountId }),
          ...(note?.trim()                 && { note: note.trim() }),
          ...(effectiveEmail               && { customerEmail: effectiveEmail }),
          items: orderItems.map((it) => ({
            variantId: it.id,
            quantity:  it.qty,
          })),
          payment: paymentPayload,
        };

        const order = await orderService.create(payload);
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
        setCompleteOpen(true);
        setConfirmOpen(false);
        setPaymentOpen(false);
        clearCart();
        hardResetPaymentFlow();
        panelRef.current?.sendOrderConfirmed();
      } catch (err: unknown) {
        console.error("Order creation failed:", err);

        const code = getApiErrorCode(err);

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
          SUBSCRIPTION_LIMIT_REACHED:
            getApiErrorMessage(err, "This order cannot be completed because your subscription plan order limit has been reached for this branch."),
        };

        setSubmitError(messages[code] ?? getApiErrorMessage(err, "Failed to save the order. Please try again."));
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
            <ItemGrid search={search} onSearchChange={setSearch} onAdd={handleAddItem} />
          </div>
        </div>

        <div className="w-md sticky top-0 h-[calc(100vh-76px)]">
          <CustomerInfoPanel
            ref={panelRef}
            items={orderItems}
            customerDisplayEnabled={posSettings.customerDisplayEnabled}
            onInc={(id) => {
              const item = orderItems.find(it => it.id === id);
              if (item) {
                const stock = item.stockQty ?? 0;
                if (item.qty + 1 > stock) {
                  if (posSettings.negativeStockAlertsEnabled) {
                    triggerNegativeStockAlert(item.name, stock, item.qty + 1);
                  }
                  return; // <-- Block increment ALWAYS
                }
              }
              increaseQty(id);
            }}
            onDec={(id) => decreaseQty(id)}
            onSetQty={(id, qty) => {
              const item = orderItems.find(it => it.id === id);
              if (item) {
                const stock = item.stockQty ?? 0;
                if (qty > stock && qty > item.qty) {
                  if (posSettings.negativeStockAlertsEnabled) {
                    triggerNegativeStockAlert(item.name, stock, qty);
                  }
                  return; // <-- Block setting quantity past stock ALWAYS
                }
              }
              setQty(id, qty);
            }}
            onStockExceeded={(name, stockQty, attemptedQty) => {
              triggerNegativeStockAlert(name, stockQty, attemptedQty);
            }}
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

      <PosNegativeStockToast 
        toasts={negativeStockToasts} 
        onDismiss={(id) => setNegativeStockToasts(prev => prev.filter(t => t.id !== id))} 
      />
      <PosToast message={toast} onDismiss={() => setToast(null)} />
    </DashboardLayout>
  );
};

export default Page;