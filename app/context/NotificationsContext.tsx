"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export type NotificationType = "info" | "warning" | "error" | "success" | "approval_pending";

export type ProductApprovalData = {
  id: number;
  productName: string;
  category?: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
  unit?: string;
  description?: string;
  imageUrl?: string;
  branchName: string;
  branchManager: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
};

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  productApproval?: ProductApprovalData;
};

type NotificationsContextValue = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "time">) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  updateNotification: (id: number, patch: Partial<Notification>) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New product approval request: 'Wireless Mouse'",
      type: "approval_pending",
      time: "Today at 10:45 AM",
      read: false,
      productApproval: {
        id: 101,
        productName: "Wireless Mouse",
        category: "Electronics",
        price: "25.00",
        discount: "0",
        tax: "5",
        stock: "100",
        unit: "pcs",
        description: "A sleek wireless mouse with ergonomic design.",
        imageUrl: "/images/products/wireless-mouse.jpg",
        branchName: "Colombo Branch",
        branchManager: "Nimal Perera",
        submittedAt: "2024-06-15T10:30:00Z",
        status: "pending",
      },
    },
  ]);

  const [nextId, setNextId] = useState(100);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "read" | "time">) => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setNextId((prev) => prev + 1);
      setNotifications((prev) => [
        {
          ...n,
          id: nextId,
          read: false,
          time: `Today at ${time}`,
        },
        ...prev,
      ]);
    },
    [nextId]
  );

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updateNotification = useCallback((id: number, patch: Partial<Notification>) => {
    setNotifications((prev) =>
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
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside <NotificationsProvider>");
  }
  return ctx;
}
