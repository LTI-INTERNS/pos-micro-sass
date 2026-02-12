"use client";

import React from "react";
import Image from "next/image";

type NavbarProps = {
  middleContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
};

export default function Navbar({
  middleContent,
  rightContent,
  logoSrc = "/logo.png",
  logoAlt = "Logo",
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#995518]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[#995518]/20 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT - LOGO */}
        <div className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={180}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        {/* MIDDLE - DYNAMIC */}
        <div className="hidden md:flex items-center gap-8 text-white font-semibold text-sm">
          {middleContent}
        </div>

        {/* RIGHT - DYNAMIC */}
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      </div>
    </nav>
  );
}
