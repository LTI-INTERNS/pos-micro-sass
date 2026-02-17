"use client";

import React from "react";
import BaseCard from "../common/BaseCard";

type Props = {
  selected: string;
  onSelect: (type: string) => void;
};

const BUSINESS_TYPES = [
  {
    id: "retail",
    title: "Retail",
    icon: <img src="/retail.png" alt="Retail" className="w-20 h-20 object-contain" />,
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
    title: "Restaurant / Café",
    icon: <img src="/cafe.png" alt="Restaurant / Café" className="w-20 h-20 object-contain" />,
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
    title: "Grocery / Supermarket",
    icon: <img src="/supermarket.png" alt="Grocery / Supermarket" className="w-20 h-20 object-contain" />,
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