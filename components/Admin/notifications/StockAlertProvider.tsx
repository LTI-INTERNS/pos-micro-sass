"use client";

import { useStockAlerts } from "./useStockAlerts";
import StockAlertToast from "./StockAlertToast";
import { usePosSettings } from "@/lib/context/PosSettingsContext";

/**
 * Reads lowStockNotificationsEnabled from PosSettingsContext (which already
 * polls the DB every 30 s) — no duplicate fetch needed here.
 */
export default function StockAlertProvider() {
  const { posSettings } = usePosSettings();
  const lowStockEnabled = posSettings.lowStockNotificationsEnabled ?? false;

  const { toasts, dismiss } = useStockAlerts(lowStockEnabled);

  return <StockAlertToast toasts={toasts} onDismiss={dismiss} />;
}
