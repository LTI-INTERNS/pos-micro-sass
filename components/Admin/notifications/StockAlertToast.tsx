"use client";

import { X, AlertTriangle, PackageX } from "lucide-react";
import type { AlertToast } from "./useStockAlerts";

interface StockAlertToastProps {
  toasts: AlertToast[];
  onDismiss: (toastId: string) => void;
}

export default function StockAlertToast({ toasts, onDismiss }: StockAlertToastProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.35); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes pulseRingOrange {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.35); }
          50%       { box-shadow: 0 0 0 6px rgba(249,115,22,0); }
        }
        .stock-toast-enter {
          animation: slideInRight 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .pulse-red    { animation: pulseRing 2s ease-in-out infinite; }
        .pulse-orange { animation: pulseRingOrange 2s ease-in-out infinite; }
      `}</style>

      {/* Fixed portal — bottom-right, stacked upward */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
        style={{ maxWidth: "360px", width: "calc(100vw - 2.5rem)" }}
      >
        {toasts.map((toast) => {
          const isOut = toast.alertLevel === "out_of_stock";

          return (
            <div
              key={toast.toastId}
              className={`
                stock-toast-enter pointer-events-auto
                relative rounded-2xl overflow-hidden shadow-2xl border
                ${isOut
                  ? "bg-red-50 border-red-200 pulse-red"
                  : "bg-orange-50 border-orange-200 pulse-orange"
                }
              `}
            >
              {/* Coloured left bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  isOut ? "bg-red-500" : "bg-orange-500"
                }`}
              />

              <div className="flex items-start gap-3 px-4 py-3 pl-5">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
                    isOut ? "bg-red-100" : "bg-orange-100"
                  }`}
                >
                  {isOut ? (
                    <PackageX size={18} className="text-red-600" />
                  ) : (
                    <AlertTriangle size={18} className="text-orange-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isOut ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {isOut ? "⚠ Out of Stock" : "Low Stock Alert"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {toast.productName}
                  </p>
                  {toast.variantLabel && toast.variantLabel !== toast.sku && (
                    <p className="text-xs text-gray-500 truncate">
                      Variant: {toast.variantLabel}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isOut
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {isOut ? (
                        <>Stock: 0 {toast.stockUnit}</>
                      ) : (
                        <>Stock: {toast.stockQty} / min {toast.lowStock} {toast.stockUnit}</>
                      )}
                    </span>
                  </div>
                  {!isOut && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Auto-dismisses in a few seconds
                    </p>
                  )}
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => onDismiss(toast.toastId)}
                  className={`flex-shrink-0 -mt-0.5 -mr-1 p-1 rounded-lg transition-colors ${
                    isOut
                      ? "hover:bg-red-100 text-red-400 hover:text-red-600"
                      : "hover:bg-orange-100 text-orange-400 hover:text-orange-600"
                  }`}
                  title="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
