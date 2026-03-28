"use client";

import * as React from "react";

// ─── Basic form elements ──────────────────────────────────────────────────────

export function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] text-gray-500 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-4xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-4xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-y min-h-[80px] transition ${props.className ?? ""}`}
    />
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

export function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>;
}

// ─── Section title & tooltip ──────────────────────────────────────────────────

export function SectionTitle({ title, tooltip }: { title: string; tooltip?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-1">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
      {tooltip}
    </div>
  );
}

export function Tooltip({ text, position = "top" }: { text: string; position?: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <span className="relative group inline-flex items-center ml-1 cursor-default">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">i</span>
      <span
        className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isTop ? "bottom-full mb-2" : "top-full mt-2"}`}
      >
        {text}
        <span className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${isTop ? "top-full border-t-gray-800" : "bottom-full border-b-gray-800"}`} />
      </span>
    </span>
  );
}

// ─── Read-only / display fields ───────────────────────────────────────────────

export function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-[12px] text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 px-3 py-2 bg-gray-50 border border-gray-200 rounded-4xl min-h-[38px]">{value || "—"}</p>
    </div>
  );
}

// ─── Info banners ─────────────────────────────────────────────────────────────

export function ManagerInfoBanner({ step }: { step: "options" | "variants" }) {
  return (
    <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
      <p className="text-[12px] text-orange-700 leading-relaxed">
        The {step === "options" ? "options" : "variants"} below are commonly used across your company.{" "}
        <strong>Click to select the {step === "options" ? "options" : "variants"} you'd like to add to your branch</strong> — anything left unselected will be excluded from your request.
      </p>
    </div>
  );
}

export function ManagerEditInfoBanner({ step }: { step: "options" | "variants" }) {
  return (
    <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-300">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
      <p className="text-[12px] text-orange-700 leading-relaxed">
        {step === "options"
          ? "These are company-level options not yet added to your branch. Select the ones you want, or add a brand-new option — new additions will be submitted for approval."
          : "These are company-level variants not yet added to your branch. Select the ones you want, or add a brand-new variant — new additions will be submitted for approval."}
      </p>
    </div>
  );
}

export function MultiSelectInfoBanner({ step, count }: { step: "options" | "variants"; count: number }) {
  return (
    <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-300">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
      <p className="text-[12px] text-orange-700 leading-relaxed">
        You have selected <strong>{count} products</strong>.{" "}
        {step === "options"
          ? "All options from each selected product will be automatically added to your branch — no individual selection needed."
          : "All variants from each selected product will be automatically added to your branch — no individual selection needed."}
      </p>
    </div>
  );
}

// ─── Small icons / badges ─────────────────────────────────────────────────────

export function CheckIcon() {
  return (
    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NewBadge() {
  return (
    <span className="ml-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-orange-500 text-white tracking-wide">
      New
    </span>
  );
}

// ─── Step bar ─────────────────────────────────────────────────────────────────

import { STEPS } from "./types";

export function StepBar({ current, onGo }: { current: number; onGo: (n: number) => void }) {
  return (
    <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onGo(i)}
            className={`flex-1 py-2.5 text-[11px] border-r border-gray-200 last:border-r-0 transition cursor-pointer
              ${active ? "bg-orange-50 text-orange-500 font-bold" : done ? "bg-gray-50 text-orange-500 font-medium" : "bg-gray-50 text-gray-400 hover:text-gray-600 font-medium"}`}
          >
            <span className={`inline-block mr-1 text-[10px] ${done ? "text-orange-400" : ""}`}>{done ? "✓" : i + 1}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Indeterminate checkbox ───────────────────────────────────────────────────

export function SelectAllCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
    />
  );
}