"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-full rounded-full py-3 font-semibold transition",
        "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        "hover:brightness-110 active:scale-[0.99]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
