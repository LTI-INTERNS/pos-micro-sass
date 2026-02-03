"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import NotificationPanel, { type Notification } from "./NotificationPanel";
import NotificationMessagePopup from "./NotificationMessagePopup";

import ProductNotificationPopup, {
  type ProductNotifyValues,
} from "../productmanagement/ProductNotificationPopup";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // open correct popup depending on notification payload
  const openMessagePopup = (n: Notification) => {
    markAsRead(n.id);

    // Close panel (clean UX)
    setOpen(false);

    // If product payload exists → open product popup
    if (n.product) {
      setProductData({
        ...n.product,
        branchName: n.product.branchName || "",
        branchManager: n.product.branchManager || "",
      });
      setProductPopupOpen(true);
      return;
    }

    // otherwise open normal message popup
    setSelected(n);
    setPopupOpen(true);
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
          onOpenMessage={openMessagePopup}
        />
      )}

      {/* normal notification popup */}
      <NotificationMessagePopup
        open={popupOpen}
        data={selected}
        onClose={() => setPopupOpen(false)}
      />

      {/*  product notification popup */}
      <ProductNotificationPopup
        open={productPopupOpen}
        onClose={() => setProductPopupOpen(false)}
        initialValues={productData}
        onSave={(values) => {
          console.log("check product from notification:", values);
          setProductPopupOpen(false);
        }}
      />
    </div>
  );
}
