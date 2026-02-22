"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/app/context/NotificationsContext";
import type { Product } from "@/app/productmanagement/data";

/**
 * useLowStockNotifications
 *
 * Fires a notification when a product's stock drops AT OR BELOW its
 * lowstock threshold (but still > 0). Controlled by the
 * "Low stock notifications" toggle in Settings → Features.
 *
 * severity: always "warning" (stock is low but not zero)
 */
export function useLowStockNotifications({
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
      const isLow = product.stock > 0 && product.stock <= product.lowstock;
      const lastAlertedStock = alertedRef.current.get(product.id);

      if (lastAlertedStock === product.stock) return;

      if (isLow) {
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
      } else {
        alertedRef.current.delete(product.id);
      }
    });
  }, [hydrated, enabled, products, branchId, branchName, branchManager]);
}