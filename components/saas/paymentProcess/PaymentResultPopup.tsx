"use client";

type PaymentResultType = "success" | "cancel";

type PaymentResultPopupProps = {
  type: PaymentResultType;
  onClose: () => void;
};

const RESULT_CONTENT = {
  success: {
    title: "Subscription Successful!",
    subtitle:
      "Stripe confirmed your subscription. Your company will be activated shortly.",
  },
  cancel: {
    title: "Payment Cancelled",
    subtitle:
      "Your subscription was not completed. No payment was taken.",
  },
} as const;

function ResultIcon({ type }: { type: PaymentResultType }) {
  const isSuccess = type === "success";

  return (
    <div
      className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full shadow-2xl sm:h-20 sm:w-20"
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
        <svg width="40" height="40" viewBox="0 0 42 42" fill="none">
          <path
            d="M9 22.5L17.2 30.5L33.5 12.5"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="40" height="40" viewBox="0 0 42 42" fill="none">
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

export default function PaymentResultPopup({ type, onClose }: PaymentResultPopupProps) {
  const content = RESULT_CONTENT[type];
  const isSuccess = type === "success";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 text-white"
      style={{
        background: "rgba(0,0,0,0.28)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-result-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,18,0.94) 0%, rgba(34,34,34,0.94) 100%)",
          animation: "paymentResultPopIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) both",
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
          onClick={onClose}
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

        <div className="px-7 pb-9 pt-12 text-center sm:px-9">
          <ResultIcon type={type} />

          <h1
            id="payment-result-title"
            className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {content.title}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/65">
            {content.subtitle}
          </p>
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
          0% { opacity: 0; transform: scale(0.92) translateY(18px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
