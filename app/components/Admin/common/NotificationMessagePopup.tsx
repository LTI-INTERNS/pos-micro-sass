"use client";

import * as React from "react";
import ModalShell from "../common/ModalShell";
import PopupActions from "../common/PopupActions";

type NotificationType = "info" | "warning" | "error" | "success";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    message: string;
    type: NotificationType;
    time?: string;
  } | null;
};

const typeBadge: Record<NotificationType, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
};

export default function NotificationMessagePopup({ open, onClose, data }: Props) {
  if (!open || !data) return null;

  return (
    <ModalShell
      open={open}
      title="Notification"
      onClose={onClose}
      widthClassName="w-[520px] max-w-[92vw]"
    >
      <div className="space-y-5">
        {/* Type badge + time */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadge[data.type]}`}
          >
            {data.type.toUpperCase()}
          </span>

          {data.time && (
            <span className="text-xs text-gray-400">{data.time}</span>
          )}
        </div>

        {/* Message */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed">{data.message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Close", onClick: onClose, variant: "primary" },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
