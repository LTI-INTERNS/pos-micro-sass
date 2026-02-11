"use client";

import React from "react";

// Shared Field Container (Internal Helper)
function FieldWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

// Input Field
type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputField({
  label,
  type = "text",
  placeholder = "",
  required = false,
  error,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          "w-full px-4 py-3 rounded-lg",
          "bg-white/10 text-white",
          "border border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-white/40",
          error ? "border-red-400" : "",
        ].join(" ")}
      />
    </FieldWrapper>
  );
}

// Password Field
type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PasswordField(props: PasswordFieldProps) {
  return <InputField type="password" {...props} />;
}

// TextArea Field

type TextAreaFieldProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextAreaField({
  label,
  placeholder = "",
  required = false,
  error,
  rows = 4,
  value,
  onChange,
}: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          "w-full px-4 py-3 rounded-lg",
          "bg-white/10 text-white",
          "border border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-white/40",
          error ? "border-red-400" : "",
        ].join(" ")}
      />
    </FieldWrapper>
  );
}

// Select Field
type SelectFieldProps = {
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectField({
  label,
  options,
  required = false,
  error,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <select
        value={value}
        onChange={onChange}
        className={[
          "w-full px-4 py-3 rounded-lg",
          "bg-white/10 text-white",
          "border border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-white/40",
          error ? "border-red-400" : "",
        ].join(" ")}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-black">
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

// Checkbox Field

type CheckboxFieldProps = {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-center space-x-3 text-white text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4"
      />
      <span>{label}</span>
    </label>
  );
}

//Global Form Error


export function FormErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-300 text-sm">
      {message}
    </div>
  );
}
