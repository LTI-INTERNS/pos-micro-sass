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

  const handleRetailCancel = () => {
    setShowRetailModal(false);
    setPendingRetailId("");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center mb-2">
              Select Retail Type
            </h2>
            <p className="text-sm text-white/50 text-center mb-6">
              Choose the category that best fits your retail business
            </p>

            <div className="flex flex-col gap-3">
              {RETAIL_SUBTYPES.map((sub, idx) => (
                <button
                  key={`${sub.id}-${idx}`}
                  onClick={() => setPendingRetailId(sub.id)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left
                    ${pendingRetailId === sub.id
                      ? "bg-white/20 text-white border border-white/40"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRetailCancel}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRetailConfirm}
                disabled={!pendingRetailId}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition
                  ${pendingRetailId
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/20 text-white/40 cursor-not-allowed"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessCardGrid;