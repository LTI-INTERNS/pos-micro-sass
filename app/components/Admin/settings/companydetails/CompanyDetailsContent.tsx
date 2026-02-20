"use client";

import { useMemo, useRef, useState } from "react";
import LogoUploadSection from "./LogoUploadSection";

type CompanyDetails = {
  companyName: string;
  regNo: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  logoFile?: File | null;
  logoUrl?: string | null;
};

type Props = {
  initial?: Partial<CompanyDetails>;
  readOnly?: boolean;
  onEditClick?: () => void;
  onSave?: (data: CompanyDetails) => Promise<void> | void;
  className?: string;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-black/80 font-medium leading-6 lg:leading-10">
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-full bg-white px-5 text-sm",
        "border border-black/10 outline-none",
        "focus:border-black/30 focus:ring-2 focus:ring-black/10 text-black/80",
        props.disabled ? "opacity-60 cursor-not-allowed" : "",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export default function CompanyDetailsForm({
  initial,
  readOnly = false,
  onEditClick,
  onSave,
  className = "",
}: Props) {
  const [editing, setEditing] = useState(!readOnly);
  const isLocked = readOnly ? true : !editing;

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const defaults: CompanyDetails = useMemo(
    () => ({
      companyName: initial?.companyName ?? "",
      regNo: initial?.regNo ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      addressLine1: initial?.addressLine1 ?? "",
      addressLine2: initial?.addressLine2 ?? "",
      logoFile: initial?.logoFile ?? null,
      logoUrl: initial?.logoUrl ?? null,
    }),
    [initial]
  );

  const [form, setForm] = useState<CompanyDetails>(defaults);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof CompanyDetails, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleEdit = () => {
    if (onEditClick) onEditClick();
    if (!readOnly) setEditing(true);
  };

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setSaving(true);
      await onSave(form);
      if (!readOnly) setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  
  const FieldRow = ({
    label,
    input,
  }: {
    label: string;
    input: React.ReactNode;
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-x-10 items-center">
      <div className="lg:col-span-3">
        <FieldLabel>{label}</FieldLabel>
      </div>
      <div className="lg:col-span-9">{input}</div>
    </div>
  );

  return (
    <section
      className={[
        "w-full rounded-md border border-black/20 bg-white shadow-sm",
        "p-5 sm:p-8",
        className,
      ].join(" ")}
    >
      
      <div className="space-y-4">
        <FieldRow
          label="Company Name"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
          }
        />

        <FieldRow
          label="Registration No"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.regNo}
              onChange={(e) => set("regNo", e.target.value)}
            />
          }
        />

        <FieldRow
          label="Email"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              type="email"
            />
          }
        />

        <FieldRow
          label="Phone"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          }
        />

        <FieldRow
          label="Address Line 1"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.addressLine1}
              onChange={(e) => set("addressLine1", e.target.value)}
            />
          }
        />

        <FieldRow
          label="Address Line 2"
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.addressLine2}
              onChange={(e) => set("addressLine2", e.target.value)}
            />
          }
        />
      </div>

      
      <div className="pt-10">
        <LogoUploadSection
          disabled={isLocked || saving}
          currentLogoUrl={form.logoUrl ?? null}
          onLogoChange={(url, file) => {
            set("logoUrl", url);
            set("logoFile", file ?? null);
          }}
        />
      </div>

          
      <div className="pt-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 sm:gap-8">
          <button
            type="button"
            onClick={handleEdit}
            disabled={readOnly || saving}
            className={[
              "h-12 w-full lg:w-[320px] rounded-full border border-orange-400 bg-white",
              "text-orange-500 hover:bg-orange-50",
              "flex items-center justify-center",
              readOnly || saving
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer",
            ].join(" ")}
          >
            Edit Details
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!onSave || isLocked || saving}
            className={[
              "h-12 w-full lg:w-[320px] rounded-full bg-orange-500 text-white hover:bg-orange-600",
              "flex items-center justify-center",
              !onSave || isLocked || saving
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}