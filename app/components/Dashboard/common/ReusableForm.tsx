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
};

type ReusableFormProps = {
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
};

export default function ReusableForm({ fields, initialValues, onSubmit }: ReusableFormProps) {
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const f of fields) base[f.name] = initialValues?.[f.name] ?? "";
    return base;
  });

  React.useEffect(() => {
    const base: Record<string, string> = {};
    for (const f of fields) base[f.name] = initialValues?.[f.name] ?? "";
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
    <form onSubmit={handleSubmit} className="space-y-3">
      {fields.map((f) => (
        <FormField
          key={f.name}
          name={f.name} // THIS LINE MUST EXIST
          label={f.label}
          placeholder={f.placeholder}
          type={f.type ?? "text"}
          value={values[f.name] ?? ""}
          onChange={(next) => setField(f.name, next)}
          options={f.options}
          disabled={f.disabled}
        />
      ))}
    </form>
  );
}
