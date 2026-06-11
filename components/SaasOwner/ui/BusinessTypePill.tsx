"use client";

import type { BusinessTypeEnum } from "@/types/subscription.types";

const TYPE_ICONS: Record<BusinessTypeEnum, string> = {
  CAFE: "☕",
  CLOTHING: "👕",
  SUPERMARKET: "🛒",
  PHARMACY: "💊",
  HARDWARE: "🔧",
  BOOKSHOP: "📚",
};

type Props = { type: BusinessTypeEnum };

export default function BusinessTypePill({ type }: Props) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-gray-50 border border-gray-200 text-gray-600 rounded-full px-2.5 py-0.5 font-medium">
      <span aria-hidden="true">{TYPE_ICONS[type] ?? "🏢"}</span>
      {type}
    </span>
  );
}
