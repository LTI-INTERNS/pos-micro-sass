"use client";

import * as React from "react";
import FormField from "./FormField";

export type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "dropdown" | "password" | "email" | "tel";
  options?: { value: string; label: string }[];
  disabled?: boolean; 
  required?: boolean;
};

type ReusableFormProps = {
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
};

export default function ReusableForm({
  fields,
  initialValues,
  onSubmit,
}: ReusableFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const f of fields) {
      base[f.name] = initialValues?.[f.name] ?? "";
    }
    return base;
  });

  React.useEffect(() => {
    const base: Record<string, string> = {};
    for (const f of fields) {
      base[f.name] = initialValues?.[f.name] ?? "";
    }
    setValues(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fields), JSON.stringify(initialValues)]);

  const setField = (name: string, next: string) => {
    setValues((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <FormField
          key={f.name}
          label={f.label}
          placeholder={f.placeholder}
          type={f.type ?? "text"}
          options={f.options}
          disabled={f.disabled}   
          value={values[f.name] ?? ""}
          onChange={(next) => setField(f.name, next)}
        />
      ))}
    </form>
  );
}
