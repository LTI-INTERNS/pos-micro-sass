"use client";

import React from "react";

// Shared Wrapper
type WrapperProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function FieldWrapper({
  label,
  required,
  error,
  children,
}: WrapperProps) {
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

// Base Input Field
type BaseProps = {
  label: string;
  required?: boolean;
  error?: string;
  value?: string;
  variant?: "glass" | "solid";
};

function getInputStyles(error?: string, variant: "glass" | "solid" = "glass") {
  const base =
    "w-full px-5 py-3 rounded-full focus:outline-none transition";

  const glass =
    "bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-white/40";

  const solid =
    "bg-white text-black border border-gray-300 focus:ring-2 focus:ring-orange-400";

  return [
    base,
    variant === "glass" ? glass : solid,
    error ? "border-red-400" : "",
  ].join(" ");
}

// Input Field
type InputFieldProps = BaseProps & {
  type?: string;
  placeholder?: string;
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
  variant = "glass",
}: InputFieldProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={getInputStyles(error, variant)}
      />
    </FieldWrapper>
  );
}

// Password Field
export function PasswordField(props: InputFieldProps) {
  return <InputField type="password" {...props} />;
}

// TextArea Field (With Counter)
type TextAreaProps = BaseProps & {
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextAreaField({
  label,
  placeholder = "",
  required = false,
  error,
  rows = 4,
  value = "",
  onChange,
  variant = "glass",
  maxLength,
  showCount = false,
}: TextAreaProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          "w-full px-5 py-4 rounded-2xl focus:outline-none transition",
          variant === "glass"
            ? "bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-white/40"
            : "bg-white text-black border border-gray-300 focus:ring-2 focus:ring-orange-400",
          error ? "border-red-400" : "",
        ].join(" ")}
      />

      {showCount && maxLength && (
        <p className="text-xs text-white/60 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </FieldWrapper>
  );
}

// Select Field
type SelectProps = BaseProps & {
  options: { label: string; value: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function SelectField({
  label,
  options,
  required = false,
  error,
  value,
  onChange,
  variant = "glass",
}: SelectProps) {
  return (
    <FieldWrapper label={label} required={required} error={error}>
      <select
        value={value}
        onChange={onChange}
        className={getInputStyles(error, variant)}
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
type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxProps) {
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

//File Upload Field
type FileUploadProps = {
  label: string;
  onChange?: (file: File | null) => void;
};

export function FileUploadField({
  label,
  onChange,
}: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white">{label}</label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          onChange?.(e.target.files ? e.target.files[0] : null)
        }
        className="w-full px-5 py-4 rounded-full bg-white text-black"
      />
    </div>
  );
}


//Field Row (For Payment Layout)
export function FieldRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}


//Global Form Error Message Component
export function FormErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-red-500/20 border border-red-400 text-red-300 text-sm">
      {message}
    </div>
  );
}
