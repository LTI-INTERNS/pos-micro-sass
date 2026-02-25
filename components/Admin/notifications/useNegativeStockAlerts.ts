"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { usePosSettings } from "@/lib/context/PosSettingsContext";
import { Product } from "@/lib/services";

export type NegativeStockAlertData = {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  lowStockThreshold: number;
  branchId: number;
  branchName: string;
  branchManager: string;
  alertedAt: string;
  severity: "critical" | "warning";
};

/**
 * useNegativeStockAlerts
 *
 * Fires a notification ONLY when a product's stock hits exactly 0
 * (out of stock / critical).
 *
 * - Reads `negativeStockAlertsEnabled` directly from PosSettingsContext,
 *   so toggling the switch in Settings → Features takes effect immediately
 *   without any prop drilling.
 * - Handles its own hydration guard: PosSettingsContext initialises with
 *   defaults and loads the real value from localStorage in a useEffect, so
 *   we wait one tick before trusting the flag.
 * - Dedup: fires exactly once per out-of-stock event; resets when stock
 *   rises back above 0 so future drops trigger a fresh alert.
 *
 * severity: always "critical" (stock === 0)
 */
export function useNegativeStockAlerts({
  products,
  branchId = 1,
  branchName = "Main Branch",
  branchManager = "Branch Manager",
}: {
  products: Product[];
  branchId?: number;
  branchName?: string;
  branchManager?: string;
}) {
  const { addNotification } = useNotifications();
  const { posSettings } = usePosSettings();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const enabled = posSettings.negativeStockAlertsEnabled ?? false;

  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  const alertedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Wait until the real setting has been loaded from localStorage.
    if (!hydrated) return;

    if (!enabled) {
      // Reset dedup state so alerts fire immediately when re-enabled.
      alertedRef.current.clear();
      return;
    }

    const now = new Date().toISOString();

    products.forEach((product) => {
      const isCritical = product.stock === 0;

      if (isCritical) {
        if (!alertedRef.current.has(product.id)) {
          addNotificationRef.current({
            message: `🚨 "${product.name}" is OUT OF STOCK at ${branchName}.`,
            type: "negative_stock",
            negativeStockAlert: {
              productId: product.id,
              productName: product.name,
              category: product.category,
              currentStock: product.stock,
              lowStockThreshold: product.lowstock,
              branchId,
              branchName,
              branchManager,
              alertedAt: now,
              severity: "critical",
            },
          });
          alertedRef.current.add(product.id);
        }
      } else {
        alertedRef.current.delete(product.id);
      }
    });
  }, [hydrated, enabled, products, branchId, branchName, branchManager]);
}