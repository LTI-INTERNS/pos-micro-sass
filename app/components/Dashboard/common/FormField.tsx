"use client";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "number" | "date" | "dropdown";
};

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] text-gray-500">{label}</label>

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
    </div>
  );
}
