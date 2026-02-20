"use client";

import React, { useRef, useState } from "react";
import { Upload, Check } from "lucide-react";
import { useImage } from "@/app/context/ImageContext";

const PRESET_IMAGES = [
  { id: "bg1", url: "/backgrounds/mount.png", label: "Background 1" },
  { id: "bg2", url: "/backgrounds/forest.jpg", label: "Background 2" },
  { id: "bg3", url: "/backgrounds/valley.jpg", label: "Background 3" },
  { id: "bg4", url: "/backgrounds/city.jpg", label: "Background 4" },
  { id: "bg5", url: "/backgrounds/beach.jpg", label: "Background 5" },
];

const DEFAULT_IMAGE_ID = "bg1";
const DEFAULT_IMAGE_URL = "/backgrounds/mount.png"; 

type SystemImageSectionProps = {
  currentImageId: string | null;
  customImageUrl: string | null;
  onImageChange: (imageId: string | null, imageUrl: string) => void;
};

export default function SystemImageSection({
  currentImageId,
  customImageUrl,
  onImageChange,
}: SystemImageSectionProps) {
  const { setBackgroundImage, backgroundImage } = useImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialSelectedId = (): string | null => {
    if (currentImageId) return currentImageId;
    const matched = PRESET_IMAGES.find((img) => img.url === backgroundImage);
    if (matched) return matched.id;
    if (backgroundImage && backgroundImage !== DEFAULT_IMAGE_URL) return "custom";
    return DEFAULT_IMAGE_ID;
  };

  const [selectedId, setSelectedId] = useState<string | null>(getInitialSelectedId);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    backgroundImage &&
    !PRESET_IMAGES.find((img) => img.url === backgroundImage) &&
    backgroundImage !== DEFAULT_IMAGE_URL
      ? backgroundImage
      : customImageUrl
  );

  const handleSelect = (id: string, url: string) => {
    setSelectedId(id);
    setUploadedUrl(null);
    onImageChange(id, url);
    setBackgroundImage(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setUploadedUrl(url);
      setSelectedId("custom");
      onImageChange("custom", url);
      setBackgroundImage(url);
    };
    reader.readAsDataURL(file);
  };

  const isSelected = (id: string) => selectedId === id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        System Background Image
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose a background image for your POS system display.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESET_IMAGES.map((img) => {
          const selected = isSelected(img.id);
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => handleSelect(img.id, img.url)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-video border-2 transition-all duration-200 focus:outline-none
                ${selected
                  ? "border-orange-500 opacity-100 ring-2 ring-orange-200"
                  : "border-gray-200 opacity-40 hover:opacity-100 hover:border-gray-400"
                }`}
            >
              <img src={img.url} alt={img.label} className="w-full h-full object-cover" />

              {selected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <span className="text-white text-[10px] font-medium">{img.label}</span>
              </div>
            </button>
          );
        })}

        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-video border-2 border-dashed
                transition-all duration-200 focus:outline-none flex items-center justify-center
                ${
                isSelected("custom")
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                    : "border-orange-400 bg-orange-50/60 hover:bg-orange-50 hover:border-orange-500"
                }`}
            >
            {uploadedUrl && isSelected("custom") ? (
                <>
                <img
                    src={uploadedUrl}
                    alt="Custom background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-orange-500">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-3 h-3" />
                </div>

                <span className="text-xs font-semibold tracking-wide">
                    Upload Image
                </span>

                <span className="text-[10px] text-gray-500">
                    JPG, PNG, WebP
                </span>
                </div>
            )}
            </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}