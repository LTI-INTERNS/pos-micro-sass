"use client";

import React from "react";
import FormField from "@/app/components/Admin/common/FormField";

type LoyaltySettingsProps = {
  pointsEarningPercentage: number;
  onPointsEarningChange: (percentage: number) => void;
};

export default function LoyaltySettingsSection({
  pointsEarningPercentage,
  onPointsEarningChange,
}: LoyaltySettingsProps) {
  const handleChange = (value: string) => {
    const parsed = parseFloat(value);

    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      onPointsEarningChange(parsed);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Loyalty Settings
      </h2>

      <div className="space-y-5">
        <div className="relative">
          <FormField
            label="Points Earning Percentage"
            type="number"
            value={pointsEarningPercentage.toString()}
            onChange={handleChange}
            placeholder="Enter percentage"
          />

          <div className="absolute right-4 top-[38px] pointer-events-none text-gray-500 text-sm font-medium">
            %
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Customers will earn {pointsEarningPercentage}% of their purchase amount
          as loyalty points.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600">
            <span className="font-medium">Example:</span> If a customer spends
            LKR 1,000 with {pointsEarningPercentage}% earning rate, they will
            receive {(1000 * pointsEarningPercentage) / 100} loyalty points.
          </p>
        </div>
      </div>
    </div>
  );
}
