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
          "w-full rounded-full px-6 py-4",
          "bg-white text-black",
          "flex items-center justify-center gap-3",
          "shadow-sm hover:brightness-95 transition",
        ].join(" ")}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10">
          ⬆️
        </span>
        <span className="font-medium">
          {fileName ? fileName : label}
        </span>
      </button>
    </div>
  );
}
