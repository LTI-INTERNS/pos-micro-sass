"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { settingsService } from "@/lib/services/settings-service";

// ── Types ─────────────────────────────────────────────────────────────────────

type PosSettings = {
  customerDisplayEnabled: boolean;
  lowStockNotificationsEnabled?: boolean;
  negativeStockAlertsEnabled?: boolean;
};

type PosSettingsContextType = {
  posSettings: PosSettings;
  /** Optimistic in-memory update — called by the settings form after saving. */
  setPosSettings: (settings: Partial<PosSettings>) => void;
  /** Manually re-fetch from the DB right now. */
  refreshSettings: () => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULTS: PosSettings = {
  customerDisplayEnabled: false,
  lowStockNotificationsEnabled: false,
  negativeStockAlertsEnabled: false,
};

/**
 * How often the client re-fetches settings from the database.
 * 30 s gives near-real-time cross-browser propagation.
 */
const POLL_INTERVAL_MS = 30_000;

// ── Context ───────────────────────────────────────────────────────────────────

const PosSettingsContext = createContext<PosSettingsContextType>({
  posSettings: DEFAULTS,
  setPosSettings: () => {},
  refreshSettings: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function PosSettingsProvider({ children }: { children: ReactNode }) {
  const [posSettings, setPosSettingsState] = useState<PosSettings>(DEFAULTS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Pull current values from the DB and merge them into state. */
  const fetchFromDb = async () => {
    try {
      const s = await settingsService.get();
      if (!s) return;
      setPosSettingsState({
        customerDisplayEnabled:     s.cusDisplay,
        lowStockNotificationsEnabled: s.lowStock,
        negativeStockAlertsEnabled:  s.negativeStock,
      });
    } catch {
      // Non-fatal — keep the last-known values
    }
  };

  useEffect(() => {
    // 1. Fetch immediately on mount (no localStorage, always fresh from DB)
    fetchFromDb();

    // 2. Poll every 30 s to pick up admin changes made in another browser
    intervalRef.current = setInterval(fetchFromDb, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Optimistic update so the admin settings page feels instant. */
  const setPosSettings = (settings: Partial<PosSettings>) => {
    setPosSettingsState((prev) => ({ ...prev, ...settings }));
  };

  return (
    <PosSettingsContext.Provider
      value={{ posSettings, setPosSettings, refreshSettings: fetchFromDb }}
    >
      {children}
    </PosSettingsContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePosSettings() {
  return useContext(PosSettingsContext);
}