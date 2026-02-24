"use client";

import * as React from "react";
import PopupActions from "@/components/Admin/common/PopupActions";

export type SelectField = {
  name: string;
  placeholder?: string;
  options: { label: string; value: string }[];
};

type FilterPopupProps = {
  open: boolean;
  onClose: () => void;
  fields: SelectField[];
  onApply: (values: Record<string, string>) => void;
};

export default function FilterPopup({
  open,
  onClose,
  fields,
  onApply,
}: FilterPopupProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {};
      fields.forEach((f) => (initial[f.name] = ""));
      setValues(initial);
    }
  }, [open, fields]);

  if (!open) return null;

  return (
    <>
      
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] "
        onClick={onClose}
      />

      
      <div className="absolute top-full right-0 z-50 mt-2">
        <div
          className="
            absolute -top-2 right-6
            h-0 w-0
            border-l-[8px] border-r-[8px] border-b-[8px]
            border-l-transparent border-r-transparent border-b-white
          "
        />

        <div className="w-[320px] rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
          <div className="space-y-2">
            {fields.map((field) => (
              <select
                key={field.name}
                value={values[field.name]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className="
                  w-full rounded-xl border border-gray-200 px-4 py-3
                  text-gray-800 outline-none
                  focus:border-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer
                "
              >
                <option value="">
                  {field.placeholder ?? "Select"}
                </option>

                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <PopupActions
            actions={[
              {
                label: "Cancel",
                variant: "secondary",
                onClick: onClose,
              },
              {
                label: "Apply",
                variant: "primary",
                onClick: () => {
                  onApply(values);
                  onClose();
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
