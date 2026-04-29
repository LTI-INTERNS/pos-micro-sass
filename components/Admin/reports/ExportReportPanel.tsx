"use client";

import { useState } from "react";
import ActionButton from "@/components/Admin/common/ActionButton";
import {
  useCSVExport,
  usePDFExport,
  type ExportColumn,
  type PDFOptions,
  type RowData,
} from "@/components/Admin/reports/exportUtils";


export type ExportFormat = "pdf" | "csv";

type IncludeOption = {
  id: string;
  label: string;
  checked: boolean;
};

type Props<T extends RowData> = {
  data: T[];
  filename?: string;
  columns?: ExportColumn[];
  pdfOptions?: PDFOptions;
  onGenerate?: (format: ExportFormat, includes: string[]) => void;
};


const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "csv", label: "CSV" },
];

export default function ExportReportPanel<T extends RowData>({
  data,
  filename = "report",
  columns,
  pdfOptions,
  onGenerate,
}: Props<T>) {
  const [format, setFormat]     = useState<ExportFormat>("pdf");
  const [loading, setLoading]   = useState(false);
  const [includes, setIncludes] = useState<IncludeOption[]>([
    { id: "charts",  label: "Charts",   checked: false },
    { id: "summary", label: "Summary",  checked: false },
    { id: "rawData", label: "Raw Data", checked: true  },
  ]);

  const exportCSV = useCSVExport<T>();
  const exportPDF = usePDFExport<T>();

  const toggleInclude = (id: string) =>
    setIncludes((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );

  const handleGenerate = async () => {
    if (!data?.length) return;
    setLoading(true);
    try {
      const selected = includes.filter((o) => o.checked).map((o) => o.id);

      if (format === "csv") {
        exportCSV(data, filename, columns);
      } else {
        await exportPDF(data, filename, columns, pdfOptions);
      }

      onGenerate?.(format, selected);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] flex flex-col p-6 gap-5 min-w-65 w-full">

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-orange-500 shrink-0"
        >
          <rect x="2"  y="10" width="4" height="8"  rx="1" fill="currentColor" opacity="0.4" />
          <rect x="8"  y="6"  width="4" height="12" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="14" y="2"  width="4" height="16" rx="1" fill="currentColor" />
        </svg>
        <span
          className="text-[16px] font-medium text-[#19191c]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Export Report
        </span>
      </div>

      {/* ── Format selector ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 flex-wrap">
        {FORMATS.map(({ id, label }) => {
          const active = format === id;
          return (
            <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setFormat(id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${active ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}
                aria-label={`Select ${label}`}
              >
                {active && <span className="w-2 h-2 rounded-full bg-white block" />}
              </button>
              <span
                className={`text-[15px] ${active ? "text-[#19191c]" : "text-[#828487]"}`}
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
              >
                {label}
              </span>
            </label>
          );
        })}
      </div>

      {/* ── Include ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[14px] font-medium text-[#353535]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Include :
        </p>

        {includes.map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 cursor-pointer select-none">
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
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                  <path
                    d="M1 4L4 7L10 1"
                    stroke="white" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"
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

      {/* ── Format preview badge ──────────────────────────────────────────── */}
      <div className="rounded-[10px] bg-[#fff7f1] flex flex-col items-center justify-center gap-2 py-8">
        {format === "pdf" && (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-orange-400">
            <path d="M6 4h13l7 7v17a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="currentColor" strokeWidth="1.8" fill="none"/>
            <path d="M19 4v7h7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <path d="M10 17h12M10 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
        {format === "csv" && (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-orange-400">
            <path d="M6 4h13l7 7v17a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="currentColor" strokeWidth="1.8" fill="none"/>
            <path d="M19 4v7h7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            <path d="M10 16h12M10 20h12M10 24h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
        <span
          className="text-[13px] text-[#b3b3b3] uppercase tracking-wide"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
        >
          {format === "pdf" && "PDF Document"}
          {format === "csv" && "CSV File"}
        </span>
      </div>

      {/* ── Generate button ───────────────────────────────────────────────── */}
      <ActionButton
        variant="primary"
        fullWidth
        onClick={handleGenerate}
        disabled={loading || !data?.length}
      >
        {loading ? "Generating…" : "Generate Report"}
      </ActionButton>

      {!data?.length && (
        <p
          className="text-center text-[11px] text-gray-400"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          No data available to export
        </p>
      )}
    </div>
  );
}