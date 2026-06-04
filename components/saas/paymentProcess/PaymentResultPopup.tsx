"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/Admin/common/ActionButton";

type PaymentResultType = "success" | "cancel";

type PaymentResultPopupProps = {
  type: PaymentResultType;
};

const RESULT_CONTENT = {
  success: {
    title: "Subscription Successful!",
    subtitle:
      "Stripe confirmed your subscription. Your company will be activated shortly after the webhook finishes processing.",
    note:
      "If your company does not appear immediately, wait a few seconds and refresh the company selection page.",
    buttonLabel: "Go to Company Selection",
    closePath: "/companyselection",
    actionPath: "/companyselection",
    accent: "orange",
  },
  cancel: {
    title: "Payment Cancelled",
    subtitle:
      "Your subscription was not completed. No payment was taken and no paid plan was activated.",
    note: "You can return to the registration checkout step and try again anytime.",
    buttonLabel: "Back to Registration",
    closePath: "/companyregistration",
    actionPath: "/companyregistration",
    accent: "red",
  },
} as const;

function ResultIcon({ type }: { type: PaymentResultType }) {
  const isSuccess = type === "success";

  return (
    <div
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-2xl"
      style={{
        background: isSuccess
          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
          : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        boxShadow: isSuccess
          ? "0 0 34px rgba(249,115,22,0.45)"
          : "0 0 34px rgba(239,68,68,0.45)",
      }}
    >
      {isSuccess ? (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            d="M9 22.5L17.2 30.5L33.5 12.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            d="M13 13L29 29M29 13L13 29"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

export default function PaymentResultPopup({ type }: PaymentResultPopupProps) {
  const router = useRouter();
  const content = RESULT_CONTENT[type];
  const isSuccess = type === "success";

  const closePopup = () => {
    router.replace(content.closePath);
  };

  const handleAction = () => {
    router.replace(content.actionPath);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 text-white"
      style={{
        background: "rgba(0,0,0,0.62)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-result-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(20,20,20,0.96) 0%, rgba(30,30,30,0.96) 100%)",
          animation: "paymentResultPopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        <div
          className="h-1.5 w-full"
          style={{
            background: isSuccess
              ? "linear-gradient(90deg, #f97316, #ea580c)"
              : "linear-gradient(90deg, #ef4444, #dc2626)",
          }}
        />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
          aria-label="Close payment popup"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="px-7 pb-8 pt-12 text-center sm:px-9">
          <ResultIcon type={type} />

          <h1
            id="payment-result-title"
            className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {content.title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/65">{content.subtitle}</p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: isSuccess
                    ? "rgba(249,115,22,0.16)"
                    : "rgba(239,68,68,0.16)",
                  color: isSuccess ? "#fb923c" : "#f87171",
                }}
              >
                {isSuccess ? "✓" : "!"}
              </div>
              <p className="text-sm leading-6 text-white/60">{content.note}</p>
            </div>
          </div>

          <ActionButton
            variant="primary"
            label={content.buttonLabel}
            fullWidth
            onClick={handleAction}
            className="mt-7 py-3.5 text-base rounded-full"
          />
        </div>

        <div
          className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-64 -translate-x-1/2 rounded-full blur-2xl"
          style={{
            background: isSuccess
              ? "radial-gradient(ellipse, rgba(249,115,22,0.2) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      <style>{`
        @keyframes paymentResultPopIn {
          0% { opacity: 0; transform: scale(0.9) translateY(24px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
