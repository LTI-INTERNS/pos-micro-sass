"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export type StoreInfo = {
  storeName: string;
  branchName: string;
  cashierName: string;
  telephone: string;
  logoUrl: string | null;
};

const defaultStoreInfo: StoreInfo = {
  storeName:   "",
  branchName:  "",
  cashierName: "",
  telephone:   "",
  logoUrl:     null,
};

type StoreInfoContextType = {
  storeInfo:    StoreInfo;
  setStoreInfo: (info: Partial<StoreInfo>) => void;
};

const StoreInfoContext = createContext<StoreInfoContextType>({
  storeInfo: defaultStoreInfo,
  setStoreInfo: () => {},
});

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [storeInfo, setStoreInfoState] = useState<StoreInfo>(defaultStoreInfo);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    setStoreInfoState((prev) => ({
      ...prev,
      storeName:   session.user.companyName || prev.storeName,
      branchName:  session.user.branchName  || prev.branchName,
      cashierName: session.user.name        || prev.cashierName,
      // telephone and logoUrl are not in the session — they come from the
      // backend (company/branch record). Set them via setStoreInfo() once
      // the relevant API call is made in the consuming page.
    }));
  }, [status, session]);

  // ── Allow individual fields to be overridden (e.g. logoUrl from API) ─────
  const setStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfoState((prev) => ({ ...prev, ...info }));
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