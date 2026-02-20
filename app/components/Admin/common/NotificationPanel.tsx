"use client";

import React from "react";
import { CheckCheck, X } from "lucide-react";

type NotificationType = "info" | "warning" | "error" | "success";

export type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;

    product?: {
    name: string;
    price: string;
    discount: string;
    tax: string;
    stock: string;
    branchName?: string;
    branchManager?:string;
  };
};

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
    dot: "bg-orange-400",
    bar: "bg-orange-400",
    label: "WARNING",
    bg: "hover:bg-orange-50",
    text: "text-orange-500",
  },
  error: {
    dot: "bg-red-400",
    bar: "bg-red-500",
    label: "ERROR",
    bg: "hover:bg-red-50",
    text: "text-red-500",
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

      <div className="fixed right-6 top-20 z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col max-h-[480px] overflow-hidden">

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-sm">Notifications</p>
            {unread > 0 && (
              <span className="bg-orange-100 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unread} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onMarkAllAsRead && unread > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
              >
                <CheckCheck size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
          {notifications.length === 0 && (
            <div className="py-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <CheckCheck size={18} className="text-orange-300" />
              </div>
              <p className="text-xs text-gray-400 font-medium">All caught up!</p>
            </div>
          )}

          {notifications.map((n, idx) => {
            const cfg = typeConfig[n.type];

            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  onMarkAsRead?.(n.id);
                  onOpenMessage?.(n);
                }}
                className={`w-full text-left relative transition-all px-4 py-3 ${cfg.bg} ${
                  idx < notifications.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div
                  className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${cfg.bar}`}
                  style={{ opacity: n.read ? 0.25 : 1 }}
                />

                <div className="flex items-start gap-3 pl-2">
                  <div className="mt-[5px] flex-shrink-0">
                    {!n.read ? (
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-bold tracking-widest uppercase ${cfg.text} ${n.read ? "opacity-50" : ""}`}>
                        {cfg.label}
                      </span>
                      {n.product && (
                        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-500">
                          PRODUCT
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-snug ${n.read ? "text-gray-400 font-normal" : "text-gray-800 font-medium"}`}>
                      {n.message}
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
      </div>
    </>
  );
}
