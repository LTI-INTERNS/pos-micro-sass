"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Check } from "lucide-react";

type Shape = "circle" | "rectangle";

type ImageUploaderProps = {
  value?: string | null;
  onChange: (url: string, file: File) => void;
  shape?: Shape;
  disabled?: boolean;
  label?: string;
  hint?: string;
};

export default function ImageUploader({
  value = null,
  onChange,
  shape = "rectangle",
  disabled = false,
  label = "Upload Image",
  hint = "PNG, JPG, SVG",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);

  useEffect(() => {
    setPreviewUrl(value ?? null);
  }, [value]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(url, file);
  };

  const isCircle = shape === "circle";

  const containerClass = [
    "relative overflow-hidden border-2 border-dashed transition-all duration-200 focus:outline-none flex items-center justify-center",
    isCircle ? "w-24 h-24 rounded-full" : "w-full max-w-40 mx-auto py-15 rounded-xl aspect-video",
    disabled
      ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
      : "cursor-pointer border-orange-400 bg-orange-50/60 hover:bg-orange-50 hover:border-orange-500",
  ].join(" ");

  return (
    <div className={`flex flex-col items-center gap-2 ${isCircle ? "py-2" : ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className={containerClass}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt={label}
              fill
              unoptimized
              className={isCircle ? "object-cover" : "object-contain bg-white"}
            />
            <div
              className={[
                "absolute bg-orange-500 rounded-full flex items-center justify-center shadow",
                isCircle ? "bottom-1 right-1 w-5 h-5" : "top-2 right-2 w-6 h-6",
              ].join(" ")}
            >
              <Check
                className={isCircle ? "w-3 h-3 text-white" : "w-4 h-4 text-white"}
                strokeWidth={3}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-orange-500">
            <div
              className={[
                "rounded-full bg-orange-100 flex items-center justify-center",
                isCircle ? "w-7 h-7" : "w-8 h-8",
              ].join(" ")}
            >
              <Upload className={isCircle ? "w-3.5 h-3.5" : "w-4 h-4"} />
            </div>
            <span className={`font-semibold ${isCircle ? "text-[10px]" : "text-sm"}`}>
              {label}
            </span>
            <span className="text-[11px] text-gray-500">{hint}</span>
          </div>
        )}
      </button>

      {hint && <p className="text-xs text-gray-400">{hint}</p>}

      <input aria-label={label}
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