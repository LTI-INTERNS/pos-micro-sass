"use client";

import React, { useState, useEffect, useRef } from "react";
import ImageUploader from "@/components/Admin/common/ImageUploader";
import { uploadService, UploadFolder } from "@/lib/services/upload-service";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type LogoUploadSectionProps = {
  currentLogoUrl: string | null;
  onLogoChange: (logoUrl: string | null) => void;
  folder?: UploadFolder;
  disabled?: boolean;
  title?: string;
  description?: string;
};

export default function LogoUploadSection({
  currentLogoUrl,
  onLogoChange,
  folder = "companies",
  disabled = false,
  title = "Company Logo",
  description = "Upload or replace your company logo. PNG, JPG, or SVG — max 5 MB.",
}: LogoUploadSectionProps) {
  const [previewUrl, setPreviewUrl]   = useState<string | null>(currentLogoUrl);
  const [status, setStatus]           = useState<UploadStatus>("idle");
  const [progress, setProgress]       = useState(0);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);
  const abortRef                      = useRef<AbortController | null>(null);

  useEffect(() => {
    setPreviewUrl(currentLogoUrl);
  }, [currentLogoUrl]);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const handleImageChange = async (blobUrl: string, file: File) => {
    setPreviewUrl(blobUrl); 
    setStatus("uploading");
    setProgress(0);
    setErrorMsg(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await uploadService.upload(file, folder, {
        signal:     controller.signal,
        onProgress: setProgress,
      });

      uploadService.revokePreview(blobUrl);
      setPreviewUrl(result.url);
      setStatus("success");
      onLogoChange(result.url);

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      if ((err as Error)?.name === "CanceledError") return; // intentional abort
      uploadService.revokePreview(blobUrl);
      setPreviewUrl(currentLogoUrl); 
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="mt-3 min-h-[20px]">
          {status === "uploading" && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading… {progress}%</span>
              <div className="flex-1 max-w-[140px] h-1.5 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Logo uploaded successfully
            </div>
          )}

          {status === "error" && errorMsg && (
            <div className="flex items-start gap-1.5 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <ImageUploader
          value={previewUrl}
          onChange={handleImageChange}
          shape="rectangle"
          disabled={disabled || status === "uploading"}
          label="Upload Logo"
          hint="PNG, JPG, SVG"
        />
      </div>
    </div>
  );
}