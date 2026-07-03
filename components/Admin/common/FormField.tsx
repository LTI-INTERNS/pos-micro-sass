"use client";

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
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
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
            ${
              disabled || readOnly
                ? "bg-gray-100 text-gray-400 border-gray-200"
                : "text-gray-800 border-gray-200"
            }
            focus:border-orange-500 focus:ring-2 focus:ring-orange-200
          `}
        />
      )}
    </div>
  );
}