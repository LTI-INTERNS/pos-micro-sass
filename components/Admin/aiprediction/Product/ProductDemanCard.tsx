"use client";

import React from "react";
import { ProductDemand, mockProducts } from "@/components/Admin/aiprediction/Product/mockProductData";

const statusColors: Record<ProductDemand["status"], string> = {
  "High Demand": "bg-green-100 text-green-600",
  Declining: "bg-red-100 text-red-600",
  Stable: "bg-orange-100 text-orange-600",
};

export default function ProductDemandList() {
  return (
    <div className="flex flex-col gap-4">
      {mockProducts.map((product, i) => {
        const arrow =
          product.status === "High Demand"
            ? "↑"
            : product.status === "Declining"
            ? "↓"
            : "→";

        const arrowColor =
          product.status === "High Demand"
            ? "text-green-500"
            : product.status === "Declining"
            ? "text-red-500"
            : "text-orange-500";

        return (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-4 flex justify-between items-center w-full"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {product.name}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className={`${arrowColor} font-semibold`}>
                  {arrow} {Math.abs(product.changePercent)}%
                </span>

                <span className="text-gray-400 text-sm">
                  {product.status === "High Demand"
                    ? "Increase"
                    : product.status === "Declining"
                    ? "Decrease"
                    : "Stable"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  statusColors[product.status]
                }`}
              >
                {product.status}
              </span>

              <p className="text-gray-400 text-xs mt-1">
                Confidence: {product.confidence}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
