"use client";

import * as React from "react";
import FormField from "@/app/components/Dashboard/common/FormField";

export type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  options?: { value: string; label: string }[];
  disabled?: boolean;

  // NEW: grid span (1 = half width, 2 = full width)
  span?: 1 | 2;
};


type ReusableFormProps = {
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;

  //  NEW
  onValuesChange?: (values: Record<string, string>) => void;
  resetKey?: string | number;
};

export default function ReusableForm({
  fields,
  initialValues,
  onSubmit,
  onValuesChange,
  resetKey,
}: ReusableFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});

  //  Reset ONLY when popup opens (or resetKey changes)
  React.useEffect(() => {
    const base: Record<string, string> = {};
    for (const f of fields) base[f.name] = initialValues?.[f.name] ?? "";
    setValues(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const setField = (name: string, next: string) => {
    setValues((prev) => {
      const merged = { ...prev, [name]: next };
      onValuesChange?.(merged); //  notify parent
      return merged;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

 return (
  <form
    onSubmit={handleSubmit}
    className="grid grid-cols-2 gap-x-6 gap-y-4"
  >
    {fields.map((f) => (
      <div key={f.name} className={f.span === 1 ? "col-span-1" : "col-span-2"}>
        <FormField
          name={f.name}
          label={f.label}
          placeholder={f.placeholder}
          type={f.type ?? "text"}
          value={values[f.name] ?? ""}
          onChange={(next) => setField(f.name, next)}
          options={f.options}
          disabled={f.disabled}
        />
      </div>
    ))}
  </form>
);
}
