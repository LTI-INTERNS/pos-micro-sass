"use client";

import React, { useEffect, useState } from "react";
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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#995518]/70 backdrop-blur-md supports-[backdrop-filter]:bg-[#995518]/20">
        {/* Responsive padding wrapper (keeps team requirement feel on large screens, but adapts on small screens) */}
        <div className="px-4 sm:px-6 lg:px-10 xl:px-28 py-4 sm:py-5 xl:py-6">
          {/* relative container */}
          <div className="relative w-full flex items-center">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden text-white"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>

              <Image
                src={logoSrc}
                alt={logoAlt}
                width={180}
                height={40}
                className="h-9 sm:h-10 w-auto object-contain"
                priority
              />
            </div>

            {/* MIDDLE (desktop only) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 text-white font-semibold text-sm lg:text-base whitespace-nowrap">
              {middleContent}
            </div>

            {/* RIGHT (desktop only) */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              {rightContent}
            </div>
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

          <div className="relative mr-auto w-72 max-w-[85vw] h-full backdrop-blur-lg bg-white/5 border-r border-white/20 shadow-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-white font-semibold">
              {middleContent}
            </div>

            <div className="flex flex-col items-center gap-3 mt-4">
              {rightContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}