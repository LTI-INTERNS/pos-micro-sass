"use client";

import * as React from "react";
import FormField from "@/components/Admin/common/FormField";

export type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  readOnly?: boolean;
};

type ReusableFormProps = {
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
  values?: Record<string, string>;
  onFieldChange?: (name: string, value: string) => void;
  onSubmit: (values: Record<string, string>) => void;
  className?: string;
};

export default function ReusableForm({
  fields,
  initialValues,
  values: controlledValues,
  onFieldChange,
  onSubmit,
  className = "",
}: ReusableFormProps) {
  const isControlled = controlledValues !== undefined;

  const [internalValues, setInternalValues] = React.useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const field of fields) {
      base[field.name] = initialValues?.[field.name] ?? "";
    }
    return base;
  });

  React.useEffect(() => {
    if (isControlled) return;

    const nextValues: Record<string, string> = {};
    for (const field of fields) {
      nextValues[field.name] = initialValues?.[field.name] ?? "";
    }
    setInternalValues(nextValues);
  }, [fields, initialValues, isControlled]);

  const values = isControlled ? controlledValues : internalValues;

  const setField = (name: string, next: string) => {
    if (isControlled) {
      onFieldChange?.(name, next);
      return;
    }

    setInternalValues((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values ?? {});
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={values?.[field.name] ?? ""}
          onChange={(next) => setField(field.name, next)}
          type={field.type ?? "text"}
          readOnly={field.readOnly}
        />
      ))}
    </form>
  );
}