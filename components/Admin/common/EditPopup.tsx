"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { uploadService, type UploadFolder } from "@/lib/services/upload-service";

export type EditField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "image";
  readOnly?: boolean;
  options?: { label: string; value: string }[];
  uploadFolder?: UploadFolder;
};

type Props<T extends object> = {
  open: boolean;
  title: string;
  initialValues: T | null;
  fields: EditField[];
  onClose: () => void;
  onSave: (values: T) => void;
};

// ── Image upload field ────────────────────────────────────────────────────────
function ImageUploadField({
  value,
  name,
  label,
  uploadFolder = "products",
  onChange,
  onUploadingChange,
}: {
  value: string;
  name: string;
  label: string;
  uploadFolder?: UploadFolder;
  onChange: (name: string, value: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const inputId = `image-upload-${name}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setPreview(value ?? "");
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploadError("");
    setUploading(true);
    onUploadingChange(true);

    try {
      const { url } = await uploadService.upload(file, uploadFolder);
      setPreview(url);
      onChange(name, url);
    } catch {
      setUploadError("Image upload failed. Please try again.");
      setPreview(value ?? "");
      onChange(name, value ?? "");
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    setUploadError("");
    onChange(name, "");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <label
        htmlFor={inputId}
        className="col-span-4 text-sm text-gray-500 font-medium pt-2"
      >
        {label}
      </label>

      <div className="col-span-8 space-y-2">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            {preview ? (
              <Image
                src={preview}
                alt="Avatar preview"
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 border border-dashed border-orange-300 flex items-center justify-center text-orange-400 text-xs font-medium">
                No photo
              </div>
            )}
          </div>

          <div
            role="button"
            tabIndex={uploading ? -1 : 0}
            aria-label={`Upload ${label}`}
            aria-disabled={uploading}
            className={`flex-1 border border-dashed rounded-xl px-4 py-3 text-center transition-colors ${
              uploading
                ? "opacity-60 cursor-not-allowed border-gray-200"
                : "cursor-pointer border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
            onClick={() => { if (!uploading) inputRef.current?.click(); }}
            onKeyDown={(e) => {
              if (!uploading && (e.key === "Enter" || e.key === " "))
                inputRef.current?.click();
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-xs text-gray-400">
              {uploading ? (
                <span className="text-orange-500 font-medium">Uploading…</span>
              ) : (
                <>
                  Drag & drop or{" "}
                  <span className="text-orange-500 font-medium">browse</span>
                </>
              )}
            </p>
            <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG, WEBP · max 5 MB</p>
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {preview && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-red-400 hover:text-red-600 shrink-0"
            >
              Remove
            </button>
          )}
        </div>

        {uploadError && (
          <p className="text-xs text-red-500 px-1">{uploadError}</p>
        )}
      </div>
    </div>
  );
}

export default function EditEntityModal<T extends object>({
  open,
  title,
  initialValues,
  fields,
  onClose,
  onSave,
}: Props<T>) {
  const [values, setValues] = useState<T | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      setValues(initialValues);
      setImageUploading(false);
    }
  }, [open, initialValues]);

  if (!open || !values) return null;

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev!, [name]: value } as T));
  };

  return (
    <ModalShell
      open={open}
      title={title}
      onClose={onClose}
      widthClassName="w-[760px] max-w-[90vw]"
    >
      <div className="space-y-4">
        {fields.map((field) => {
          const fieldId = `edit-field-${field.name}`;

          const inputBaseClass = "w-full border px-4 py-2 outline-none transition-all duration-200";
          const stateClass = field.readOnly
            ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed select-none"
            : "bg-white text-gray-600 border-gray-200 focus:border-orange-300 focus:ring-1 focus:ring-orange-100";

          if (field.type === "image") {
            return (
              <ImageUploadField
                key={field.name}
                name={field.name}
                label={field.label}
                uploadFolder={field.uploadFolder}
                value={String(values[field.name as keyof T] ?? "")}
                onChange={handleChange}
                onUploadingChange={setImageUploading}
              />
            );
          }

          return (
            <div key={field.name} className="grid grid-cols-12 gap-2">
              <label
                htmlFor={fieldId}
                className="col-span-4 text-sm text-gray-500 font-medium pt-2"
              >
                {field.label}
              </label>

              <div className="col-span-8">
                {field.type === "textarea" ? (
                  <textarea
                    id={fieldId}
                    value={String(values[field.name as keyof T] ?? "")}
                    readOnly={field.readOnly}
                    placeholder={field.label}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${inputBaseClass} rounded-xl min-h-[100px] py-3 text-sm ${stateClass}`}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={fieldId}
                    value={String(values[field.name as keyof T] ?? "")}
                    disabled={field.readOnly}
                    title={field.label}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${inputBaseClass} rounded-full ${stateClass}`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={fieldId}
                    type={field.type || "text"}
                    value={String(values[field.name as keyof T] ?? "")}
                    readOnly={field.readOnly}
                    placeholder={field.label}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${inputBaseClass} rounded-full placeholder:text-gray-300 ${stateClass}`}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", variant: "secondary", onClick: onClose },
                {
                  label: imageUploading ? "Uploading…" : "Save Changes",
                  variant: "primary",
                  onClick: () => onSave(values),
                  disabled: imageUploading,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}