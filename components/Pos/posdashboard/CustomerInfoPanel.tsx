"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  forwardRef,
} from "react";
import ManageCustomersPopup from "@/components/Pos/ManageCustomerPopup";
import { CustomerFormValues } from "@/components/Admin/common/AddCustomerModal";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { usePosChannel, PosMessage } from "@/hooks/usePosChannel";
import { PaymentSummary } from "@/components/Pos/posdashboard/OrderPaymentModal";

export type CustomerInfoPanelHandle = {
  sendPaymentSummary: (summary: PaymentSummary) => void;
  sendOrderConfirmed: () => void;
  sendFeatureToggle: (enabled: boolean) => void;
  // ✅ NEW: resets customer display back to dialpad after order completes
  sendOrderCleared: () => void;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

type Props = {
  showOrders?: boolean;
  items?: OrderItem[];
  onAddCustomer?: () => void;
  onInc?: (id: string) => void;
  onDec?: (id: string) => void;
  onSetQty?: (id: string, qty: number) => void;
  onCancel?: () => void;
  onPay?: (summary: {
    subtotal: number;
    total: number;
    customer?: CustomerFormValues | null;
  }) => void;
  onPaymentDone?: (summary: PaymentSummary) => void;
  customerDisplayEnabled?: boolean;
};

const CustomerInfoPanel = forwardRef<CustomerInfoPanelHandle, Props>(
  function CustomerInfoPanel(
    {
      showOrders = true,
      items = [],
      onInc,
      onDec,
      onSetQty,
      onCancel,
      onPay,
      onPaymentDone,
      customerDisplayEnabled = true,
    },
    ref
  ) {
    const { currency } = useCurrency();

    const [manageCustomerOpen, setManageCustomerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] =
      useState<CustomerFormValues | null>(null);

    const subtotal = useMemo(
      () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
      [items]
    );

    const total = useMemo(() => subtotal, [subtotal]);

    const formatter = useMemo(
      () =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 2,
        }),
      [currency]
    );

    const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});

    const handleChannelMessage = useCallback((msg: PosMessage) => {
      if (msg.type === "CUSTOMER_SELECTED") {
        setSelectedCustomer({
          name: msg.customer.name,
          phoneNumber1: msg.customer.phoneNumber1,
          email: msg.customer.email,
          activeState: msg.customer.activeState,
        });
      }
      if (msg.type === "CUSTOMER_CLEARED") {
        setSelectedCustomer(null);
      }
    }, []);

    const { send } = usePosChannel(handleChannelMessage);

    useEffect(() => {
      send({ type: "FEATURE_TOGGLE", enabled: customerDisplayEnabled });
    }, [customerDisplayEnabled, send]);

    useImperativeHandle(ref, () => ({
      sendPaymentSummary(summary: PaymentSummary) {
        if (!customerDisplayEnabled) return;
        const summaryWithCustomer: PaymentSummary = {
          ...summary,
          customer: selectedCustomer
            ? {
                name: selectedCustomer.name,
                phoneNumber: selectedCustomer.phoneNumber1,
                email: selectedCustomer.email ?? "",
              }
            : null,
        };
        send({ type: "PAYMENT_SUMMARY", summary: summaryWithCustomer });
        onPaymentDone?.(summaryWithCustomer);
      },
      sendOrderConfirmed() {
        if (!customerDisplayEnabled) return;
        send({ type: "ORDER_CONFIRMED" });
      },
      sendFeatureToggle(enabled: boolean) {
        send({ type: "FEATURE_TOGGLE", enabled });
      },

      sendOrderCleared() {
        if (!customerDisplayEnabled) return;
        send({ type: "ORDER_CLEARED" });
        send({ type: "CUSTOMER_CLEARED" });
      },
    }));

    useEffect(() => {
      if (!customerDisplayEnabled) return;
      send({ type: "ORDER_UPDATED", items, subtotal, total });
    }, [items, subtotal, total, customerDisplayEnabled, send]);

    useEffect(() => {
      const next: Record<string, string> = {};
      for (const it of items) next[it.id] = String(it.qty);
      setQtyDraft(next);
    }, [items]);

    function clampPositiveInt(n: number) {
      if (!Number.isFinite(n)) return 1;
      return Math.max(1, Math.trunc(n));
    }

    function commitQty(id: string, raw: string) {
      const qty = raw.trim() === "" ? 1 : clampPositiveInt(Number(raw));
      setQtyDraft((p) => ({ ...p, [id]: String(qty) }));
      onSetQty?.(id, qty);
    }

    function handleCancel() {
      setSelectedCustomer(null);
      setQtyDraft({});
      setManageCustomerOpen(false);
      send({ type: "ORDER_CLEARED" });
      send({ type: "CUSTOMER_CLEARED" });
      onCancel?.();
    }

    function handlePay() {
      if (total <= 0) {
        alert("Please add items to proceed with payment.");
        return;
      }
      onPay?.({ subtotal, total, customer: selectedCustomer });
    }

    return (
      <>
        <aside className="w-full h-full bg-white">
          <div className="h-full flex flex-col px-6 pt-6">
            <h2 className="text-[22px] font-semibold text-slate-900">
              Customer Information
            </h2>

            {selectedCustomer ? (
              <div className="mt-2 space-y-2">
                <div className="rounded-xl bg-slate-50 p-4 space-y-0.5 text-sm text-black">
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  <p>{selectedCustomer.phoneNumber1}</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    send({ type: "CUSTOMER_CLEARED" });
                  }}
                  className="w-full rounded-full bg-orange-50 text-orange-600 font-semibold py-3 hover:bg-orange-100 transition cursor-pointer"
                >
                  Remove Customer
                </button>
              </div>
            ) : (
              <button
                onClick={() => setManageCustomerOpen(true)}
                className="mt-4 w-full rounded-full bg-orange-50 text-orange-600 py-4 font-semibold hover:bg-orange-100 transition cursor-pointer active:scale-90"
              >
                Add Customer
              </button>
            )}

            {showOrders && (
              <>
                <div className="pt-6">
                  <h3 className="text-[20px] font-semibold text-slate-900">
                    Orders details
                  </h3>
                </div>

                <div className="pt-4 flex-1 overflow-auto space-y-4">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="border-b pb-4 flex items-center gap-4"
                    >
                      {it.imageUrl && (
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={it.imageUrl}
                            alt={it.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[16px] font-semibold text-slate-900">
                          {it.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Price</p>
                        <p className="text-[16px] font-semibold text-orange-600">
                          {formatter.format(it.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onDec?.(it.id)}
                          className="h-11 w-11 rounded-full bg-slate-200 text-xl text-slate-700 grid place-items-center"
                        >
                          –
                        </button>

                        <input
                          value={qtyDraft[it.id] ?? String(it.qty)}
                          onChange={(e) =>
                            setQtyDraft((p) => ({
                              ...p,
                              [it.id]: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          onBlur={() =>
                            commitQty(it.id, qtyDraft[it.id] ?? "")
                          }
                          inputMode="numeric"
                          className="h-11 w-14 rounded-xl border border-slate-200 bg-white text-center font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-200"
                        />

                        <button
                          onClick={() => onInc?.(it.id)}
                          className="h-11 w-11 rounded-full bg-slate-900 text-white grid place-items-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-400">
                      No items added
                    </div>
                  )}
                </div>

                <div className="py-6 border-t space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Sub Total</span>
                    <span className="font-semibold text-slate-900">
                      {formatter.format(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold text-orange-600 text-[16px]">
                    <span>Total</span>
                    <span>{formatter.format(total)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={handleCancel}
                      className="rounded-full border border-orange-400 text-orange-600 font-semibold py-4 cursor-pointer transition-all active:scale-90"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handlePay}
                      className="rounded-full bg-orange-500 text-white font-semibold py-4 cursor-pointer transition-all active:scale-90"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        {manageCustomerOpen && (
          <ManageCustomersPopup
            onClose={() => setManageCustomerOpen(false)}
            onCustomerSelected={(customer) => {
              setSelectedCustomer(customer);
              setManageCustomerOpen(false);
              send({ type: "CUSTOMER_SELECTED", customer });
            }}
          />
        )}
      </>
    );
  }
);

export default CustomerInfoPanel;