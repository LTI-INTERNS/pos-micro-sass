"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

/* Shared Wrapper */

type FieldWrapperProps = {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  wrapperClassName?: string;
};

function FieldWrapper({
  label,
  required,
  error,
  htmlFor,
  children,
  wrapperClassName = "",
}: FieldWrapperProps) {
  return (
    <div className={["space-y-1", wrapperClassName].join(" ")}>
      {label && (
        <label className="text-sm text-white" htmlFor={htmlFor}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

/* Shared Style Builder */

function buildInputStyles(
  error?: string,
  variant: "glass" | "solid" = "glass",
  disabled?: boolean,
  extra?: string
) {
  const base =
    "w-full px-5 py-2 rounded-full focus:outline-none transition";

  const glass =
    "bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-white/40";

  const solid =
    "bg-white text-black border border-gray-300 focus:ring-2 focus:ring-orange-400";

  return [
    base,
    variant === "glass" ? glass : solid,
    error ? "border-red-400" : "",
    disabled ? "opacity-60 cursor-not-allowed" : "",
    extra,
  ].join(" ");
}

/* Input Field */

type InputFieldProps = {
  label: string;
  variant?: "glass" | "solid";
  error?: string;
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({
  label,
  variant = "glass",
  error,
  wrapperClassName,
  className,
  required,
  id,
  ...rest
}: InputFieldProps) {
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      htmlFor={id}
      wrapperClassName={wrapperClassName}
    >
      <input
        id={id}
        className={buildInputStyles(error, variant, rest.disabled, className)}
        {...rest}
      />
    </FieldWrapper>
  );
}

/* Password Field  */

export function PasswordField({
  label,
  variant = "glass",
  error,
  wrapperClassName,
  className,
  required,
  id,
  ...rest
}: InputFieldProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconColor =
    variant === "glass"
      ? "text-white/60 hover:text-white"
      : "text-gray-400 hover:text-gray-700";

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      htmlFor={id}
      wrapperClassName={wrapperClassName}
    >
      <div className="relative">
        <input
          id={id}
          type={mounted && visible ? "text" : "password"}
          className={buildInputStyles(
            error,
            variant,
            rest.disabled,
            [mounted ? "pr-12" : "", className].join(" ")
          )}
          {...rest}
        />
        {mounted && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className={[
              "absolute right-4 top-1/2 -translate-y-1/2 transition",
              iconColor,
              rest.disabled ? "pointer-events-none opacity-40" : "",
            ].join(" ")}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}

/* TextArea Field */

type TextAreaFieldProps = {
  label: string;
  variant?: "glass" | "solid";
  error?: string;
  wrapperClassName?: string;
  showCount?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({
  label,
  variant = "glass",
  error,
  wrapperClassName,
  className,
  required,
  id,
  showCount = false,
  maxLength,
  value = "",
  ...rest
}: TextAreaFieldProps) {
  const base =
    "w-full px-5 py-4 rounded-2xl focus:outline-none transition resize-none";

  const glass =
    "bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-white/40";

  const solid =
    "bg-white text-black border border-gray-300 focus:ring-2 focus:ring-orange-400";

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      htmlFor={id}
      wrapperClassName={wrapperClassName}
    >
      <textarea
        id={id}
        maxLength={maxLength}
        value={value}
        className={[
          base,
          variant === "glass" ? glass : solid,
          error ? "border-red-400" : "",
          rest.disabled ? "opacity-60 cursor-not-allowed" : "",
          className,
        ].join(" ")}
        {...rest}
      />

      {showCount && maxLength && (
        <p className="text-xs text-white/60 text-right">
          {String(value).length}/{maxLength}
        </p>
      )}
    </FieldWrapper>
  );
}

/* Select Field */

type SelectFieldProps = {
  label: string;
  variant?: "glass" | "solid";
  error?: string;
  options: { label: string; value: string }[];
  wrapperClassName?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({
  label,
  variant = "glass",
  error,
  options,
  wrapperClassName,
  className,
  required,
  id,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      htmlFor={id}
      wrapperClassName={wrapperClassName}
    >
      <select
        id={id}
        className={buildInputStyles(error, variant, rest.disabled, className)}
        {...rest}
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

/* Checkbox */
type CheckboxFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function CheckboxField({ label, className, ...rest }: CheckboxFieldProps) {
  return (
    <label className="flex items-center space-x-3 text-white text-sm">
      <input
        type="checkbox"
        className={["w-4 h-4", className].join(" ")}
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}

/* Global Form Error */
export function FormErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-500/20 border border-red-400 text-red-300 text-sm">
      {message}
    </div>
  );
}