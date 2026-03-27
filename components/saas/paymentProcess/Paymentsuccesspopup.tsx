"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/Admin/common/ActionButton";

type PaymentSuccessPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain: () => void;
  paymentSuccess: boolean;
  registrationSuccess: boolean;
};

type StatusBadgeProps = {
  success: boolean;
  successLabel: string;
  failLabel: string;
};

function StatusBadge({ success, successLabel, failLabel }: StatusBadgeProps) {
  return success ? (
    <span
      className="font-semibold px-2.5 py-0.5 rounded-full text-xs"
      style={{
        background: "rgba(34,197,94,0.15)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.25)",
      }}
    >
      ● {successLabel}
    </span>
  ) : (
    <span
      className="font-semibold px-2.5 py-0.5 rounded-full text-xs"
      style={{
        background: "rgba(239,68,68,0.15)",
        color: "#f87171",
        border: "1px solid rgba(248,113,113,0.25)",
      }}
    >
      ● {failLabel}
    </span>
  );
}

export default function PaymentSuccessPopup({
  isOpen,
  onClose,
  onTryAgain,
  paymentSuccess,
  registrationSuccess,
}: PaymentSuccessPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const resolvedRegistration = paymentSuccess ? registrationSuccess : false;

  const allSuccess = paymentSuccess && resolvedRegistration;
  const allFailed = !paymentSuccess;
  const partial = paymentSuccess && !resolvedRegistration;

  const title = allSuccess
    ? "Payment Successful!"
    : allFailed
    ? "Payment Unsuccessful"
    : "Registration Failed";

  const iconColor = allSuccess
    ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";

  const iconGlow = allSuccess
    ? "0 0 32px rgba(249,115,22,0.45)"
    : "0 0 32px rgba(239,68,68,0.45)";

  const buttonLabel = allSuccess
    ? "OK"
    : allFailed
    ? "Try Again"
    : "Contact Us";

  function handleButtonClick() {
    if (allSuccess) {
       onClose();
      router.push("/companyselection");
    } else if (allFailed) {
      onTryAgain();
    } else {
      router.push("/contactus");
    }
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="payment-popup-title"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          className="relative mx-4 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #1a1a1a 0%, #222222 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            animation: "popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          }}
        >

          <div
            className="h-1.5 w-full"
            style={{
              background: allSuccess
                ? "linear-gradient(90deg, #f97316, #ea580c)"
                : "linear-gradient(90deg, #ef4444, #dc2626)",
            }}
          />

          <div className="px-8 py-10 flex flex-col items-center text-center gap-5">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 80,
                height: 80,
                background: iconColor,
                boxShadow: iconGlow,
                animation:
                  "scalePop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              {allSuccess ? (
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  className="check-svg"
                >
                  <polyline
                    points="7,20 15,28 31,11"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              ) : (
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                  className="x-svg"
                >
                  <line
                    x1="11" y1="11" x2="27" y2="27"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="27" y1="11" x2="11" y2="27"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2
                id="payment-popup-title"
                className="text-white font-bold text-2xl tracking-tight mb-1"
                style={{ letterSpacing: "-0.02em" }}
              >
                {title}
              </h2>

              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {allSuccess && "Your payment and registration have been completed."}
                {allFailed && "Your payment could not be processed. Please try again."}
                {partial && (
                  <>
                    Payment was successful but registration could not be
                    completed. Please{" "}
                    <a
                      href="/contactus"
                      className="contact-link"
                      style={{
                        color: "#fb923c",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "text-decoration 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none";
                      }}
                    >
                      contact support
                    </a>
                    .
                  </>
                )}
              </p>
            </div>

            <div
              className="w-full h-px"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />

            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span style={{ color: "rgba(255,255,255,0.45)" }}>Payment</span>
                <StatusBadge
                  success={paymentSuccess}
                  successLabel="Successful"
                  failLabel="Unsuccessful"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span style={{ color: "rgba(255,255,255,0.45)" }}>
                  Registration
                </span>
                <StatusBadge
                  success={resolvedRegistration}
                  successLabel="Completed"
                  failLabel="Unsuccessful"
                />
              </div>
            </div>

            <ActionButton
              variant="primary"
              label={buttonLabel}
              fullWidth
              onClick={handleButtonClick}
              className="w-full mt-2 py-3.5 text-base rounded-xl"
            />
          </div>

          <div
            className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 200,
              height: 80,
              background: allSuccess
                ? "radial-gradient(ellipse, rgba(249,115,22,0.18) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.88) translateY(24px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scalePop {
          0%   { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .check-svg polyline {
          stroke-dasharray: 52;
          stroke-dashoffset: 52;
          animation: strokeDraw 0.45s 0.5s ease forwards;
        }
        @keyframes strokeDraw {
          to { stroke-dashoffset: 0; }
        }
        .x-svg line {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: strokeDraw 0.3s 0.4s ease forwards;
        }
      `}</style>
    </>
  );
}