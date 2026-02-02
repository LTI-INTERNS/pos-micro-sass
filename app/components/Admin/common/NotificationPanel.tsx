"use client";

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

  // optional features
  onMarkAsRead?: (id: number) => void;
  onMarkAllAsRead?: () => void;

  onOpenMessage?: (n: Notification) => void;
};

const typeStyles: Record<NotificationType, string> = {
  info: "border-blue-500 bg-blue-50 text-blue-700",
  success: "border-green-500 bg-green-50 text-green-700",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
  error: "border-red-500 bg-red-50 text-red-700",
};

export default function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenMessage,
}: Props) {
  return (
    <>
      {/* Backdrop (click outside to close) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-6 top-20 z-50 w-80 bg-white rounded-xl shadow-lg border">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <p className="font-semibold">Notifications</p>

          {onMarkAllAsRead && notifications.some((n) => !n.read) && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs text-orange-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="p-4 text-sm text-gray-500 text-center">
              No notifications
            </p>
          )}

          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                onMarkAsRead?.(n.id);
               onOpenMessage?.(n);
              }}
              className={`w-full text-left px-4 py-3 border-b border-l-4 text-sm ${
                typeStyles[n.type]
              } ${!n.read ? "font-semibold" : "opacity-80"} hover:opacity-100`}
            >
              <p>{n.message}</p>
              <p className="text-[11px] mt-1 opacity-70">{n.time}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
