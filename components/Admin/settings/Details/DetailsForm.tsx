"use client";

import { useMemo, useState } from "react";
import LogoUploadSection from "@/components/Admin/settings/Details/LogoUploadSection";
import ActionButton from "@/components/Admin/common/ActionButton";

type Details = {
  name: string;
  regNo?: string;
  email: string;
  phone: string;
  address: string;
  
};

type DetailsFormProps = {
  initial?: Partial<Details>;
  readOnly?: boolean;
  emailDisabled?: boolean; // New Prop
  onEditClick?: () => void;
  onSave?: (data: Details) => Promise<void> | void;
  className?: string;
  includeLogo?: boolean;
  logoUrl?: string | null;
  onLogoChange?: (url: string | null, file?: File | null) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-black/80 font-medium leading-6 lg:leading-10">{children}</div>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-full bg-white px-5 text-sm",
        "border border-black/10 outline-none",
        "focus:border-black/30 focus:ring-2 focus:ring-black/10 text-black/80",
        props.disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export default function DetailsForm({
  initial,
  readOnly = false,
  emailDisabled = false, // Default to false
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
      address: initial?.address ?? "",
    }),
    [initial]
  );

  const [form, setForm] = useState<Details>(defaults);

  const set = <K extends keyof Details>(key: K, value: Details[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleEdit = () => {
    onEditClick?.();
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
      <div className="lg:col-span-3"><FieldLabel>{label}</FieldLabel></div>
      <div className="lg:col-span-9">{input}</div>
    </div>
  );

  return (
    <section className={["w-full rounded-md border bg-white shadow-sm p-5 sm:p-8", className].join(" ")}>
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
              // REQUIREMENT: Combined logic to ensure email is disabled for manager
              disabled={isLocked || saving || emailDisabled}
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
          label="Address "
          input={
            <TextInput
              disabled={isLocked || saving}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          }
        />

        
      </div>

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
        <div className="flex flex-col sm:flex-row items-center justify-left gap-4">
          <ActionButton
            label="Edit Details"
            variant="outline"
            disabled={readOnly || saving}
            onClick={handleEdit}
            fullWidth={false}
            className="w-[220px]"
          />
          <ActionButton
            label={saving ? "Saving..." : "Save Changes"}
            variant="primary"
            disabled={!onSave || isLocked || saving}
            onClick={handleSave}
            fullWidth={false}
            className="w-[220px]"
          />
        </div>
      </div>
    </section>
  );
}