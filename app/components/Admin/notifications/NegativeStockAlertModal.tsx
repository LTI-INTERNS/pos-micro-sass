"use client";

import React from "react";
import { AlertTriangle, Package, MapPin, User, Clock, TrendingDown, X } from "lucide-react";
import ModalShell from "@/app/components/Admin/common/ModalShell";
import PopupActions from "@/app/components/Admin/common/PopupActions";
import type { NegativeStockAlertData } from "./useNegativeStockAlerts";

type Props = {
  open: boolean;
  onClose: () => void;
  data: NegativeStockAlertData | null;
};

export default function NegativeStockAlertModal({ open, onClose, data }: Props) {
  if (!data) return null;

  const isCritical = data.severity === "critical";

  // How far stock is relative to threshold (capped at 100%)
  const stockPercent =
    data.lowStockThreshold > 0
      ? Math.min((data.currentStock / data.lowStockThreshold) * 100, 100)
      : 0;

  const formattedTime = new Date(data.alertedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <ModalShell
      open={open}
      title="Stock Alert"
      onClose={onClose}
      widthClassName="w-[520px] max-w-[94vw]"
    >
      <div className="space-y-4">

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            isCritical ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              isCritical ? "bg-red-100" : "bg-amber-100"
            }`}
          >
            {isCritical ? (
              <X className="w-5 h-5 text-red-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <p className={`text-sm font-bold tracking-wide ${isCritical ? "text-red-700" : "text-amber-700"}`}>
              {isCritical ? "OUT OF STOCK — CRITICAL" : "LOW STOCK — WARNING"}
            </p>
            <p className={`text-xs mt-0.5 ${isCritical ? "text-red-500" : "text-amber-500"}`}>
              {isCritical
                ? "This product has zero inventory. Immediate restocking required."
                : `Stock has fallen to or below the threshold of ${data.lowStockThreshold} units.`}
            </p>
          </div>
        </div>

        {/* ── Product Details ── */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Product Details
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Product Name</p>
              <p className="text-gray-800 font-semibold">{data.productName}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Category</p>
              <p className="text-gray-800 font-semibold">{data.category}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Product ID</p>
              <p className="text-gray-800 font-mono font-semibold">{data.productId}</p>
            </div>
          </div>
        </div>

        {/* ── Stock Level Visual ── */}
        <div className="px-4 py-4 bg-white rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Stock Level
            </span>
          </div>

          <div className="flex items-end justify-between text-sm mb-1">
            <span className="text-gray-500 text-xs">Current Stock</span>
            <span className={`text-lg font-bold ${isCritical ? "text-red-600" : "text-amber-600"}`}>
              {data.currentStock}{" "}
              <span className="text-xs font-normal text-gray-400">units</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical ? "bg-red-500" : stockPercent < 40 ? "bg-amber-500" : "bg-amber-400"
              }`}
              style={{ width: `${Math.max(stockPercent, isCritical ? 0 : 3)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0 units</span>
            <span>Low stock threshold: {data.lowStockThreshold} units</span>
          </div>
        </div>

        {/* ── Branch & Manager ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">Branch</span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{data.branchName}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Branch ID: {data.branchId}</p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">Manager</span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{data.branchManager}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Branch Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Alert generated: {formattedTime}</span>
        </div>

        <PopupActions
          actions={[
            { label: "Dismiss", onClick: onClose, variant: "secondary" },
            {
              label: "Go to Product Management",
              onClick: () => {
                onClose();
                window.location.href = "/productmanagement";
              },
              variant: "primary",
            },
          ]}
        />
      </div>
    </ModalShell>
  );
}