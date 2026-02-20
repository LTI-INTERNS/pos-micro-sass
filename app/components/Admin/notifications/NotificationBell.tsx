"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "./NotificationsContext";
import type { Notification, ProductApprovalData } from "./NotificationsContext";
import NotificationPanel from "./NotificationPanel";
import NotificationMessagePopup from "@/app/components/Admin/notifications/NotificationMessagePopup";
import ProductApprovalModal from "./ProductApprovalModal";

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

  // Bell shake on new unread notification
  const prevUnread = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnread.current) {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount]);

  // ── Open correct popup per notification type ─────────────────────────────

  const handleOpenMessage = (n: Notification) => {
    markAsRead(n.id);
    setOpen(false);

    if (n.type === "approval_pending" && n.productApproval) {
      setApprovalData(n.productApproval);
      setApprovalNotifId(n.id);
      setApprovalOpen(true);
      return;
    }

    setSelected(n);
    setPopupOpen(true);
  };

  // ── Approval actions ─────────────────────────────────────────────────────

  const handleApprove = (productId: number) => {
    if (approvalNotifId !== null) {
      const notif = notifications.find((n) => n.id === approvalNotifId);
      updateNotification(approvalNotifId, {
        read: true,
        type: "success",
        message: `"${notif?.productApproval?.productName}" approved ✓`,
        productApproval: notif?.productApproval
          ? { ...notif.productApproval, status: "approved" }
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
          ? { ...notif.productApproval, status: "rejected", rejectionReason: reason }
          : undefined,
      });
    }
    setApprovalOpen(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────

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

      {/* Bell — only visible when there are unread notifications */}
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
            style={{ animation: pulse ? "bellShake 0.5s ease-in-out" : "none" }}
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </button>
      )}

      {/* Notification panel */}
      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onOpenMessage={handleOpenMessage}
        />
      )}

      {/* Generic message popup */}
      <NotificationMessagePopup
        open={popupOpen}
        data={selected}
        onClose={() => setPopupOpen(false)}
      />

      {/* Product approval modal */}
      <ProductApprovalModal
        open={approvalOpen}
        data={approvalData}
        onClose={() => setApprovalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
