"use client";

import * as React from "react";

type ModalShellProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
};

export default function ModalShell({
  open,
  title,
  onClose,
  children,
  widthClassName = "w-[900px] max-w-[92vw]",
}: ModalShellProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        aria-label="Close modal"
      />

      {/* Card */}
      <div className={`relative rounded-2xl bg-white shadow-2xl overflow-hidden ${widthClassName}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-10 py-7">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-10 py-7 text-left">{children}</div>
      </div>
    </div>
  );
}
