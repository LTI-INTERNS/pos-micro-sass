"use client";

import React from "react";

type Props = {
  name: string;
  type: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function CompanySelectItem({
  name,
  type,
  selected = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between",
        "px-6 py-4 rounded-2xl",
        "border transition cursor-pointer",
        selected
          ? "border-orange-500/80 shadow-[0_0_0_1px_rgba(249,115,22,0.35)]"
          : "border-white/40 hover:border-orange-500/70",
        "bg-black/20 backdrop-blur-sm",
        "text-white",
      ].join(" ")}
    >
      <span className="text-base">{name}</span>
      <span className="text-sm text-white/80">{type}</span>
    </button>
  );
}
