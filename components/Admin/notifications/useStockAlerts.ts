"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export type StockAlertLevel = "low_stock" | "out_of_stock";

export type StockAlertItem = {
  variantId: string;
  sku: string;
  productName: string;
  variantLabel: string;
  stockQty: number;
  lowStock: number;
  stockUnit: string;
  alertLevel: StockAlertLevel;
};

// Toast state — adds a unique display id + dismissed flag
export type AlertToast = StockAlertItem & {
  toastId: string;
  dismissed: boolean;
};

const POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const LOW_STOCK_AUTO_DISMISS_MS = 8_000;  // 8 seconds then re-appears next cycle

let toastCounter = 0;
function makeId() {
  return `toast-${++toastCounter}-${Date.now()}`;
}

export function useStockAlerts(enabled: boolean) {
  const { data: session, status } = useSession();
  const [toasts, setToasts] = useState<AlertToast[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const branchId = session?.user?.branchId ?? "";
  const sessionStatus = status;

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.toastId === toastId ? { ...t, dismissed: true } : t))
    );
    // Clear any auto-dismiss timer for this toast
    const timer = timeoutRefs.current.get(toastId);
    if (timer) {
      clearTimeout(timer);
      timeoutRefs.current.delete(toastId);
    }
  }, []);

  const fetchAndShow = useCallback(async () => {
    if (!enabled || !branchId) return;

    try {
      const res = await apiClient.get<{ success: boolean; data: StockAlertItem[] }>(
        "/branch-variants/stock-alerts"
      );
      const items = res.data?.data ?? [];

      if (items.length === 0) {
        setToasts([]);
        return;
      }

      setToasts((prev) => {
        const newToasts: AlertToast[] = items.map((item) => {
          // Reuse existing toastId if same variantId+level so UI is stable
          const existing = prev.find(
            (t) => t.variantId === item.variantId && t.alertLevel === item.alertLevel
          );
          return {
            ...item,
            toastId: existing?.toastId ?? makeId(),
            dismissed: false, // reset on each hourly refresh
          };
        });
        return newToasts;
      });
    } catch {
      // Silent fail — don't disrupt the UI
    }
  }, [enabled, branchId]);

  // Auto-dismiss low-stock toasts after a delay
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.alertLevel === "low_stock" && !toast.dismissed) {
        if (!timeoutRefs.current.has(toast.toastId)) {
          const timer = setTimeout(() => {
            setToasts((prev) =>
              prev.map((t) =>
                t.toastId === toast.toastId ? { ...t, dismissed: true } : t
              )
            );
            timeoutRefs.current.delete(toast.toastId);
          }, LOW_STOCK_AUTO_DISMISS_MS);
          timeoutRefs.current.set(toast.toastId, timer);
        }
      }
    });
  }, [toasts]);

  // Initial fetch + hourly interval
  useEffect(() => {
    if (!enabled || sessionStatus !== "authenticated" || !branchId) return;

    fetchAndShow();

    intervalRef.current = setInterval(fetchAndShow, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Clear all auto-dismiss timers
      timeoutRefs.current.forEach((t) => clearTimeout(t));
      timeoutRefs.current.clear();
    };
  }, [enabled, sessionStatus, branchId, fetchAndShow]);

  const visibleToasts = toasts.filter((t) => !t.dismissed);

  return { toasts: visibleToasts, dismiss };
}
