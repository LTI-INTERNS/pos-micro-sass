"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

type NavbarProps = {
  middleContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
};

export default function Navbar({
  middleContent,
  rightContent,
  logoSrc = "/saas/logo.png",
  logoAlt = "Logo",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#995518]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[#995518]/20 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT - HAMBURGER + LOGO */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-white"
            >
              <Menu size={24} />
            </button>

            <Image
              src={logoSrc}
              alt={logoAlt}
              width={180}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* MIDDLE - Desktop */}
          <div className="hidden md:flex items-center gap-1 text-white font-semibold text-sm">
            {middleContent}
          </div>

          {/* RIGHT - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {rightContent}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar From LEFT */}
          <div className="relative mr-auto w-72 h-full backdrop-blur-lg bg-white/5 border-r border-white/20 shadow-2xl p-6 flex flex-col gap-6">

            <div className="flex justify-start">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-1 text-white font-semibold">
              {middleContent}
            </div>

            <div className="flex flex-col gap-1 mt-4">
              {rightContent}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
