"use client";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "number";
};

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-500">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-full border border-gray-200 px-5 py-3 outline-none
          placeholder:text-gray-300
          focus:border-orange-500 focus:ring-2 focus:ring-orange-200
        "
      />
    </div>
  );
}
