"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../common/Navbar";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type NavigationProps = {
  links?: {
    label: string;
    href: string;
  }[];

  onSignIn?: () => void;
  onSignUp?: () => void;

  logoSrc?: string;
  logoAlt?: string;
};

export default function Navigation({
  links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Growth", href: "#growth" },
    { label: "Testimonials", href: "#testimonials" },
  ],
  onSignIn,
  onSignUp,
  logoSrc,
  logoAlt,
}: NavigationProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <Navbar
      logoSrc={logoSrc}
      logoAlt={logoAlt}
      middleContent={
        <>
          {links.map((link, index) => {
            const isActive =
              hoveredLink === link.href ||
              link.href === activeHash ||
              link.href === pathname;

            return (
              <Link
                key={index}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setActiveHash(link.href)}
                className={`
                  relative px-6 py-3 transition-all duration-300
                  ${
                    isActive
                      ? "text-white font-semibold rounded-b-3xl border-b-2 border-orange-500"
                      : "text-white/80 hover:text-white"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </>
      }
      rightContent={
        <div className="flex items-center gap-3">
          <ActionButton
            label="Sign In"
            onClick={onSignIn}
            variant="outline"
            fullWidth={false}
            className="px-5 !bg-transparent"
          />

          <ActionButton
            label="Sign Up"
            onClick={onSignUp}
            variant="primary"
            fullWidth={false}
            className="px-5"
          />
        </div>
      }
    />
  );
}