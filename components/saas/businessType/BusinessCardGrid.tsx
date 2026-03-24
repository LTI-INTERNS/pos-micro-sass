"use client";

import React from "react";
import Image from "next/image";
import BaseCard from "@/components/saas/common/BaseCard";

type Props = {
  selected: string;
  onSelect: (type: string) => void;
};

const BUSINESS_TYPES = [
  {
    id: "retail",
    title: "Retail",
    icon: <Image src="/saas/retail.png" alt="Retail" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true },
      { label: "Sales Tracking",       available: true },
      { label: "Customer Records",     available: true },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
  {
    id: "restaurant",
    Business_type_ID: "BT001",
    title: "Restaurant / Café",
    icon: <Image src="/saas/cafe.png" alt="Restaurant / Café" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true },
      { label: "Sales Tracking",       available: true },
      { label: "Customer Records",     available: true },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
  {
    id: "grocery",
    Business_type_ID: "BT003",
    title: "Grocery / Supermarket",
    icon: <Image src="/saas/supermarket.png" alt="Grocery / Supermarket" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true },
      { label: "Sales Tracking",       available: true },
      { label: "Customer Records",     available: true },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
];

const BusinessCardGrid = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start px-15">
      {BUSINESS_TYPES.map((type) => (
        <div
          key={type.id}
          className={`
            rounded-2xl transition-all duration-200
            ${selected === type.id
              ? "ring-4 ring-white-400 scale-[1.03] shadow-2xl"
              : "ring-0 hover:scale-[1.01] hover:shadow-xl"
            }
          `}
        >
          <BaseCard
            title={type.title}
            icon={type.icon}
            features={type.features}
            showButton
            buttonLabel={selected === type.id ? "✓ Selected" : "Select"}
            onClick={() => onSelect(type.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default BusinessCardGrid;