"use client";

import React, { createContext, useContext, useState } from "react";

export type ReceiptSettings = {
  headerText: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;
  customerDetails: string;
};

type ReceiptSettingsContextType = {
  receiptSettings: ReceiptSettings;
  setReceiptSettings: (settings: ReceiptSettings) => void;
};

const defaultSettings: ReceiptSettings = {
  headerText: "",
  footerMessage: "",
  showLogo: true,
  showTaxNumber: false,
  taxNumber: "",
  showCustomerDetails: false,
  customerDetails: "",
};

const ReceiptSettingsContext = createContext<ReceiptSettingsContextType>({
  receiptSettings: defaultSettings,
  setReceiptSettings: () => {},
});

export function ReceiptSettingsProvider({ children }: { children: React.ReactNode }) {
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const saved = localStorage.getItem("receiptSettings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  return (
    <ReceiptSettingsContext.Provider value={{ receiptSettings, setReceiptSettings }}>
      {children}
    </ReceiptSettingsContext.Provider>
  );
}

export function useReceiptSettings() {
  return useContext(ReceiptSettingsContext);
}