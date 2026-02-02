"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import NotificationPanel, { type Notification } from "./NotificationPanel";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  // ✅ mock notifications for now (replace with API later)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New order #1024 placed",
      type: "info",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "Product A stock is low",
      type: "warning",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 3,
      message: "Payment failed for order #998",
      type: "error",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      message: "Backup completed successfully",
      type: "success",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
        title="Notifications"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
}
