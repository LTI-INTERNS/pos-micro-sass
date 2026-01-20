"use client";

import { useEffect, useMemo, useState } from "react";

export type DiscountOption = {
  id: string;
  label: string;
  percent: number;
};

type Props = {
  open: boolean;
  options: DiscountOption[];
  value?: string | null;
  onClose: () => void;
  onApply: (selectedId: string | null) => void;
  title?: string;
};

export default function DiscountPopup({
  open,
  options,
  value = null,
  onClose,
  onApply,
  title = "Select discount",
}: Props) {
  const [selected, setSelected] = useState<string | null>(value);

  useEffect(() => {
    if (open) setSelected(value ?? null);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const groups = useMemo(() => options, [options]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4" role="dialog">
      <button
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative w-full max-w-[760px] rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((opt) => (
              <DiscountRow
                key={opt.id}
                option={opt}
                selected={selected === opt.id}
                onSelect={() => setSelected(opt.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="w-[200px] rounded-full border border-orange-400
                         text-orange-600 font-semibold py-3 hover:bg-orange-50"
            >
              Cancel
            </button>

            <button
              onClick={() => onApply(selected)}
              className="w-[200px] rounded-full bg-orange-500
                         text-white font-semibold py-3 hover:bg-orange-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscountRow({
  option,
  selected,
  onSelect,
}: {
  option: DiscountOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full overflow-hidden rounded-xl border text-left transition",
        selected
          ? "border-orange-400 bg-orange-50/30"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <div className="flex items-stretch">
        {/* Left side */}
        <div className="flex-1 px-4 py-4 flex items-center gap-3">
          {/* RADIO */}
          <span
            className={[
              "h-5 w-5 rounded-full grid place-items-center shrink-0",
              selected
                ? "bg-orange-500"
                : "border border-slate-300 bg-white",
            ].join(" ")}
          >
            {selected && (
              <svg
                className="h-3 w-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>

          <span className="text-sm font-semibold text-slate-900 leading-snug">
            {option.label}
          </span>
        </div>

        {/* Right percent ticket */}
        <div className="relative w-[78px] bg-orange-500 text-white font-bold grid place-items-center">
          <span className="text-sm">{option.percent}%</span>

          {/* scalloped edge */}
          <div className="absolute left-0 top-0 h-full w-3">
            <div
              className="h-full w-full bg-white"
              style={{
                maskImage:
                  "radial-gradient(circle 7px at 0 10px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 30px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 50px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 70px, transparent 98%, #000 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle 7px at 0 10px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 30px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 50px, transparent 98%, #000 100%), radial-gradient(circle 7px at 0 70px, transparent 98%, #000 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}