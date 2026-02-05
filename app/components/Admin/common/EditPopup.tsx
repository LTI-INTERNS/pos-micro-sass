"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import PopupActions from "./PopupActions";

export type EditField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea";
  readOnly?: boolean;
};

type Props<T> = {
  open: boolean;
  title: string;
  initialValues: T | null;
  fields: EditField[];
  onClose: () => void;
  onSave: (values: T) => void;
};

export default function EditEntityModal<T extends Record<string, any>>({
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
    setValues((prev) => ({ ...prev!, [name]: value }));
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
                  value={values[field.name] ?? ""}
                  readOnly={field.readOnly}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  className="w-full min-h-[100px] rounded-xl border px-4 py-3 text-sm"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={values[field.name] ?? ""}
                  readOnly={field.readOnly}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  className="w-full rounded-full border px-4 py-2 outline-none
            placeholder:text-gray-300 text-gray-600 border-gray-200"
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  variant: "secondary",
                  onClick: onClose,
                },
                {
                  label: "Save Changes",
                  variant: "primary",
                  onClick: () => onSave(values),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
