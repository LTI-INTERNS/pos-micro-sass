"use client";

import React from "react";
import ToggleSwitch from "../../common/ToggleSwitch";
import { Monitor, Mail, ShoppingBag, Barcode } from "lucide-react";

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
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
    learnMoreUrl: "#",
  },
  {
    id: "lowStockNotifications",
    icon: <Mail className="w-6 h-6 text-gray-500" />,
    title: "Low stock notifications",
    description: "Get daily email on items that are low or out of stock.",
    learnMoreUrl: "#",
  },
  {
    id: "negativeStockAlerts",
    icon: <ShoppingBag className="w-6 h-6 text-gray-500" />,
    title: "Negative stock alerts",
    description: "Warn cashiers attempting to sell more inventory than available in stock.",
    learnMoreUrl: "#",
  },
  {
    id: "weightEmbeddedBarcodes",
    icon: <Barcode className="w-6 h-6 text-gray-500" />,
    title: "Weight embedded barcodes",
    description: "Allow to scan barcodes with embedded weight.",
    learnMoreUrl: "#",
  },
];

export default function FeaturesSection({
  features,
  onToggle,
}: FeaturesSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
      
      <div className="space-y-6">
        {FEATURES.map((feature) => {
          const featureKey = feature.id as keyof typeof features;
          const isEnabled = features[featureKey];
          
          return (
            <div
              key={feature.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {feature.description}{" "}
                    {feature.learnMoreUrl && (
                      <a
                        href={feature.learnMoreUrl}
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        Learn more
                      </a>
                    )}
                  </p>
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
