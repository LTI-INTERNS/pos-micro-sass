"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationPanel, { type Notification } from "./NotificationPanel";
import NotificationMessagePopup from "./NotificationMessagePopup";

import ProductNotificationPopup, {
  type ProductNotifyValues,
} from "../productmanagement/ProductNotificationPopup";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  // message popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  // product popup state
  const [productPopupOpen, setProductPopupOpen] = useState(false);
  const [productData, setProductData] = useState<ProductNotifyValues | null>(null);

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
      message: "Request Coca Cola 1L",
      type: "info",
      time: "10 mins ago",
      read: false,
      product: {
        name: "Coca Cola 1L",
        price: "450",
        discount: "0",
        tax: "8",
        stock: "3",
        branchName: "Main Branch",
        branchManager: "John Doe",
      },
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
  const prevUnread = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openMessagePopup = (n: Notification) => {
    markAsRead(n.id);
    setOpen(false);

    if (n.product) {
      setProductData({
        ...n.product,
        branchName: n.product.branchName || "",
        branchManager: n.product.branchManager || "",
      });
      setProductPopupOpen(true);
      return;
    }

    setSelected(n);
    setPopupOpen(true);
  };

  return (
    <div className="relative">
      {unreadCount > 0 && (
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        title="Notifications"
        className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all active:scale-90"
      >
        <Bell
          className="text-gray-800 cursor-pointer"
          size={18}
          style={{
            animation: pulse ? "bellShake 0.5s ease-in-out" : "none",
          }}
        />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      </button>
      )}

      <style>{`
        @keyframes bellShake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(12deg); }
          60% { transform: rotate(-8deg); }
          80% { transform: rotate(8deg); }
        }
        @keyframes pingOnce {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onOpenMessage={openMessagePopup}
        />
      )}

      <NotificationMessagePopup
        open={popupOpen}
        data={selected}
        onClose={() => setPopupOpen(false)}
      />

      <ProductNotificationPopup
        open={productPopupOpen}
        onClose={() => setProductPopupOpen(false)}
        initialValues={productData}
        onSave={(values) => {
          console.log("Product from notification:", values);
          setProductPopupOpen(false);
        }}
      />
    </div>
  );
}