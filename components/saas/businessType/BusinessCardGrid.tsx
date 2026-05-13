"use client";

import React, { useState } from "react";
import Image from "next/image";
import BaseCard from "@/components/saas/common/BaseCard";

type Props = {
  selected: string;
  onSelect: (type: string) => void;
};

const RETAIL_SUBTYPES = [
  { id: "BT002", label: "Textile / Clothing" },
  { id: "BT004", label: "Pharmacy"           },
  { id: "BT005", label: "Hardware"           },
  { id: "BT006", label: "Bookshop"           },
  { id: "BT007", label: "Other Retail"       },
];

const RETAIL_IDS = new Set(["BT002", "BT004", "BT005", "BT006", "BT007"]);

const BUSINESS_TYPES = [
  {
    id: "RETAIL",
    title: "Retail",
    icon: <Image src="/saas/retail.png" alt="Retail" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true  },
      { label: "Sales Tracking",       available: true  },
      { label: "Customer Records",     available: true  },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
  {
    id: "BT001",
    title: "Restaurant / Café",
    icon: <Image src="/saas/cafe.png" alt="Restaurant / Café" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true  },
      { label: "Sales Tracking",       available: true  },
      { label: "Customer Records",     available: true  },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
  {
    id: "BT003",
    title: "Grocery / Supermarket",
    icon: <Image src="/saas/supermarket.png" alt="Grocery / Supermarket" width={80} height={80} className="object-contain" />,
    features: [
      { label: "Inventory Management", available: true  },
      { label: "Sales Tracking",       available: true  },
      { label: "Customer Records",     available: true  },
      { label: "Advanced Reports",     available: false },
      { label: "Multi Branch",         available: false },
    ],
  },
];

const BusinessCardGrid = ({ selected, onSelect }: Props) => {
  const [showRetailModal, setShowRetailModal] = useState(false);
  const [pendingRetailId, setPendingRetailId] = useState<string>("");

  const isRetailSelected = RETAIL_IDS.has(selected);

  const handleCardClick = (id: string) => {
    if (id === "RETAIL") {
      setPendingRetailId(isRetailSelected ? selected : "");
      setShowRetailModal(true);
    } else {
      onSelect(id);
    }
  };

  const handleRetailConfirm = () => {
    if (!pendingRetailId) return;
    onSelect(pendingRetailId);
    setShowRetailModal(false);
  };


  const selectedRetailLabel = isRetailSelected
    ? RETAIL_SUBTYPES.find((s) => s.id === selected)?.label ?? "Retail"
    : null;

  return (
    <>
      {/* ── Main business-type cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start px-15">
        {BUSINESS_TYPES.map((type) => {
          const isSelected =
            type.id === "RETAIL" ? isRetailSelected : selected === type.id;

          return (
            <div
              key={type.id}
              className={`
                rounded-2xl transition-all duration-200
                ${isSelected
                  ? "ring-4 ring-white-400 scale-[1.03] shadow-2xl"
                  : "ring-0 hover:scale-[1.01] hover:shadow-xl"
                }
              `}
            >
              <BaseCard
                title={
                  type.id === "RETAIL" && selectedRetailLabel
                    ? `Retail — ${selectedRetailLabel}`
                    : type.title
                }
                icon={type.icon}
                features={type.features}
                showButton
                buttonLabel={isSelected ? "✓ Selected" : "Select"}
                onClick={() => handleCardClick(type.id)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Retail sub-type modal ── */}
      {showRetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRetailModal(false)}
          />

          {/* Modal */}
          <div className="relative w-[420px] max-w-[90vw] rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(255,115,0,0.2)] p-6 text-white">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Select Your Retail Category
              </h2>
              <button
                onClick={() => setShowRetailModal(false)}
                className="text-gray-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {RETAIL_SUBTYPES.map((item) => {
                const isSelected = pendingRetailId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPendingRetailId(item.id)}
                    className={`
                      w-full py-3 rounded-xl transition-all border cursor-pointer
                      ${isSelected
                        ? "bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/40"
                        : "bg-white/5 border-white/10 hover:border-orange-400"
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isSelected && <span className="text-white font-bold">✓</span>}
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm */}
            <button
              onClick={handleRetailConfirm}
              disabled={!pendingRetailId}
              className={`mt-5 w-full py-2 rounded-full font-medium transition ${
                pendingRetailId
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessCardGrid;