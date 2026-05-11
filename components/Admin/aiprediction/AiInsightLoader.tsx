"use client";

import { RefreshCw, Sparkles, Loader2 } from "lucide-react";
import LoadingState from "@/components/Admin/common/LoadingState";

type Props = {
  loading?:     boolean;
  generating?:  boolean;
  error?:       string | null;
  hasData?:     boolean;
  onGenerate:   () => void;
  generateLabel?: string;
};

export default function AiInsightLoader({
  loading     = false,
  generating  = false,
  error       = null,
  hasData     = false,
  onGenerate,
  generateLabel = "Generate AI Insights",
}: Props) {
  if (loading) {
    return <LoadingState message="Loading insights..." className="h-64" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
          Retry
        </button>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
          <Sparkles size={28} className="text-orange-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700">No AI insight yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Click below to generate predictions using Gemini AI
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-60 shadow-sm"
        >
          {generating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          {generating ? "Generating..." : generateLabel}
        </button>
      </div>
    );
  }

  return null;
}
