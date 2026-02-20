"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "LKR",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("LKR");

  useEffect(() => {
    const saved = localStorage.getItem("app_currency");
    if (saved) setCurrencyState(saved);
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("app_currency", newCurrency);
  };

  //database conect
  //const setCurrency = async (newCurrency: string) => {
   // setCurrencyState(newCurrency);
    //localStorage.setItem("currency", newCurrency); // keep as cache

    // Add this when DB is ready:
    //await fetch("/api/settings", {
      //  method: "PATCH",
      //  body: JSON.stringify({ currency: newCurrency }),
   // });
    //};

    // onload
   //useEffect(() => {
    // Replace localStorage read with:
   // fetch("/api/settings")
    //    .then(res => res.json())
    //    .then(data => setCurrencyState(data.currency));
   // }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);