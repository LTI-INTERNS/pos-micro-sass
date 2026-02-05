"use client";
import React, { useMemo, useState } from "react";
import FoodGrid from "../components/Pos/posdashboard/FoodGrid";
import CustomerInfoPanel, { OrderItem } from "../components/Pos/posdashboard/CustomerInfoPanel";
import DashboardLayout from "../components/Pos/posdashboard/posdashboardlayout";
import SearchBar from "../components/Admin/common/Search-bar";
import OrderPaymentModal, { PaymentSummary } from "../components/Pos/posdashboard/OrderPaymentModal";
import OrderConfirmation, { ConfirmItem } from "../components/Pos/OrderConfirmation";
import { Check, X } from "lucide-react";

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
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          <div className="relative mx-auto w-20 h-20 grid place-items-center">
            {/* orange animated glow */}
            <span className="absolute inset-0 rounded-full glow" />
            <div className="w-16 h-16 rounded-full bg-orange-400 grid place-items-center relative z-10">
              <Check className="text-white" size={34} />
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-black">Order Completed!</h2>
          <p className="text-sm text-slate-500 mt-1">Order #{orderNo}</p>

          <div className="my-6 h-px bg-slate-200" />

          <p className="text-slate-500">The order has been successfully completed.</p>

          <button
            onClick={onClose}
            className="mt-7 w-full h-12 rounded-xl border border-orange-300 text-orange-600 font-semibold hover:bg-orange-50 transition active:scale-95"
          >
            OK
          </button>
        </div>

        <style jsx>{`
          .glow {
            background: radial-gradient(circle, rgba(249, 115, 22, 0.35), rgba(249, 115, 22, 0) 60%);
            filter: blur(2px);
            animation: glowPulse 1.6s ease-in-out infinite;
          }
          @keyframes glowPulse {
            0% {
              transform: scale(0.95);
              opacity: 0.55;
            }
            50% {
              transform: scale(1.18);
              opacity: 0.95;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.55;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

const page = () => {
  const [search, setSearch] = useState("");
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    orderNo: string;
    totalAmount: number;
    tipAmount: number;
  } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);

  // order complete popup
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completedOrderNo, setCompletedOrderNo] = useState<string | number>("-");

  // hard reset modal key only when order is confirmed OR when user cancels order completely
  const [paymentModalKey, setPaymentModalKey] = useState(0);

  // ✅ NEW: control edit-mode when coming back from confirmation
  const [paymentForceEditable, setPaymentForceEditable] = useState(false);

  const orderNo = useMemo(() => {
    return `ORD-${new Date().getTime()}`;
  }, []);

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

  const handleAddFood = (food: { id: number; name: string; price: number; image: string }) => {
    setOrderItems((prev) => {
      const existing = prev.find((it) => it.id === String(food.id));

      if (existing) {
        return prev.map((it) => (it.id === String(food.id) ? { ...it, qty: it.qty + 1 } : it));
      }

      return [
        ...prev,
        {
          id: String(food.id),
          name: food.name,
          price: food.price,
          qty: 1,
          imageUrl: food.image,
        },
      ];
    });
  };

  const hardResetPaymentFlow = () => {
    setPaymentOpen(false);
    setPaymentData(null);
    setPaymentSummary(null);
    setConfirmOpen(false);
    setPaymentForceEditable(false);

    setPaymentModalKey((k) => k + 1);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-96px)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="pt-2 shrink-0">
            <SearchBar value={search} onChange={setSearch} placeholder="Search Name or ID" className="py-2" />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 mt-2">
            <FoodGrid search={search} onAdd={handleAddFood} />
          </div>
        </div>

        <div className="w-md sticky top-0 h-[calc(100vh-76px)]">
          <CustomerInfoPanel
            items={orderItems}
            onAddCustomer={() => setShowCustomerPopup(true)}
            onInc={(id) =>
              setOrderItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))
            }
            onDec={(id) =>
              setOrderItems((prev) =>
                prev.map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it)).filter((it) => it.qty > 0)
              )
            }
            onSetQty={(id, qty) => setOrderItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)))}
            onCancel={() => {
              setOrderItems([]);
              hardResetPaymentFlow();
            }}
            onPay={({ total }) => {
              if (total <= 0) {
                alert("Please add items to proceed with payment.");
                return;
              }

              // normal pay → not editable lock after full paid
              setPaymentForceEditable(false);

              setPaymentData({
                orderNo,
                totalAmount: total,
                tipAmount: 0,
              });
              setPaymentOpen(true);
            }}
          />
        </div>
      </div>

      {showCustomerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCustomerPopup(false)} />
        </div>
      )}

      <OrderPaymentModal
        key={paymentModalKey}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderNo={paymentData?.orderNo ?? "-"}
        totalAmount={paymentData?.totalAmount ?? 0}
        tipAmount={paymentData?.tipAmount ?? 0}
        currencyCode="LKR"
        forceEditable={paymentForceEditable}
        onDone={(summary) => {
          setPaymentSummary(summary);
          setPaymentOpen(false);
          setConfirmOpen(true);

          // once we go to confirmation, allow edit if they come back
          setPaymentForceEditable(true);
        }}
      />

      {paymentSummary && (
        <OrderConfirmation
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          items={confirmItems}
          payment={paymentSummary}
          onCancelEdit={() => {
            // go back to payment modal and allow editing
            setConfirmOpen(false);
            setPaymentForceEditable(true);
            setPaymentOpen(true);
          }}
          onConfirm={() => {
            // final confirm: show popup + reset for next order
            setCompletedOrderNo(paymentSummary.orderNo);

            setConfirmOpen(false);
            setPaymentOpen(false);

            setOrderItems([]);
            hardResetPaymentFlow();

            setCompleteOpen(true);
          }}
        />
      )}

      <OrderCompletePopup open={completeOpen} orderNo={completedOrderNo} onClose={() => setCompleteOpen(false)} />
    </DashboardLayout>
  );
};

export default page;
