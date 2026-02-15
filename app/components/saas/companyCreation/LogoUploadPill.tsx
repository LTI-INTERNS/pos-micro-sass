//logo upload 

"use client";

import React, { useId, useRef, useState } from "react";

type Props = {
  label?: string;
  onFileChange?: (file: File | null) => void;
};

export default function LogoUploadPill({
  label = "Upload Company Logo",
  onFileChange,
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const pick = () => inputRef.current?.click();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-white">
        Logo
      </label>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFileName(f?.name ?? "");
          onFileChange?.(f);
        }}
      />

      <button
        type="button"
        onClick={pick}
        className={[
          "w-full rounded-xl px-6 py-4",
          "bg-white/10 backdrop-blur-sm border border-white/20 text-white",
          "flex items-center justify-center gap-3",
          "hover:bg-white/15 hover:border-white/30 transition-all duration-200",
        ].join(" ")}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 border border-orange-500/30">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-orange-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </span>
        <span className="font-medium">
          {fileName ? fileName : label}
        </span>
      </button>
    </div>
  );
}