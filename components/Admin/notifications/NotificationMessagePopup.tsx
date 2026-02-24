"use client";

import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import type { NotificationType } from "@/lib/context/NotificationsContext";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    message: string;
    type: NotificationType;
    time?: string;
  } | null;
};

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; label: string; badgeBg: string; badgeText: string; iconBg: string; iconColor: string }
> = {
  info: {
    icon: <Info size={16} />,
    label: "INFO",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  success: {
    icon: <CheckCircle2 size={16} />,
    label: "SUCCESS",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    label: "WARNING",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  error: {
    icon: <XCircle size={16} />,
    label: "ERROR",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  approval_pending: {
    icon: <Info size={16} />,
    label: "APPROVAL",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  negative_stock: {
    icon: <AlertTriangle size={16} />,
    label: "LOW STOCK",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
};

export default function NotificationMessagePopup({ open, onClose, data }: Props) {
  if (!data) return null;

  const cfg = typeConfig[data.type];

  return (
    <ModalShell
      open={open}
      title="Notification"
      onClose={onClose}
      widthClassName="w-[480px] max-w-[92vw]"
    >
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg.badgeBg}`}>
            <span className={cfg.iconColor}>{cfg.icon}</span>
            <span className={`text-xs font-bold tracking-widest ${cfg.badgeText}`}>
              {cfg.label}
            </span>
          </div>

          {data.time && (
            <span className="text-xs text-gray-400">{data.time}</span>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-700 leading-relaxed">{data.message}</p>
        </div>
        <PopupActions
          actions={[{ label: "Dismiss", onClick: onClose, variant: "primary" }]}
        />
      </div>
    </ModalShell>
  );
}