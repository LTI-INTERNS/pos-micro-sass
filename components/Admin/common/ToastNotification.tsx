"use client";

import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .admin-toast-enter {
          animation: slideInRight 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      {/* Fixed portal — bottom-right, stacked upward */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: "360px", width: "calc(100vw - 2.5rem)" }}
      >
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              className={`
                admin-toast-enter pointer-events-auto
                relative rounded-xl overflow-hidden shadow-xl border bg-white
              `}
            >
              {/* Coloured left bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isError ? "bg-red-500" : isSuccess ? "bg-green-500" : "bg-blue-500"
                }`}
              />

              <div className="flex items-start gap-3 px-4 py-3 pl-5">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isError ? (
                    <AlertCircle size={20} className="text-red-500" />
                  ) : isSuccess ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Info size={20} className="text-blue-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isError ? "text-red-700" : isSuccess ? "text-green-700" : "text-blue-700"
                    }`}
                  >
                    {isError ? "Error" : isSuccess ? "Success" : "Notification"}
                  </p>
                  <p className="text-sm font-medium text-gray-800 leading-tight pr-2">
                    {toast.message}
                  </p>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
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