"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ImageContextType = {
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
};

const DEFAULT_IMAGE = "/backgrounds/mount.png";

const ImageContext = createContext<ImageContextType>({
  backgroundImage: DEFAULT_IMAGE,
  setBackgroundImage: () => {},
});

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [backgroundImage, setBackgroundImageState] = useState(DEFAULT_IMAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app_background_image");
    if (saved) setBackgroundImageState(saved);
    setMounted(true); 
  }, []);

  const setBackgroundImage = (url: string) => {
    setBackgroundImageState(url);
    localStorage.setItem("app_background_image", url);
  };

  if (!mounted) return null;

  return (
    <ImageContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImage = () => useContext(ImageContext);