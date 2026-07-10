"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { settingsService } from "@/lib/services/settings-service";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  useCents: boolean;
  setUseCents: (value: boolean) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "LKR",
  setCurrency: () => {},
  useCents: false,
  setUseCents: () => {},
});

const POLL_INTERVAL_MS = 30_000;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("LKR");
  const [useCents, setUseCentsState] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage first (for instant render)
  useEffect(() => {
    const savedCurrency = localStorage.getItem("app_currency");
    const savedCents = localStorage.getItem("app_useCents");

    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedCents) setUseCentsState(savedCents === "true");
  }, []);

  const fetchFromDb = async () => {
    try {
      const s = await settingsService.get();
      if (!s) return;
      
      const newCurrency = s.currency ?? "LKR";
      const newUseCents = s.useCents ?? false;
      
      setCurrencyState(newCurrency);
      setUseCentsState(newUseCents);
      
      localStorage.setItem("app_currency", newCurrency);
      localStorage.setItem("app_useCents", newUseCents.toString());
    } catch {
      // Keep existing values
    }
  };

  useEffect(() => {
    // 1. Fetch immediately on mount
    fetchFromDb();

    // 2. Poll every 30 s to sync changes from database
    intervalRef.current = setInterval(fetchFromDb, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("app_currency", newCurrency);
  };

  const setUseCents = (value: boolean) => {
    setUseCentsState(value);
    localStorage.setItem("app_useCents", value.toString());
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, useCents, setUseCents }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);