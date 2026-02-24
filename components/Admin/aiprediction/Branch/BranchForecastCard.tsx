"use client";

import React from "react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

export type BranchForecast = {
  branchName: string;
  currentSale: number;
  predictedSale: number;
  efficiencyPercent: number;
  highlighted?: boolean;
};

type Props = {
  branches: BranchForecast[];
};

export default function BranchForecastCard({ branches }: Props) {
  const { currency, useCents } = useCurrency();

  const getEfficiencyStyles = (value: number) => {
    if (value <= 0) {
      return "bg-red-100 text-red-600";
    }
    if (value <= 50) {
      return "bg-orange-100 text-orange-600";
    }
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {branches.map((data, index) => (
        <div
          key={index}
          className={`relative w-full rounded-xl p-5 bg-white border transition-all duration-200
            ${
              data.highlighted
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-gray-200"
            }
            hover:shadow-md`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-600">
              {data.branchName}
            </h4>

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${getEfficiencyStyles(
                data.efficiencyPercent
              )}`}
            >
              {data.efficiencyPercent > 0 ? "+" : ""}
              {data.efficiencyPercent}% Efficient
            </span>
          </div>

          <div className="flex flex-wrap gap-8 text-gray-600 text-base">
            <p>
              <span className="text-gray-500">Current Sale :</span>{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(data.currentSale, currency, useCents)}
              </span>
            </p>

            <p>
              <span className="text-gray-500">Predicted :</span>{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(data.predictedSale, currency, useCents)}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
