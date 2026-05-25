"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { notificationService } from "@/lib/services/notification-service";
import type { ApiNotification } from "@/lib/services/notification-service";
import type { NegativeStockAlertData } from "@/components/Admin/notifications/useNegativeStockAlerts";

// ── Re-export ApiNotification for consumers ───────────────────────────────────
export type { ApiNotification };

// ── Local UI notification types ───────────────────────────────────────────────

export type NotificationType =
  | "info"
  | "warning"
  | "error"
  | "success"
  | "approval_pending"
  | "negative_stock"
  | "subscription_upgrade";

/** Flattened shape used by the UI panels / modals */
export type ProductApprovalData = {
  /** The DB notification UUID */
  notifId: string;
  /** Frontend-compatible numeric id for legacy modal props */
  id: string;
  productName: string;
  category?: string;
  brand?: string;
  description?: string;
  price: number;
  discount: number;
  tax: number;
  stock: number;
  unit?: string;
  imageUrl?: string;
  branchId: string;
  branchName: string;
  branchManager: string;
  submittedBy: string;
  submittedAt: string;
  reviewedAt?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  rejectedBy?: string;
  reviewerName?: string;
  reviewerRole?: string;
  rejectionReason?: string;
  options?: any[];
  variants?: any[];
};

export type Notification = {
  id: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  productApproval?: ProductApprovalData;
  negativeStockAlert?: NegativeStockAlertData;
};

type NotificationsContextValue = {
  notifications: Notification[];
  unreadCount: number;
  /** Add a local-only notification (e.g. stock alerts) */
  addNotification: (n: Omit<Notification, "id" | "read" | "time">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateNotification: (id: string, patch: Partial<Notification>) => void;
  /** Re-fetch notifications from the backend */
  refreshNotifications: () => Promise<void>;
  /** True while the initial fetch is in progress */
  loading: boolean;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// ── Helper: map a backend ApiNotification to a UI Notification ────────────────

function mapApiNotification(n: ApiNotification, role?: string): Notification {
  const productData = n.productData;
  const branchName = n.branch?.city
    ? `${n.branch.name} (${n.branch.city})`
    : n.branch?.name ?? "";

  const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
    PENDING:  "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  };

  const approvalData: ProductApprovalData = {
    notifId:       n.notifId,
    id:            n.notifId,
    productName:   productData?.name ?? "",
    brand:         productData?.brand,
    description:   productData?.description,
    price:         Number(productData?.variants?.[0]?.sellingPrice ?? 0),
    discount:      0,
    tax:           0,
    stock:         0,
    unit:          productData?.variants?.[0]?.sellUnit ?? "each",
    imageUrl:      productData?.variants?.[0]?.imageUrl ?? undefined,
    branchId:      n.branchId ?? "",
    branchName,
    branchManager: n.manager?.name ?? "",
    submittedBy:   n.manager?.email ?? n.manager?.name ?? "",
    submittedAt:   n.createdAt,
    reviewedAt:    n.reviewedAt ?? undefined,
    status:        statusMap[n.status] ?? "pending",
    approvedBy:    n.status === "APPROVED" ? (n.reviewedBy ?? undefined) : undefined,
    rejectedBy:    n.status === "REJECTED" ? (n.reviewedBy ?? undefined) : undefined,
    reviewerName:  n.reviewerName ?? undefined,
    reviewerRole:  n.reviewerRole ?? undefined,
    rejectionReason: n.rejectionReason ?? undefined,
    options:       productData?.options ?? [],
    variants:      productData?.variants ?? [],
  };

  const createdAt = n.createdAt ? new Date(n.createdAt) : new Date();
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  let time: string;
  if (diffMins < 1)        time = "Just now";
  else if (diffMins < 60)  time = `${diffMins}m ago`;
  else if (diffMins < 1440) time = `${Math.floor(diffMins / 60)}h ago`;
  else time = createdAt.toLocaleDateString([], { month: "short", day: "numeric" });

  const typeMap: Record<string, NotificationType> = {
    PENDING:  "approval_pending",
    APPROVED: "success",
    REJECTED: "error",
  };

  const isManager = role?.toUpperCase() === "MANAGER";
  const read = isManager ? n.readByManager : n.readByAdmin;

  if (n.type === 'SUBSCRIPTION_UPGRADE') {
    const pData = n.productData || {};
    const reqName = pData.requestedBy || 'A user';
    const reqRole = pData.role ? pData.role.toLowerCase() : 'manager';
    const reqBranch = pData.branchName && pData.branchName !== 'N/A' ? ` from ${pData.branchName}` : '';
    
    return {
      id: n.notifId,
      message: `${reqName} (${reqRole})${reqBranch} requested a plan upgrade to unlock AI Prediction.`,
      type: "subscription_upgrade",
      time,
      read,
    };
  }

  return {
    id:      n.notifId,
    message: `Product approval request: "${approvalData.productName}" — ${n.branch?.name ?? ""}`,
    type:    typeMap[n.status] ?? "info",
    time,
    read,
    productApproval: approvalData,
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const role = session?.user?.role?.toUpperCase();
  const isAdminOrOwner = role === "ADMIN" || role === "OWNER";

  // We keep two separate arrays so we can merge stock-alert toasts (local)
  // with DB-backed product-approval notifications.
  const [apiNotifications,   setApiNotifications]   = useState<Notification[]>([]);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [loading,            setLoading]            = useState(false);

  const refreshNotifications = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const raw = await notificationService.getAll();
      const mapped = raw.map(n => mapApiNotification(n, role));
      setApiNotifications(mapped);
    } catch {
      // Silently fail — bell will just show 0 items
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  // Fetch on mount and set up polling every 15 seconds
  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 15000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  // Merge: API notifications first, then any local stock-alert notifications
  const notifications = useMemo<Notification[]>(
    () => [...apiNotifications, ...localNotifications],
    [apiNotifications, localNotifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Add a local-only notification (used by low-stock / negative-stock hooks)
  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "read" | "time">) => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLocalNotifications((prev) => {
        const newId = `local-${Date.now()}-${Math.random()}`;
        return [{ ...n, id: newId, read: false, time: `Today at ${time}` }, ...prev];
      });
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    // If it's an API notification, also call the backend
    const apiNotif = apiNotifications.find((n) => n.id === id);
    if (apiNotif) {
      notificationService.markRead(id).catch(() => {/* ignore */});
      setApiNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  }, [apiNotifications]);

  const markAllAsRead = useCallback(() => {
    // Mark all unread API notifications as read on the backend
    apiNotifications
      .filter((n) => !n.read)
      .forEach((n) => notificationService.markRead(n.id).catch(() => {/* ignore */}));
    setApiNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [apiNotifications]);

  const updateNotification = useCallback((id: string, patch: Partial<Notification>) => {
    setApiNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n))
    );
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n))
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        updateNotification,
        refreshNotifications,
        loading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationsProvider>");
  return ctx;
}