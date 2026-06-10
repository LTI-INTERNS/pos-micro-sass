"use client";

type Props = { status: "ACTIVE" | "INACTIVE" };

export default function StatusDot({ status }: Props) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        isActive ? "text-green-600" : "text-gray-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
