"use client";

import { useState } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type ExportFormat = "pdf" | "csv";

type IncludeOption = {
  id: string;
  label: string;
  checked: boolean;
};

type Props = {
  onGenerate?: (format: ExportFormat, includes: string[]) => void;
};

export default function ExportReportPanel({ onGenerate }: Props) {
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [includes, setIncludes] = useState<IncludeOption[]>([
    { id: "charts", label: "Charts", checked: false },
    { id: "summary", label: "Summary", checked: false },
    { id: "rawData", label: "Raw Data", checked: true },
  ]);

  const toggleInclude = (id: string) => {
    setIncludes((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, checked: !opt.checked } : opt
      )
    );
  };

  const handleGenerate = () => {
    const selected = includes.filter((o) => o.checked).map((o) => o.id);
    onGenerate?.(format, selected);
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] flex flex-col p-6 gap-6 min-w-[260px] w-full">
      {/* Title */}
      <div className="flex items-center gap-3">
        {/* Chart icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-orange-500 shrink-0"
        >
          <rect x="2" y="10" width="4" height="8" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="8" y="6" width="4" height="12" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="14" y="2" width="4" height="16" rx="1" fill="currentColor" />
        </svg>
        <span
          className="text-[16px] font-medium text-[#19191c]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Export Report
        </span>
      </div>

      {/* Format selector: PDF / CSV radio buttons */}
      <div className="flex items-center gap-6">
        {/* PDF */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => setFormat("pdf")}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${format === "pdf"
                ? "border-orange-500 bg-orange-500"
                : "border-gray-300 bg-white"
              }`}
            aria-label="Select PDF"
          >
            {format === "pdf" && (
              <span className="w-2 h-2 rounded-full bg-white block" />
            )}
          </button>
          <span
            className="text-[16px] text-[#19191c]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
          >
            PDF
          </span>
        </label>

        {/* CSV */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => setFormat("csv")}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
              ${format === "csv"
                ? "border-orange-500 bg-orange-500"
                : "border-gray-300 bg-white"
              }`}
            aria-label="Select CSV"
          >
            {format === "csv" && (
              <span className="w-2 h-2 rounded-full bg-white block" />
            )}
          </button>
          <span
            className="text-[16px] text-[#828487]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
          >
            CSV
          </span>
        </label>
      </div>

      {/* Include label */}
      <p
        className="text-[14px] font-medium text-[#353535] -mb-2"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Include :
      </p>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        {includes.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* Custom checkbox */}
            <button
              type="button"
              onClick={() => toggleInclude(opt.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0
                ${opt.checked
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300 bg-white"
                }`}
              aria-label={`Toggle ${opt.label}`}
            >
              {opt.checked && (
                <svg
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L4 7L10 1"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className="text-[14px] text-[#353535]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      {/* Report Preview area */}
      <div
        className="rounded-[10px] bg-[#fff7f1] flex items-center justify-center"
        style={{ minHeight: 160 }}
      >
        <span
          className="text-[16px] text-[#b3b3b3]"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          Report Preview
        </span>
      </div>

      {/* Generate button */}
      <ActionButton
        variant="primary"
        fullWidth={true}
        onClick={handleGenerate}
      >
        Generate Report
      </ActionButton>
    </div>
  );
}
