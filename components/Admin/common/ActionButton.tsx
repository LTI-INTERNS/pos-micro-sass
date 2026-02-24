"use client";

import React from "react";

type Variant = "primary" | "outline";

type Props = {

  label?: string;
  variant?: Variant;
  fullWidth?: boolean;

  children?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;


  onClick?: () => void;
  className?: string;
};

export default function ActionButton({
  label,
  children,
  variant = "outline",
  fullWidth = true,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: Props) {
 
  if (children) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={[
          fullWidth ? "w-full" : "",
          "rounded-full py-3 font-semibold transition",
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
          "hover:brightness-110",
          "disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-90",
          className,
        ].join(" ")}
      >
        {children}
      </button>
    );
  }

  const base = `${fullWidth ? "flex-1" : ""} rounded-full py-2 text-xs font-semibold transition`;
  const styles = {
    outline:
      "border border-orange-400 bg-white text-orange-500 hover:bg-orange-50 cursor-pointer",
    primary: "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className} transition-all active:scale-90 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
}
