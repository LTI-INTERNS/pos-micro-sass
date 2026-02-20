"use client";

import React, { useState, useRef, useEffect } from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import { Monitor, Mail, ShoppingBag, Barcode, X } from "lucide-react";

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tooltip?: string;
  learnMoreUrl?: string;
};

type FeaturesSectionProps = {
  features: {
    customerDisplays: boolean;
    lowStockNotifications: boolean;
    negativeStockAlerts: boolean;
    weightEmbeddedBarcodes: boolean;
  };
  onToggle: (featureId: string, value: boolean) => void;
};

const FEATURES: Feature[] = [
  {
    id: "customerDisplays",
    icon: <Monitor className="w-6 h-6 text-gray-500" />,
    title: "Customer displays",
    description: "Display order information to customers at the time of purchase.",
    tooltip:
      "Connect a secondary screen to your POS so customers can see itemized orders, totals, and payment prompts in real time. Supports most USB and HDMI display hardware.",
    learnMoreUrl: "#",
  },
  {
    id: "lowStockNotifications",
    icon: <Mail className="w-6 h-6 text-gray-500" />,
    title: "Low stock notifications",
    description: "Get daily email on items that are low or out of stock.",
    tooltip:
      "A daily digest is sent each morning listing every product that has fallen below its reorder threshold. Set individual thresholds per SKU in the Inventory settings.",
    learnMoreUrl: "#",
  },
  {
    id: "negativeStockAlerts",
    icon: <ShoppingBag className="w-6 h-6 text-gray-500" />,
    title: "Negative stock alerts",
    description: "Warn cashiers attempting to sell more inventory than available in stock.",
    tooltip:
      "When enabled, cashiers see a warning modal before completing a sale that would push stock below zero. You can choose to block the sale or allow it with manager approval.",
    learnMoreUrl: "#",
  },
  {
    id: "weightEmbeddedBarcodes",
    icon: <Barcode className="w-6 h-6 text-gray-500" />,
    title: "Weight embedded barcodes",
    description: "Allow to scan barcodes with embedded weight.",
    tooltip:
      "Supports GS1 DataBar and EAN-13 price-embedded formats. The scanner extracts the weight from the barcode and automatically calculates the line-item price using the per-unit rate.",
    learnMoreUrl: "#",
  },
];

function LearnMoreTooltip({
  tooltip,
  learnMoreUrl,
}: {
  tooltip: string;
  learnMoreUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !tooltipRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (tooltipRef.current && !tooltipRef.current.matches(":hover")) {
        setOpen(false);
      }
    }, 120);
  };

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={handleMouseLeave}
        className="text-green-600 hover:text-green-700 font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Learn more
      </button>

      {open && (
        <div
          ref={tooltipRef}
          role="tooltip"
          onMouseLeave={() => setOpen(false)}
          className="absolute z-50 bottom-full left-1/2 mb-2.5 w-72"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="relative bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-2xl leading-relaxed">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <span className="block pr-5">{tooltip}</span>

            {learnMoreUrl && learnMoreUrl !== "#" && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-green-400 hover:text-green-300 font-medium text-xs"
              >
                Open documentation →
              </a>
            )}

            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0"
              style={{
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #111827",
              }}
            />
          </div>
        </div>
      )}
    </span>
  );
}

export default function FeaturesSection({ features, onToggle }: FeaturesSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>

      <div className="space-y-6">
        {FEATURES.map((feature) => {
          const featureKey = feature.id as keyof typeof features;
          const isEnabled = features[featureKey];

          return (
            <div key={feature.id} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">{feature.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {feature.description}{" "}
                    {feature.learnMoreUrl && feature.tooltip && (
                      <LearnMoreTooltip
                        tooltip={feature.tooltip}
                        learnMoreUrl={feature.learnMoreUrl}
                      />
                    )}
                  </div>
                </div>
              </div>

              <ToggleSwitch
                enabled={isEnabled}
                onChange={(value) => onToggle(feature.id, value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}