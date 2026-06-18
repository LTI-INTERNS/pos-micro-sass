"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { uploadService, UPLOAD_CONSTRAINTS } from "@/lib/services/upload-service";

// ── Types ────────────────────────────────────────────────────────────────────

export interface LogoUploadResult {
    file:      File;
    previewUrl: string;
    uploadedUrl: string;
    publicId:    string;
}

type UploadState = "idle" | "uploading" | "done" | "error";

type Props = {
    label?:        string;
    onUploadStart?: () => void;
    onUploadDone?: (result: LogoUploadResult) => void;
    onClear?:      () => void;
    externalError?: string;
    required?: boolean;
};

// ── Component ────────────────────────────────────────────────────────────────

export default function LogoUploadPill({
    label = "Upload Company Logo",
    onUploadStart,
    onUploadDone,
    onClear,
    externalError,
    required,
}: Props) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortRef  = useRef<AbortController | null>(null);

    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [progress,    setProgress]    = useState(0);
    const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
    const [fileName,    setFileName]    = useState("");
    const [error,       setError]       = useState("");

    const previewUrlRef = useRef<string | null>(null);
    useEffect(() => {
        previewUrlRef.current = previewUrl;
    }, [previewUrl]);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                uploadService.revokePreview(previewUrlRef.current);
            }
        };
    }, []);

    const clearAll = () => {
        abortRef.current?.abort();
        uploadService.revokePreview(previewUrl);
        setPreviewUrl(null);
        setFileName("");
        setProgress(0);
        setUploadState("idle");
        setError("");
        if (inputRef.current) inputRef.current.value = "";
        onClear?.();
    };

    const handleFile = async (file: File) => {
        setError("");

        const preview = uploadService.createPreview(file, (msg) => {
            setError(msg);
        });
        if (!preview) return;

        uploadService.revokePreview(previewUrl);
        setPreviewUrl(preview);
        setFileName(file.name);
        setUploadState("uploading");
        setProgress(0);
        onUploadStart?.();

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const result = await uploadService.upload(file, "companies", {
                onProgress: setProgress,
                signal:     controller.signal,
            });

            setUploadState("done");
            setProgress(100);

            onUploadDone?.({
                file,
                previewUrl: preview,
                uploadedUrl: result.url,
                publicId:    result.publicId,
            });
        } catch (err: unknown) {
            if ((err as { name?: string }).name === "CanceledError" || 
                (err as { name?: string }).name === "AbortError") {
                clearAll();
                return;
            }
            setUploadState("error");
            const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
            setError(msg);
        }
    };

    const pick = () => inputRef.current?.click();

    const displayError = error || externalError;

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm text-white">
                Logo{required && <span className="ml-1 text-red-400">*</span>}
            </label>

            <input
                id={id}
                ref={inputRef}
                type="file"
                accept={UPLOAD_CONSTRAINTS.acceptedExts}
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    if (f) handleFile(f);
                }}
            />

            {previewUrl ? (
                <div
                    className={[
                        "w-full rounded-xl px-4 py-3",
                        "bg-white/10 backdrop-blur-sm border",
                        uploadState === "error"
                            ? "border-red-400/60"
                            : uploadState === "done"
                            ? "border-green-400/60"
                            : "border-white/20",
                        "flex items-center gap-4",
                    ].join(" ")}
                >
                    <Image
                        src={previewUrl}
                        alt="Logo preview"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover shrink-0 border border-white/20"
                        unoptimized
                    />

                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{fileName}</p>

                        {uploadState === "uploading" && (
                            <div className="mt-1.5">
                                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-orange-400 transition-all duration-200"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-white/50">{progress}%</p>
                            </div>
                        )}

                        {uploadState === "done" && (
                            <p className="mt-0.5 text-xs text-green-400">
                                ✓ Uploaded successfully
                            </p>
                        )}

                        {uploadState === "error" && (
                            <p className="mt-0.5 text-xs text-red-400">
                                Upload failed — tap to retry
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Retry on error */}
                        {uploadState === "error" && (
                            <button
                                type="button"
                                onClick={pick}
                                className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                                title="Choose a different file"
                            >
                                Retry
                            </button>
                        )}

                        {/* Change while uploading / done */}
                        {(uploadState === "done" || uploadState === "uploading") && (
                            <button
                                type="button"
                                onClick={uploadState === "uploading" ? clearAll : pick}
                                className="text-xs text-white/50 hover:text-white/80 transition-colors"
                                title={uploadState === "uploading" ? "Cancel" : "Change image"}
                            >
                                {uploadState === "uploading" ? "Cancel" : "Change"}
                            </button>
                        )}

                        {/* Clear */}
                        <button
                            type="button"
                            onClick={clearAll}
                            aria-label="Remove logo"
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : (

                <button
                    type="button"
                    onClick={pick}
                    className={[
                        "w-full rounded-xl px-6 py-4",
                        "bg-white/10 backdrop-blur-sm border",
                        displayError ? "border-red-400/60" : "border-white/20",
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
                    <span className="font-medium text-white">{label}</span>
                    <span className="text-xs text-white/40">
                        (JPEG, PNG, WebP — max {UPLOAD_CONSTRAINTS.maxSizeMB} MB)
                    </span>
                </button>
            )}


            {displayError && (
                <p className="text-sm text-red-400 mt-1" role="alert">
                    {displayError}
                </p>
            )}
        </div>
    );
}