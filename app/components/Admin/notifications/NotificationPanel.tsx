"use client";

import React from "react";
import { CheckCheck, X } from "lucide-react";
import type { Notification, NotificationType } from "./NotificationsContext";

export type { Notification, NotificationType };

type Props = {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead?: (id: number) => void;
  onMarkAllAsRead?: () => void;
  onOpenMessage?: (n: Notification) => void;
};

const typeConfig: Record<
  NotificationType,
  { dot: string; bar: string; label: string; bg: string; text: string }
> = {
  info: {
    dot: "bg-blue-400",
    bar: "bg-blue-400",
    label: "INFO",
    bg: "hover:bg-blue-50",
    text: "text-blue-500",
  },
  success: {
    dot: "bg-green-400",
    bar: "bg-green-500",
    label: "SUCCESS",
    bg: "hover:bg-green-50",
    text: "text-green-600",
  },
  warning: {
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    label: "WARNING",
    bg: "hover:bg-amber-50",
    text: "text-amber-500",
  },
  error: {
    dot: "bg-red-400",
    bar: "bg-red-500",
    label: "ERROR",
    bg: "hover:bg-red-50",
    text: "text-red-500",
  },
  approval_pending: {
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    label: "APPROVAL",
    bg: "hover:bg-orange-50",
    text: "text-orange-500",
  },
};

export default function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenMessage,
}: Props) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-[2px] bg-black/10 transition-all"
        onClick={onClose}
      />

      <div className="fixed right-6 top-[68px] z-50 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 90px)" }}
      >

        <div className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1.5px solid #f97316" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm shadow-orange-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="font-bold text-gray-800 text-sm">Notifications</p>
            {unread > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-orange-300">
                {unread}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onMarkAllAsRead && unread > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
              >
                <CheckCheck size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>

          {notifications.length === 0 && (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                <CheckCheck size={20} className="text-orange-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500">All caught up!</p>
                <p className="text-[10px] text-gray-400 mt-0.5">No new notifications</p>
              </div>
            </div>
          )}

          {notifications.map((n, idx) => {
            const cfg = typeConfig[n.type];
            const isPending = n.type === "approval_pending" && n.productApproval?.status === "pending";

            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  onMarkAsRead?.(n.id);
                  onOpenMessage?.(n);
                }}
                className={`w-full text-left relative transition-all px-5 py-3.5 cursor-pointer ${cfg.bg} ${
                  !n.read ? "bg-orange-50/30" : ""
                } ${idx < notifications.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div
                  className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${cfg.bar}`}
                  style={{ opacity: n.read ? 0.2 : 1 }}
                />

                <div className="flex items-start gap-3 pl-1">

                  <div className="mt-[5px] flex-shrink-0">
                    {!n.read ? (
                      <div className={`w-2 h-2 rounded-full ${cfg.dot} shadow-sm`} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className={`text-[9px] font-extrabold tracking-widest uppercase ${cfg.text} ${n.read ? "opacity-40" : ""}`}>
                        {cfg.label}
                      </span>

                      {n.productApproval?.branchName && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                          {n.productApproval.branchName}
                        </span>
                      )}

                      {isPending && (
                        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-500 animate-pulse">
                          PENDING
                        </span>
                      )}
                      {n.productApproval?.status === "approved" && (
                        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-green-100 text-green-600">
                          APPROVED
                        </span>
                      )}
                      {n.productApproval?.status === "rejected" && (
                        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md bg-red-100 text-red-500">
                          REJECTED
                        </span>
                      )}


                    </div>

                    <p className={`text-xs leading-snug ${n.read ? "text-gray-400 font-normal" : "text-gray-800 font-medium"}`}>
                      {n.message}
                    </p>

                    {n.productApproval?.productName && (
                      <p className="text-[10px] text-orange-500 font-semibold mt-0.5">
                        📦 {n.productApproval.productName}
                      </p>
                    )}

                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-center">
          <p className="text-[10px] text-gray-400 font-medium">
            {unread > 0
              ? `${unread} unread notification${unread > 1 ? "s" : ""}`
              : "No unread notifications"}
          </p>
        </div>
      </div>
    </>
  );
}