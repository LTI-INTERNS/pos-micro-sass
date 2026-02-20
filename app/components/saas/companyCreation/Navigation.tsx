"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "../common/Navbar";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type NavigationProps = {
  title?: string; 
  links?: {
    label: string;
    href: string;
  }[];
  onSignUp?: () => void;
  logoSrc?: string;
  logoAlt?: string;
};

export default function Navigation({
  title = "Micro-Saas Registration Dashboard", 
  logoSrc,
  logoAlt,
}: NavigationProps) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");
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
      middleContent={
        <h2>{title}</h2> 
      }
      rightContent={
        <div className="flex items-center gap-3">
          <ActionButton
            label="Log Out"
            onClick={() => router.push("/saaslogin")}
            variant="primary"
            fullWidth={false}
            className="px-5"
          />
        </div>
      }
    />
  );
}
