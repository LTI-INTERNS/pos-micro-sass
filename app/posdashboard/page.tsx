"use client";
import React, { useMemo, useRef, useState } from "react";
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
import { Check, X, Loader2 } from "lucide-react";
import { posService } from "@/lib/services/pos-service";

// ─── Order-Complete Popup ────────────────────────────────────────────────────
function OrderCompletePopup({
  open,
  onClose,
  orderNo,
}: {
  open: boolean;
  onClose: () => void;
  orderNo: string | number;
}) {
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
          <p className="text-sm text-slate-500 mt-1">Order #{orderNo}</p>

          <div className="my-6 h-px bg-slate-200" />

          <p className="text-slate-500">The order has been successfully completed.</p>

          <div className="mt-7 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 h-12 min-w-[200px] rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition active:scale-95 cursor-pointer"
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

// ─── Types ───────────────────────────────────────────────────────────────────
type SelectedCustomer = {
  name: string;
  phoneNumber: string;
  email: string;
} | null;

import { usePosStore } from "@/store/usePosStore";

// ─── Page ────────────────────────────────────────────────────────────────────
const Page = () => {
  const { data: session } = useSession();
  const { currency } = useCurrency();
  const { posSettings } = usePosSettings();
  const { orderItems, addItem, increaseQty, decreaseQty, setQty, clearCart } =
    usePosStore();

  const [search, setSearch] = useState("");
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
  const [paymentModalKey, setPaymentModalKey] = useState(0);
  const [paymentForceEditable, setPaymentForceEditable] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const panelRef = useRef<CustomerInfoPanelHandle>(null);

  const orderNo = useMemo(() => `ORD-${new Date().getTime()}`, []);

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

  const handleAddItem = (item: {
    id: number;
    name: string;
    price: number;
    image?: string;
  }) => {
    addItem(item);
  };

  const hardResetPaymentFlow = () => {
    setPaymentOpen(false);
    setPaymentData(null);
    setPaymentSummary(null);
    setConfirmOpen(false);
    setPaymentForceEditable(false);
    setSelectedCustomer(null);
    setPaymentModalKey((k) => k + 1);
  };

  // ── Submit order to backend ─────────────────────────────────────────────
  const handleConfirmOrder = async (receiptEmail?: string) => {
    if (!paymentSummary) return;

    setSubmitting(true);
    try {
      const branchId = session?.user?.branchId ?? null;
      const cashierName = session?.user?.name ?? "Cashier";

      const subtotal = orderItems.reduce(
        (acc, it) => acc + it.price * it.qty,
        0
      );

      await posService.createOrder({
        orderNo: String(paymentSummary.orderNo),
        branchId,
        cashierName,
        customerId: null,
        customerName: selectedCustomer?.name ?? null,
        customerPhone: selectedCustomer?.phoneNumber ?? null,
        customerEmail: selectedCustomer?.email ?? null,
        items: orderItems.map((it) => ({
          productId: String(it.id),
          name: it.name,
          qty: it.qty,
          unitPrice: it.price,
          subtotal: it.price * it.qty,
        })),
        subtotal,
        discount: 0,
        tax: 0,
        tip: 0,
        total: paymentSummary.grandTotal,
        paymentMethod: paymentSummary.paymentMethod,
        amountPaid: paymentSummary.totalPaid,
        change: paymentSummary.changeToGive,
        receiptEmail: receiptEmail ?? selectedCustomer?.email ?? null,
      });

      setCompletedOrderNo(paymentSummary.orderNo);
    } catch (err) {
      // Order failed on backend — still complete locally but log warning
      console.warn("Order API failed, completing locally:", err);
      setCompletedOrderNo(paymentSummary.orderNo);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
      setPaymentOpen(false);
      clearCart();
      hardResetPaymentFlow();
      setCompleteOpen(true);
      panelRef.current?.sendOrderConfirmed();
    }
  };

  return (
    <DashboardLayout>
      {/* Branch context banner for admin/owner */}
      {(session?.user?.role === "admin" ||
        session?.user?.role === "owner" ||
        session?.user?.role === "Admin" ||
        session?.user?.role === "Owner") && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700 font-medium inline-flex items-center gap-1.5">
          <span>Viewing all branches</span>
        </div>
      )}

      {session?.user?.branchName &&
        session?.user?.role !== "admin" &&
        session?.user?.role !== "owner" &&
        session?.user?.role !== "Admin" &&
        session?.user?.role !== "Owner" && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium inline-flex items-center gap-1.5">
            <span>Branch: {session.user.branchName}</span>
          </div>
        )}

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
                alert("Please add items to proceed with payment.");
                return;
              }

              setSelectedCustomer(
                summary.customer
                  ? {
                      name: summary.customer.name ?? "",
                      phoneNumber: summary.customer.phoneNumber ?? "",
                      email: summary.customer.email ?? "",
                    }
                  : null
              );

              setPaymentForceEditable(false);
              setPaymentData({
                orderNo,
                totalAmount: summary.total,
                tipAmount: 0,
              });
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
          onClose={() => setConfirmOpen(false)}
          items={confirmItems}
          payment={paymentSummary}
          customerEmail={selectedCustomer?.email ?? null}
          onCancelEdit={() => {
            setConfirmOpen(false);
            setPaymentForceEditable(true);
            setPaymentOpen(true);
          }}
          onConfirm={(email) => {
            handleConfirmOrder(email);
          }}
        />
      )}

      {/* Submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl px-8 py-6 flex items-center gap-3 shadow-xl">
            <Loader2 className="animate-spin text-orange-500" size={24} />
            <span className="text-sm font-medium text-gray-700">
              Saving order...
            </span>
          </div>
        </div>
      )}

      <OrderCompletePopup
        open={completeOpen}
        orderNo={completedOrderNo}
        onClose={() => {
          setCompleteOpen(false);
          panelRef.current?.sendOrderCleared();
        }}
      />
    </DashboardLayout>
  );
};

export default Page;