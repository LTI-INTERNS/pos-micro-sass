"use client";

import { useMemo, useState } from "react";
import LogoUploadSection from "./LogoUploadSection"; // will use only if includeLogo=true

type Details = {
  name: string;
  regNo?: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
};

type DetailsFormProps = {
  initial?: Partial<Details>;
  readOnly?: boolean;
  onEditClick?: () => void;
  onSave?: (data: Details) => Promise<void> | void;
  className?: string;
  includeLogo?: boolean; // only show logo upload if true
  logoUrl?: string | null;
  onLogoChange?: (url: string | null, file?: File | null) => void;
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

export default function DetailsForm({
  initial,
  readOnly = false,
  onEditClick,
  onSave,
  className = "",
  includeLogo = false,
  logoUrl = null,
  onLogoChange,
}: DetailsFormProps) {
  const [editing, setEditing] = useState(!readOnly);
  const isLocked = readOnly ? true : !editing;
  const [saving, setSaving] = useState(false);

  const defaults: Details = useMemo(
    () => ({
      name: initial?.name ?? "",
      regNo: initial?.regNo ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      addressLine1: initial?.addressLine1 ?? "",
      addressLine2: initial?.addressLine2 ?? "",
    }),
    [initial]
  );

  const [form, setForm] = useState<Details>(defaults);

  const set = (key: keyof Details, value: any) =>
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

  const FieldRow = ({ label, input }: { label: string; input: React.ReactNode }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-x-10 items-center">
      <div className="lg:col-span-3">
        <FieldLabel>{label}</FieldLabel>
      </div>
      <div className="lg:col-span-9">{input}</div>
    </div>
  );

  return (
    <section
      className={["w-full rounded-md border bg-white shadow-sm", "p-5 sm:p-8", className].join(" ")}
    >
      <div className="space-y-4">
        <FieldRow
          label={includeLogo ? "Company Name" : "Branch Name"}
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          }
        />

        {includeLogo && (
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
        )}

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

      {/* Logo Section Only For Company */}
      {includeLogo && onLogoChange && (
        <div className="pt-10">
          <LogoUploadSection
            disabled={isLocked || saving}
            currentLogoUrl={logoUrl}
            onLogoChange={(url, file) => onLogoChange(url, file)}
          />
        </div>
      )}

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
              readOnly || saving ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
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
              !onSave || isLocked || saving ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}