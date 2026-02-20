"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";

type CompanyDetails = {
  companyName: string;
  regNo: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  logoFile?: File | null;
  backgroundFile?: File | null;
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
    <div className="text-sm text-black/80 font-medium leading-10">
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

function UploadButton({label, fileName,disabled,onPick,}: {label: string;fileName?: string;disabled?: boolean; onPick: () => void;})  {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPick}
      className={[
        "w-full h-12 rounded-full bg-white",
        "border-2 border-dashed border-black/35",
        "flex items-center justify-center gap-3",
        "text-sm font-medium text-black/70",
        "hover:bg-black/3 transition",
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      title={fileName ? fileName : label}
    >
      <Upload className="w-5 h-5 text-black/60" />
      <span>{label}</span>
      {fileName ? (
        <span className="ml-2 text-xs text-black/40 max-w-[40%] truncate">
          ({fileName})
        </span>
      ) : null}
    </button>
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
  const bgInputRef = useRef<HTMLInputElement | null>(null);

  const defaults: CompanyDetails = useMemo(
    () => ({
      companyName: initial?.companyName ?? "",
      regNo: initial?.regNo ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      addressLine1: initial?.addressLine1 ?? "",
      addressLine2: initial?.addressLine2 ?? "",
      logoFile: initial?.logoFile ?? null,
      backgroundFile: initial?.backgroundFile ?? null,
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

  return (
    <section
      className={[
        "w-full rounded-md border border-black/20 bg-white shadow-sm",
        "p-8",
        className,
      ].join(" ")}
    >
      <div className="grid grid-cols-12 gap-x-10 gap-y-4">
        
        <div className="col-span-4 space-y-4">
          <FieldLabel>Company Name</FieldLabel>
          <FieldLabel>Registration No</FieldLabel>
          <FieldLabel>Email</FieldLabel>
          <FieldLabel>Phone</FieldLabel>
          <FieldLabel>Address Line 1</FieldLabel>
          <FieldLabel>Address Line 2</FieldLabel>
        </div>

        
        <div className="col-span-6 space-y-4">
          <TextInput
            disabled={isLocked || saving}
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder=""
          />
          <TextInput
            disabled={isLocked || saving}
            value={form.regNo}
            onChange={(e) => set("regNo", e.target.value)}
            placeholder=""
          />
          <TextInput
            disabled={isLocked || saving}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder=""
            type="email"
          />
          <TextInput
            disabled={isLocked || saving}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder=""
          />
          <TextInput
            disabled={isLocked || saving}
            value={form.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
            placeholder=""
          />
          <TextInput
            disabled={isLocked || saving}
            value={form.addressLine2}
            onChange={(e) => set("addressLine2", e.target.value)}
            placeholder=""
          />

         
          <div className="pt-2">
            <UploadButton
              disabled={isLocked || saving}
              label="Change company logo"
              fileName={form.logoFile?.name}
              onPick={() => logoInputRef.current?.click()}
            />
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => set("logoFile", e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        
        <div className="col-span-2" />

        
        <div className="col-span-6 pt-10">
          <UploadButton
            disabled={isLocked || saving}
            label="Upload Background Image"
            fileName={form.backgroundFile?.name}
            onPick={() => bgInputRef.current?.click()}
          />
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => set("backgroundFile", e.target.files?.[0] ?? null)}
          />
        </div>

        
        <div className="col-span-12 pt-10 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={handleEdit}
            disabled={readOnly || saving}
            className={[
              "w-full max-w-105 h-12 rounded-full border border-orange-400 bg-white text-orange-500 hover:bg-orange-50 cursor-pointer ",
              (readOnly || saving) ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            Edit Details
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!onSave || isLocked || saving}
            className={[
              "w-full max-w-105 h-12 rounded-full bg-orange-500 text-white hover:bg-orange-600 cursor-pointer ",
             
              
              (!onSave || isLocked || saving) ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
