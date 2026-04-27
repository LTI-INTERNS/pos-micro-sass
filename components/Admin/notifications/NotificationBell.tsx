"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/lib/context/NotificationsContext";
import type { Notification, ProductApprovalData } from "@/lib/context/NotificationsContext";
import NotificationPanel from "@/components/Admin/notifications/NotificationPanel";
import NotificationMessagePopup from "@/components/Admin/notifications/NotificationMessagePopup";
import ProductApprovalModal from "@/components/Admin/notifications/ProductApprovalModal";
import NegativeStockAlertModal from "@/components/Admin/notifications/NegativeStockAlertModal";
import type { NegativeStockAlertData } from "@/components/Admin/notifications/useNegativeStockAlerts";
import { notificationService } from "@/lib/services/notification-service";

export default function NotificationBell() {
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updateNotification,
    refreshNotifications,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  // Generic message popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  // Product approval modal
  const [approvalOpen,    setApprovalOpen]    = useState(false);
  const [approvalData,    setApprovalData]    = useState<ProductApprovalData | null>(null);
  const [approvalNotifId, setApprovalNotifId] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);

  // Negative stock alert modal
  const [stockAlertOpen, setStockAlertOpen] = useState(false);
  const [stockAlertData, setStockAlertData] = useState<NegativeStockAlertData | null>(null);

  // Bell pulse on new notifications
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

    if (
      (n.type === "approval_pending" || n.type === "success" || n.type === "error") &&
      n.productApproval
    ) {
      setApprovalData(n.productApproval);
      setApprovalNotifId(n.id);
      setApprovalOpen(true);
      return;
    }

    setSelected(n);
    setPopupOpen(true);
  };

  /** Admin/Owner approves the pending product request */
  const handleApprove = async () => {
    if (!approvalNotifId) return;
    setApprovalLoading(true);
    try {
      await notificationService.approve(approvalNotifId);
      // Refresh the full list from the backend so state is real
      await refreshNotifications();
      // Update local view optimistically so the modal shows "Approved"
      const notif = notifications.find((n) => n.id === approvalNotifId);
      updateNotification(approvalNotifId, {
        type: "success",
        read: true,
        message: `"${notif?.productApproval?.productName}" approved ✓`,
        productApproval: notif?.productApproval
          ? {
              ...notif.productApproval,
              status:     "approved",
              approvedBy: session?.user?.email ?? session?.user?.name ?? "Admin",
              reviewedAt: new Date().toISOString(),
            }
          : undefined,
      });
      // Notify other components (like product table) to refresh
      window.dispatchEvent(new CustomEvent("product-data-refresh"));
    } catch {
      alert("Failed to approve product. Please try again.");
    } finally {
      setApprovalLoading(false);
      setApprovalOpen(false);
    }
  };

  /** Admin/Owner rejects the pending product request with a reason */
  const handleReject = async (_productId: string, reason: string) => {
    if (!approvalNotifId) return;
    setApprovalLoading(true);
    try {
      await notificationService.reject(approvalNotifId, reason);
      await refreshNotifications();
      const notif = notifications.find((n) => n.id === approvalNotifId);
      updateNotification(approvalNotifId, {
        type: "error",
        read: true,
        message: `"${notif?.productApproval?.productName}" rejected`,
        productApproval: notif?.productApproval
          ? {
              ...notif.productApproval,
              status:          "rejected",
              rejectedBy:      session?.user?.email ?? session?.user?.name ?? "Admin",
              reviewedAt:      new Date().toISOString(),
              rejectionReason: reason,
            }
          : undefined,
      });
    } catch {
      alert("Failed to reject product. Please try again.");
    } finally {
      setApprovalLoading(false);
      setApprovalOpen(false);
    }
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
        userRole={session?.user?.role?.toLowerCase() as "admin" | "owner" | "manager" | undefined}
        onClose={() => setApprovalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={approvalLoading}
      />

      <NegativeStockAlertModal
        open={stockAlertOpen}
        data={stockAlertData}
        onClose={() => setStockAlertOpen(false)}
      />
    </div>
  );
}