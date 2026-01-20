"use client";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "number" | "date" | "dropdown" | "radio";
  options?: { value: string; label: string }[];
};

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  options = [],
}: FormFieldProps) {
  if (type === "radio") {
    return (
      <div className="space-y-2">
        <label className="text-[12px] text-gray-500">{label}</label>
        <div className="flex gap-6">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={label}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5 cursor-pointer accent-orange-500"
                />
              </div>
              <span className="text-gray-700 text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-[12px] text-gray-500">{label}</label>

      {type === "dropdown" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-full border border-gray-200 px-4 py-2 outline-none
            focus:border-orange-500 focus:ring-2 focus:ring-orange-200
            ${!value ? "text-gray-300" : "text-gray-800"}
          `}
        >
          <option value="" disabled>{placeholder || "Select an option"}</option>
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-full border border-gray-200 px-4 py-2 outline-none
          placeholder:text-gray-300 text-gray-800
          focus:border-orange-500 focus:ring-2 focus:ring-orange-200
        "
      />
      )}
    </div>
  );
}
