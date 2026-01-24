"use client";

import React from "react";

type Variant = "primary" | "outline";

type Props = {
  label: string;
  onClick?: () => void;
  variant?: Variant;

  
  className?: string;
  fullWidth?: boolean; 
};

export default function ActionButton({
  label,
  onClick,
  variant = "outline",
  className = "",
  fullWidth = true,
}: Props) {

  const base =
    `${fullWidth ? "flex-1" : ""} rounded-full py-2 text-xs font-semibold transition`;

  const styles = {
    outline:
      "border border-orange-400 bg-white text-orange-500 hover:bg-orange-50",
    primary:
      "bg-orange-500 text-white hover:bg-orange-600",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {label}
    </button>
  );
}
