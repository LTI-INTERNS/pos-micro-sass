import { useState, useCallback } from "react";

export type LandingToastType = "success" | "error" | "info";

export interface LandingToastMessage {
  id: string;
  message: string;
  type: LandingToastType;
}

export function useLandingToast() {
  const [toasts, setToasts] = useState<LandingToastMessage[]>([]);

  const showToast = useCallback((message: string, type: LandingToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 6 seconds (slightly longer for landing page reading)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}