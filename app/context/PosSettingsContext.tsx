"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PosSettings = {
  customerDisplayEnabled: boolean;
  useCents: boolean;
  lowStockNotificationsEnabled: boolean;
  negativeStockAlertsEnabled: boolean;
};

type PosSettingsContextType = {
  posSettings: PosSettings;
  setPosSettings: (settings: Partial<PosSettings>) => void;
  hydrated: boolean;
};

const STORAGE_KEY = "pos_settings";

const DEFAULTS: PosSettings = {
  customerDisplayEnabled: true,
  useCents: false,
  lowStockNotificationsEnabled: false,
  negativeStockAlertsEnabled: false,
};

const PosSettingsContext = createContext<PosSettingsContextType>({
  posSettings: DEFAULTS,
  setPosSettings: () => {},
  hydrated: false,
});

export function PosSettingsProvider({ children }: { children: ReactNode }) {
  const [posSettings, setPosSettingsState] = useState<PosSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const loaded = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
      setPosSettingsState(loaded);
    } catch {
      setPosSettingsState(DEFAULTS);
    } finally {
      setHydrated(true);
    }
  }, []);

  const setPosSettings = (settings: Partial<PosSettings>) => {
    setPosSettingsState((prev) => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <PosSettingsContext.Provider value={{ posSettings, setPosSettings, hydrated }}>
      {children}
    </PosSettingsContext.Provider>
  );
}

export function usePosSettings() {
  return useContext(PosSettingsContext);
}