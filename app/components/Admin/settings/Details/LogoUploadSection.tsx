"use client";

import React, { useRef, useState, useEffect } from "react";
import { Upload, Check } from "lucide-react";

type LogoUploadSectionProps = {
  currentLogoUrl: string | null;
  onLogoChange: (logoUrl: string, file?: File | null) => void;
  disabled?: boolean;
  title?: string;
};

export default function LogoUploadSection({
  currentLogoUrl,
  onLogoChange,
  disabled = false,
  title = "Company Logo",
}: LogoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentLogoUrl);

  useEffect(() => {
    setUploadedUrl(currentLogoUrl);
  }, [currentLogoUrl]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    onLogoChange(url, file);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">
        Upload a logo for your company profile.
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className={[
          "relative w-full max-w-40 mx-auto",
          "cursor-pointer rounded-xl overflow-hidden aspect-video border-2 border-dashed",
          "transition-all duration-200 focus:outline-none flex items-center justify-center",
          disabled
            ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
            : "border-orange-400 bg-orange-50/60 hover:bg-orange-50 hover:border-orange-500",
        ].join(" ")}
      >
        {uploadedUrl ? (
          <>
            <img
              src={uploadedUrl}
              alt="Company logo"
              className="w-full h-full object-contain bg-white"
            />
            <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-orange-500">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center ">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">Upload Logo</span>
            <span className="text-[11px] text-gray-500">PNG, JPG, SVG</span>
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={disabled}
      />
    </div>
  );
}