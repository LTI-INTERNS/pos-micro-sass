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

type UseNegativeStockAlertsOptions = {
  products: Product[];
  branchId?: number;
  branchName?: string;
  branchManager?: string;
  enabled?: boolean;
  hydrated?: boolean;
};

export function useNegativeStockAlerts({
  products,
  branchId = 1,
  branchName = "Main Branch",
  branchManager = "Branch Manager",
  enabled = false,
  hydrated = false,
}: UseNegativeStockAlertsOptions) {
  const { addNotification } = useNotifications();

  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  const alertedRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    console.log("[StockAlert] useEffect fired — hydrated:", hydrated, "enabled:", enabled);

    if (!hydrated) {
      console.log("[StockAlert] skipping — not hydrated yet");
      return;
    }

    if (!enabled) {
      console.log("[StockAlert] skipping — feature disabled, clearing cache");
      alertedRef.current.clear();
      return;
    }

    console.log("[StockAlert] scanning", products.length, "products");

    const now = new Date().toISOString();

    products.forEach((product) => {
      const isLow = product.stock <= product.lowstock;
      const isCritical = product.stock === 0;
      const lastAlertedStock = alertedRef.current.get(product.id);

      console.log(
        `[StockAlert] ${product.name}: stock=${product.stock} lowstock=${product.lowstock} isLow=${isLow} lastAlerted=${lastAlertedStock}`
      );

      if (lastAlertedStock === product.stock) {
        console.log(`[StockAlert] ${product.name}: already alerted at this stock, skipping`);
        return;
      }

      if (isLow) {
        const severity: "critical" | "warning" = isCritical ? "critical" : "warning";

        const alertData: NegativeStockAlertData = {
          productId: product.id,
          productName: product.name,
          category: product.category,
          currentStock: product.stock,
          lowStockThreshold: product.lowstock,
          branchId,
          branchName,
          branchManager,
          alertedAt: now,
          severity,
        };

        const message = isCritical
          ? `🚨 "${product.name}" is OUT OF STOCK at ${branchName}.`
          : `⚠️ "${product.name}" is low (${product.stock} left, threshold: ${product.lowstock}) at ${branchName}.`;

        console.log(`[StockAlert] FIRING notification for ${product.name}`);
        addNotificationRef.current({
          message,
          type: "negative_stock",
          negativeStockAlert: alertData,
        });

        alertedRef.current.set(product.id, product.stock);
      } else {
        alertedRef.current.delete(product.id);
      }
    });
  }, [hydrated, enabled, products, branchId, branchName, branchManager]);
}