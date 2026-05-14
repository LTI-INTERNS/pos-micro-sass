"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { usePosSettings } from "@/lib/context/PosSettingsContext";
import { Product } from "@/lib/services";

/**
 * useLowStockNotifications
 *
 * Fires a notification when a product's stock drops AT OR BELOW its
 * lowstock threshold (but still > 0).
 *
 * - Reads `lowStockNotificationsEnabled` directly from PosSettingsContext,
 *   so toggling the switch in Settings → Features takes effect immediately
 *   without any prop drilling.
 * - Handles its own hydration guard: PosSettingsContext initialises with
 *   defaults and loads the real value from localStorage in a useEffect, so
 *   we wait one tick before trusting the flag.
 * - Dedup: tracks the exact stock value that last triggered an alert per
 *   product. Only fires again if stock drops further (new lower value) or
 *   after it recovers above the threshold and dips below again.
 *
 * severity: always "warning" (stock is low but not zero)
 */
export function useLowStockNotifications({
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

  const enabled = posSettings.lowStockNotificationsEnabled ?? false;

  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  const alertedRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!hydrated) return;

    if (!enabled) {
      alertedRef.current.clear();
      return;
    }

    const now = new Date().toISOString();

    products.forEach((product) => {

      const isLow = product.stock > 0 && product.stock <= product.lowstock;
      const lastAlertedStock = alertedRef.current.get(product.id);

      if (isLow) {

        if (lastAlertedStock !== product.stock) {
          addNotificationRef.current({
            message: `⚠️ "${product.name}" is low (${product.stock} left, threshold: ${product.lowstock}) at ${branchName}.`,
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
              severity: "warning",
            },
          });
          alertedRef.current.set(product.id, product.stock);
        }
      } else {
        alertedRef.current.delete(product.id);
      }
    });
  }, [hydrated, enabled, products, branchId, branchName, branchManager]);
}