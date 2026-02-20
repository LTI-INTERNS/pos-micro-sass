"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import PopupActions from "./PopupActions";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  subText?: string;
  onClose: () => void;
};

export default function SuccessPopup({
  open,
  title = "Success!",
  message,
  subText,
  onClose,
}: Props) {
  const [animateCheck, setAnimateCheck] = useState(false);

  useEffect(() => {
    if (open) {
      const t1 = setTimeout(() => setAnimateCheck(true), 60);
      return () => clearTimeout(t1);
    } else {
      setAnimateCheck(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      title=""
      onClose={onClose}
      widthClassName="w-[480px] max-w-[90vw]"
    >
      <div className="flex flex-col items-center text-center pb-2">

        {/* Animated check circle */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Glow ring */}
          <div
            className="absolute rounded-full ease-out"
            style={{
              transitionProperty: "all",
              transitionDuration: "400ms",
              width: animateCheck ? "96px" : "56px",
              height: animateCheck ? "96px" : "56px",
              background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0) 70%)",
              opacity: animateCheck ? 1 : 0,
            }}
          />

          {/* Orange circle */}
          <div
            className="relative flex items-center justify-center rounded-full bg-orange-500 shadow-lg ease-out"
            style={{
              transitionProperty: "all",
              transitionDuration: "280ms",
              width: animateCheck ? "72px" : "40px",
              height: animateCheck ? "72px" : "40px",
              transform: animateCheck ? "scale(1)" : "scale(0.4)",
              opacity: animateCheck ? 1 : 0,
            }}
          >
            {/* Checkmark SVG with stroke animation */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transitionProperty: "all",
                transitionDuration: "180ms",
                width: animateCheck ? "32px" : "18px",
                height: animateCheck ? "32px" : "18px",
                opacity: animateCheck ? 1 : 0,
              }}
            >
              <polyline
                points="20 6 9 17 4 12"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: animateCheck ? 0 : 30,
                  transition: "stroke-dashoffset 0.25s ease 0.15s",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Title — no animation */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
        {message && <p className="text-sm text-gray-400 mb-4">{message}</p>}

        {/* Divider — no animation */}
        <div className="w-full border-t border-gray-100 my-4" />

        {/* Sub text — no animation */}
        {subText && <p className="text-sm text-gray-400 mb-6">{subText}</p>}

        {/* OK Button — no animation */}
        <div className="w-full">
          <PopupActions
            actions={[
              {
                label: "OK",
                variant: "primary",
                onClick: onClose,
              },
            ]}
          />
        </div>
      </div>
    </ModalShell>
  );
}