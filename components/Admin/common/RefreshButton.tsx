"use client";

import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  title?: string;
}

export default function RefreshButton({
  onClick,
  loading = false,
  title = "Refresh",
}: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center text-orange-400 hover:text-orange-600 transition active:scale-95 cursor-pointer h-10 w-10 flex-shrink-0"
    >
      <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
    </button>
  );
}
