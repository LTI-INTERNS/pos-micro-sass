"use client";

import { useEffect, useState } from "react";
import { settingsService } from "@/lib/services/settings-service";
import { useStockAlerts } from "./useStockAlerts";
import StockAlertToast from "./StockAlertToast";

/**
 * Drop this anywhere inside a layout.
 * It reads the lowStock setting from the DB, then conditionally
 * renders the stock-alert toasts.
 */
export default function StockAlertProvider() {
  const [lowStockEnabled, setLowStockEnabled] = useState(false);

  useEffect(() => {
    settingsService
      .get()
      .then((s) => setLowStockEnabled(s?.lowStock ?? false))
      .catch(() => {}); // silent — feature just stays disabled
  }, []);

  const { toasts, dismiss } = useStockAlerts(lowStockEnabled);

  return <StockAlertToast toasts={toasts} onDismiss={dismiss} />;
}
