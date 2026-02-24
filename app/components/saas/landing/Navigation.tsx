"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    { label: "Home",         href: "/saaslanding#home"         },
    { label: "About",        href: "/saaslanding#about"        },
    { label: "Features",     href: "/saaslanding#features"     },
    { label: "Growth",       href: "/saaslanding#growth"       },
    { label: "Testimonials", href: "/saaslanding#testimonials" },
  ],
  logoSrc,
  logoAlt,
}: NavigationProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const router = useRouter();

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
      className="
        [@media(min-width:1920px)]:h-28 [@media(min-width:1920px)]:px-36
        [@media(min-width:2560px)]:h-34 [@media(min-width:2560px)]:px-48
      "
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
                  [@media(min-width:768px)_and_(max-width:1023px)]:px-2
                  [@media(min-width:768px)_and_(max-width:1023px)]:py-1

                  [@media(min-width:1920px)]:px-8
                  [@media(min-width:1920px)]:py-4
                  [@media(min-width:1920px)]:text-xl

                  [@media(min-width:2560px)]:px-10
                  [@media(min-width:2560px)]:py-5
                  [@media(min-width:2560px)]:text-2xl
                  ${
                    isActive
                      ? "text-white font-semibold rounded-b-3xl border-b border-orange-500"
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
        <div className="flex items-center gap-3 [@media(min-width:1920px)]:gap-5 [@media(min-width:2560px)]:gap-6">
          <ActionButton
            label="Sign In"
            onClick={() => router.push("/saaslogin")}
            variant="outline"
            fullWidth={false}
            className="
              px-5 !bg-transparent
              [@media(min-width:768px)_and_(max-width:1023px)]:px-2
              [@media(min-width:768px)_and_(max-width:1023px)]:py-1
              [@media(min-width:768px)_and_(max-width:1023px)]:text-xs

              [@media(min-width:1920px)]:px-8
              [@media(min-width:1920px)]:py-3
              [@media(min-width:1920px)]:text-xl

              [@media(min-width:2560px)]:px-10
              [@media(min-width:2560px)]:py-4
              [@media(min-width:2560px)]:text-2xl
            "
          />

          <ActionButton
            label="Sign Up"
            onClick={() => router.push("/saasregistration")}
            variant="primary"
            fullWidth={false}
            className="
              px-5
              [@media(min-width:768px)_and_(max-width:1023px)]:px-2
              [@media(min-width:768px)_and_(max-width:1023px)]:py-1
              [@media(min-width:768px)_and_(max-width:1023px)]:text-xs

              [@media(min-width:1920px)]:px-8
              [@media(min-width:1920px)]:py-3
              [@media(min-width:1920px)]:text-xl

              [@media(min-width:2560px)]:px-10
              [@media(min-width:2560px)]:py-4
              [@media(min-width:2560px)]:text-2xl
            "
          />
        </div>
      }
    />
  );
}