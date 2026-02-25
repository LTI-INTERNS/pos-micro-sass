import React from "react";

type Props = {
  value: number;
  tone?: "orange" | "green" | "gray";
  className?: string;
};

function clampPct(p: number) {
  if (Number.isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p));
}

export default function ProgressBar({
  value,
  tone = "gray",
  className,
}: Props) {
  const width = `${clampPct(value)}%`;

  const fill =
    tone === "green"
      ? "bg-green-600"
      : tone === "orange"
      ? "bg-orange-500"
      : "bg-gray-500";

  return (
    <div className={["h-2 w-full rounded-full bg-gray-200", className ?? ""].join(" ")}>
      <div className={["h-2 rounded-full", fill].join(" ")} style={{ width }} />
    </div>
  );
}
