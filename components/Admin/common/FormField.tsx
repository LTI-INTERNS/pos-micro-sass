"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "number" | "date" | "dropdown" | "password" | "email" | "tel";
  options?: { value: string; label: string }[];
  disabled?: boolean;
  readOnly?: boolean;
  min?: string;
  max?: string;
  maxLength?: number;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  pattern?: string;
};

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  options = [],
  disabled = false,
  readOnly = false,
  min,
  max,
  maxLength,
  inputMode,
  pattern,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label className="text-[12px] text-gray-500">{label}</label>

      {type === "dropdown" ? (
        <select
          value={value}
          disabled={disabled || readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-full border px-4 py-2 outline-none
            ${(disabled || readOnly) ? "bg-gray-100 text-gray-400" : "border-gray-200"}
            ${!value ? "text-gray-300 font-normal" : "text-gray-800 font-normal"}
            focus:border-orange-500 focus:ring-2 focus:ring-orange-200
          `}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-gray-800">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative w-full">
          <input
            type={resolvedType}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            min={min}
            max={max}
            maxLength={maxLength}
            inputMode={inputMode}
            pattern={pattern}
            className={`
              w-full rounded-full border px-4 py-2 outline-none
              placeholder:text-gray-300
              ${isPassword ? "pr-10" : ""}
              ${
                disabled || readOnly
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : "text-gray-800 border-gray-200"
              }
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200
            `}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}