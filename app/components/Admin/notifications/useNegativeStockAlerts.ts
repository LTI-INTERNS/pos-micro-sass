"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/app/context/NotificationsContext";
import type { Product } from "@/app/productmanagement/data";

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
 * (out of stock / critical). Controlled by the
 * "Negative stock alerts" toggle in Settings → Features.
 *
 * severity: always "critical" (stock === 0)
 */
export function useNegativeStockAlerts({
  products,
  branchId = 1,
  branchName = "Main Branch",
  branchManager = "Branch Manager",
  enabled = false,
  hydrated = false,
}: {
  products: Product[];
  branchId?: number;
  branchName?: string;
  branchManager?: string;
  enabled?: boolean;
  hydrated?: boolean;
}) {
  const { addNotification } = useNotifications();

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
      const isCritical = product.stock === 0;
      const lastAlertedStock = alertedRef.current.get(product.id);

      if (lastAlertedStock === product.stock) return;

      if (isCritical) {
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
        alertedRef.current.set(product.id, product.stock);
      } else {
        alertedRef.current.delete(product.id);
      }
    });
  }, [hydrated, enabled, products, branchId, branchName, branchManager]);
}