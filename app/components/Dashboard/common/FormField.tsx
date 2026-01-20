"use client";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  value: string;
  onChange: (next: string) => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
};

export default function FormField({
  name,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  options = [],
  disabled = false,
}: Props) {
  const labelCls = "text-xs text-gray-500 mb-2 block";
  const inputCls =
    "w-full h-11 rounded-full border border-gray-200 bg-white px-5 text-sm text-gray-900 " +
    "outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200";
  const disabledCls = "bg-gray-100 text-gray-400 cursor-not-allowed";

  if (type === "radio") {
    return (
      <div className="py-1">
        {label ? <label className={labelCls}>{label}</label> : null}

        <div className="flex items-center justify-between">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 text-sm text-gray-600">
              <span>{opt.label}</span>
              <input
                type="radio"
                name={name} // ✅ MUST be field name
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === "dropdown") {
    return (
      <div>
        {label ? <label className={labelCls}>{label}</label> : null}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${inputCls} ${disabled ? disabledCls : ""}`}
        >
          <option value="">{placeholder ?? "Select"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {label ? <label className={labelCls}>{label}</label> : null}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputCls} ${disabled ? disabledCls : ""}`}
      />
    </div>
  );
}
