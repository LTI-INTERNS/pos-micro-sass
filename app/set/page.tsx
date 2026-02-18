"use client";

import React from "react";
import DiscountContent from "@/app/components/Admin/settings/DiscountContent";

export default function TestDiscountsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <h1 className="text-2xl font-bold mb-5">Discount Management Test Page</h1>
      <DiscountContent />
    </div>
  );
}
