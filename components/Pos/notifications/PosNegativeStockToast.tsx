"use client";

import { AlertTriangle, PackageX, X } from "lucide-react";

export type PosNegativeToastInfo = {
  id: string; // unique toast id
  productName: string;
  stockQty: number;
  attemptedQty: number;
};

interface PosNegativeStockToastProps {
  toasts: PosNegativeToastInfo[];
  onDismiss: (id: string) => void;
}

export default function PosNegativeStockToast({
  toasts,
  onDismiss,
}: PosNegativeStockToastProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes pulseRingRed {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.35); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        .stock-toast-enter {
          animation: slideInRight 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .pulse-red    { animation: pulseRingRed 2s ease-in-out infinite; }
      `}</style>

      {/* Fixed portal — bottom-right, stacked upward */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
        style={{ maxWidth: "360px", width: "calc(100vw - 2.5rem)" }}
      >
        {toasts.map((toast) => {
          const isZeroStock = toast.stockQty <= 0;

          return (
            <div
              key={toast.id}
              className={`
                stock-toast-enter pointer-events-auto
                relative rounded-2xl overflow-hidden shadow-2xl border
                ${isZeroStock ? "bg-red-50 border-red-300 pulse-red" : "bg-orange-50 border-orange-300"}
              `}
            >
              {/* Coloured left bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                  isZeroStock ? "bg-red-600" : "bg-orange-600"
                }`}
              />

              <div className="flex items-start gap-3 px-4 py-3 pl-5">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${
                    isZeroStock ? "bg-red-100" : "bg-orange-100"
                  }`}
                >
                  {isZeroStock ? (
                    <PackageX size={20} className="text-red-600" />
                  ) : (
                    <AlertTriangle size={20} className="text-orange-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isZeroStock ? "text-red-700" : "text-orange-700"
                    }`}
                  >
                    {isZeroStock ? "⚠ Out of Stock" : "Negative Stock Warning"}
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {toast.productName}
                  </p>
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {isZeroStock 
                      ? "Cannot add. Product stock is zero." 
                      : `Adding ${toast.attemptedQty} exceeds available stock of ${toast.stockQty}.`}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        isZeroStock
                          ? "bg-red-200 text-red-800"
                          : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      Available: {toast.stockQty}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className={`flex-shrink-0 -mt-0.5 -mr-1 p-1 rounded-lg transition-colors ${
                    isZeroStock
                      ? "hover:bg-red-200 text-red-500 hover:text-red-700"
                      : "hover:bg-orange-200 text-orange-500 hover:text-orange-700"
                  }`}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
