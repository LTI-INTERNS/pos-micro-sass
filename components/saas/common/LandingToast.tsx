"use client";

import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { LandingToastMessage } from "@/hooks/useLandingToast";

interface LandingToastProps {
  toasts: LandingToastMessage[];
  onDismiss: (id: string) => void;
}

export default function LandingToast({ toasts, onDismiss }: LandingToastProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRightAuth {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .auth-toast-enter {
          animation: slideInRightAuth 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      {/* Fixed portal — top-right for landing pages */}
      <div
        className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: "400px", width: "calc(100vw - 3rem)" }}
      >
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              className="auth-toast-enter pointer-events-auto relative rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 px-5 py-4 text-white shadow-2xl flex items-start gap-3"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isError ? (
                  <AlertCircle size={20} className="text-red-500" />
                ) : isSuccess ? (
                  <CheckCircle size={20} className="text-orange-500" />
                ) : (
                  <Info size={20} className="text-blue-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    isError ? "text-red-400" : isSuccess ? "text-orange-400" : "text-blue-300"
                  }`}
                >
                  {isError ? "Error" : isSuccess ? "Success" : "Notification"}
                </p>
                <p className="text-sm text-white/90 leading-relaxed pr-2">
                  {toast.message}
                </p>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 text-white/40 hover:text-white/90 transition-colors p-1 -mr-2 -mt-1 rounded-lg"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}