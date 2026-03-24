"use client";

import { useState } from "react";
import { RegistrationData } from "@/app/companyregistration/page";

import GlassBackground from "@/components/saas/common/GlassBackground";
import BusinessCardGrid from "@/components/saas/businessType/BusinessCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  completedSteps: number;
};

export default function BusinessTypeStep({
  data,
  onNext,
  onBack,
}: Props) {
  const [selectedType, setSelectedType] = useState<string>(
    data.businessType || ""
  );

  const [showSubModal, setShowSubModal] = useState(false);
  const [subCategory, setSubCategory] = useState<string>(
    data.subCategory || ""
  );

  
  const BUSINESS_TYPE_MAP: Record<string, string> = {
    restaurant: "BT001",
    grocery: "BT003",
  };

  const RETAIL_SUBCATEGORIES = [
    { id: "BT002", label: "Textile" },
    { id: "BT004", label: "Pharmacy" },
    { id: "BT005", label: "Hardware" },
    { id: "BT006", label: "Bookshop" },
    { id: "BT007", label: "Other" },
  ];

  
  const handleSelect = (type: string) => {
    setSelectedType(type);

    if (type === "retail") {
      setShowSubModal(true);
    } else {
      setSubCategory("");
      setShowSubModal(false);
    }
  };

  
  const canProceed =
    selectedType.length > 0 &&
    (selectedType !== "retail" || subCategory.length > 0);

  
  const handleNext = () => {
    if (!canProceed) return;

    const finalBusinessType =
      selectedType === "retail"
        ? subCategory
        : BUSINESS_TYPE_MAP[selectedType];

    onNext({
      businessType: finalBusinessType,
    });
  };

  return (
    <>
      <GlassBackground>
        <div className="container mx-auto py-15">
          <h1 className="text-3xl font-bold text-center text-white mb-20">
            Select Your Business Type
          </h1>

          <BusinessCardGrid
            selected={selectedType}
            onSelect={handleSelect}
          />
        </div>
      </GlassBackground>

      
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSubModal(false)}
          />

          {/* Modal */}
          <div className="relative w-[420px] max-w-[90vw] rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(255,115,0,0.2)] p-6 text-white">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Select Your Retail Category
              </h2>

              <button
                onClick={() => setShowSubModal(false)}
                className="text-gray-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {RETAIL_SUBCATEGORIES.map((item) => {
                const isSelected = subCategory === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSubCategory(item.id)}
                    className={`
                      w-full py-3 rounded-xl transition-all border cursor-pointer
                      ${
                        isSelected
                          ? "bg-orange-500/20 border-orange-400 ring-2 ring-orange-400/40"
                          : "bg-white/5 border-white/10 hover:border-orange-400"
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isSelected && (
                        <span className="text-white font-bold">✓</span>
                      )}
                      <span className="font-medium">
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Confirm */}
            <button
              onClick={() => setShowSubModal(false)}
              disabled={!subCategory}
              className={`mt-5 w-full py-2 rounded-full font-medium transition ${
                subCategory
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="mt-10 flex items-center justify-center mb-20">
        <div className="flex w-full max-w-xl items-center justify-between text-white">
          <button
            onClick={onBack}
            className="font-semibold hover:opacity-80 cursor-pointer"
          >
            {"< Back"}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`font-semibold transition-opacity ${
              canProceed
                ? "hover:opacity-80 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            {"Next >"}
          </button>
        </div>
      </div>
    </>
  );
}