"use client";

import * as React from "react";
import PopupActions from "@/app/components/Dashboard/PopupActions";

type FilterPopupProps = {
  open: boolean;
  onClose: () => void;
  onApply: (values: { date: string; type: string }) => void;
};

export default function FilterPopup({
  open,
  onClose,
  onApply,
}: FilterPopupProps) {
  const [date, setDate] = React.useState("");
  const [type, setType] = React.useState("");

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Popup wrapper */}
      <div className="relative">
        {/* Arrow (top-right) */}
        <div
          className="
            absolute -top-3 right-10
            h-0 w-0
            border-l-[12px] border-r-[12px] border-b-[12px]
            border-l-transparent border-r-transparent border-b-white
          "
        />

        {/* Popup card */}
        <div className="relative w-[360px] rounded-3xl bg-white p-6 shadow-xl">
          <div className="space-y-4">
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Date"
              className="
                w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none
                placeholder:text-orange-500
                focus:border-orange-500 focus:ring-2 focus:ring-orange-200
              "
            />

            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type"
              className="
                w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none
                placeholder:text-gray-400
                focus:border-orange-500 focus:ring-2 focus:ring-orange-200
              "
            />
          </div>

          <PopupActions
            actions={[
              {
                label: "Cancel",
                onClick: onClose,
                variant: "secondary",
              },
              {
                label: "Apply",
                onClick: () => onApply({ date, type }),
                variant: "primary",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
