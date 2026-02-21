"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type StoreInfo = {
  storeName: string;
  branchName: string;
  cashierName: string;
  telephone: string;
  logoUrl: string | null;
};

const defaultStoreInfo: StoreInfo = {
  storeName: "Coca",
  branchName: "Main Branch",
  cashierName: "Cashier",
  telephone: "+94 11 234 5678",
  logoUrl: "/logo.svg",
};

type StoreInfoContextType = {
  storeInfo: StoreInfo;
  setStoreInfo: (info: StoreInfo) => void;
};

const StoreInfoContext = createContext<StoreInfoContextType>({
  storeInfo: defaultStoreInfo,
  setStoreInfo: () => {},
});

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const [storeInfo, setStoreInfoState] = useState<StoreInfo>(() => {
    //Load from localStorage as fallback on mount
    if (typeof window === "undefined") return defaultStoreInfo;
    const saved = localStorage.getItem("storeInfo");
    return saved ? { ...defaultStoreInfo, ...JSON.parse(saved) } : defaultStoreInfo;
  });

  useEffect(() => {
    // Try to fetch from backend
    // When backend is ready, replace this with your real API call:
    // const res = await fetch("/api/store-info");
    // const data = await res.json();
    // setStoreInfoState(data);
    // localStorage.setItem("storeInfo", JSON.stringify(data));

    // 🔧 PLACEHOLDER: remove this block when backend is ready
    console.log("StoreInfo: using localStorage/default until backend is ready");
  }, []);

  const setStoreInfo = (info: StoreInfo) => {
    setStoreInfoState(info);
    localStorage.setItem("storeInfo", JSON.stringify(info));
  };

  return (
    <StoreInfoContext.Provider value={{ storeInfo, setStoreInfo }}>
      {children}
    </StoreInfoContext.Provider>
  );
}

export function useStoreInfo() {
  return useContext(StoreInfoContext);
}