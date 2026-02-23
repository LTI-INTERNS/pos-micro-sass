"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../../context/NotificationsContext";
import type { Notification, ProductApprovalData } from "../../../context/NotificationsContext";
import NotificationPanel from "./NotificationPanel";
import NotificationMessagePopup from "@/app/components/Admin/notifications/NotificationMessagePopup";
import ProductApprovalModal from "./ProductApprovalModal";
import NegativeStockAlertModal from "./NegativeStockAlertModal";
import type { NegativeStockAlertData } from "./useNegativeStockAlerts";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updateNotification,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Generic message popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  // Product approval modal
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<ProductApprovalData | null>(null);
  const [approvalNotifId, setApprovalNotifId] = useState<number | null>(null);

  // Negative stock alert modal
  const [stockAlertOpen, setStockAlertOpen] = useState(false);
  const [stockAlertData, setStockAlertData] = useState<NegativeStockAlertData | null>(null);

  const prevUnread = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  const handleOpenMessage = (n: Notification) => {
    markAsRead(n.id);
    setOpen(false);

    if (n.type === "negative_stock" && n.negativeStockAlert) {
      setStockAlertData(n.negativeStockAlert);
      setStockAlertOpen(true);
      return;
    }

    if (n.type === "approval_pending" && n.productApproval) {
      setApprovalData(n.productApproval);
      setApprovalNotifId(n.id);
      setApprovalOpen(true);
      return;
    }

    setSelected(n);
    setPopupOpen(true);
  };

  const handleApprove = (productId: number) => {
    if (approvalNotifId !== null) {
      const notif = notifications.find((n) => n.id === approvalNotifId);
      updateNotification(approvalNotifId, {
        read: true,
        type: "success",
        message: `"${notif?.productApproval?.productName}" approved ✓`,
        productApproval: notif?.productApproval
          ? {
              ...notif.productApproval,
              status: "approved",
              approvedBy: "current.admin@company.com", // TODO: replace with real auth user
              reviewedAt: new Date().toISOString(),
            }
          : undefined,
      });
    }
    setApprovalOpen(false);
  };

  const handleReject = (productId: number, reason: string) => {
    if (approvalNotifId !== null) {
      const notif = notifications.find((n) => n.id === approvalNotifId);
      updateNotification(approvalNotifId, {
        read: true,
        type: "error",
        message: `"${notif?.productApproval?.productName}" rejected`,
        productApproval: notif?.productApproval
          ? {
              ...notif.productApproval,
              status: "rejected",
              rejectedBy: "current.admin@company.com", // TODO: replace with real auth user
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : undefined,
      });
    }
    setApprovalOpen(false);
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes bellShake {
          0%, 100% { transform: rotate(0deg); }
          20%       { transform: rotate(-12deg); }
          40%       { transform: rotate(12deg); }
          60%       { transform: rotate(-8deg); }
          80%       { transform: rotate(8deg); }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        title="Notifications"
        className="relative bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all active:scale-90"
      >
        <Bell
          className="text-gray-800 cursor-pointer"
          size={18}
          style={{ animation: pulse ? "bellShake 0.5s ease-in-out" : "none" }}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onOpenMessage={handleOpenMessage}
        />
      )}

      <NotificationMessagePopup
        open={popupOpen}
        data={selected}
        onClose={() => setPopupOpen(false)}
      />

      <ProductApprovalModal
        open={approvalOpen}
        data={approvalData}
        onClose={() => setApprovalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <NegativeStockAlertModal
        open={stockAlertOpen}
        data={stockAlertData}
        onClose={() => setStockAlertOpen(false)}
      />
    </div>
  );
}