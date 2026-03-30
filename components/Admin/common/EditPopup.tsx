"use client";

import { useEffect, useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";

export type EditField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  readOnly?: boolean;
  options?: { label: string; value: string }[];
};

type Props<T extends object> = {
  open: boolean;
  title: string;
  initialValues: T | null;
  fields: EditField[];
  onClose: () => void;
  onSave: (values: T) => void;
};

export default function EditEntityModal<T extends object>({
  open,
  title,
  initialValues,
  fields,
  onClose,
  onSave,
}: Props<T>) {
  const [values, setValues] = useState<T | null>(null);

  useEffect(() => {
    if (open && initialValues) {
      setValues(initialValues);
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
        {fields.map((field) => (
          <div key={field.name} className="grid grid-cols-12 gap-2">
            <label className="col-span-4 text-sm text-gray-500 font-medium pt-2">
              {field.label}
            </label>

            <div className="col-span-8">
              {field.type === "textarea" ? (
                <textarea
                  value={String(values[field.name as keyof T] ?? "")}
                  readOnly={field.readOnly}
                  disabled={field.readOnly}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full min-h-[100px] rounded-xl border px-4 py-3 text-sm 
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-200"
                />
              ) : field.type === "select" ? (
                <select
                  value={String(values[field.name as keyof T] ?? "")}
                  disabled={field.readOnly}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full rounded-full border px-4 py-2 outline-none text-gray-600 border-gray-200 bg-white"
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
                  type={field.type || "text"}
                  value={String(values[field.name as keyof T] ?? "")}
                  readOnly={field.readOnly}
                  disabled={field.readOnly}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full rounded-full border px-4 py-2 outline-none
                  placeholder:text-gray-300 text-gray-600 border-gray-200
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", variant: "secondary", onClick: onClose },
                { label: "Save Changes", variant: "primary", onClick: () => onSave(values) },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}