"use client";

import React from "react";
import Navbar from "@/components/saas/common/Navbar";
import ActionButton from "@/components/Admin/common/ActionButton";
import { signOut } from "next-auth/react";

type NavigationProps = {
  title?: string;
  links?: {
    label: string;
    href: string;
  }[];
  onSignUp?: () => void;
  logoSrc?: string;
  logoAlt?: string;
  showLogout?: boolean;
};

export default function Navigation({
  title = "Micro-Saas Registration Dashboard",
  logoSrc,
  logoAlt,
  showLogout = true,
}: NavigationProps) {
  return (
     <Navbar
      logoSrc={logoSrc}
      logoAlt={logoAlt}
      middleContent={<h2>{title}</h2>}
      rightContent={
        showLogout ? ( // 👈 condition here
          <div className="flex items-center gap-3">
            <ActionButton
              label="Log Out"
              onClick={() => router.push("/saaslogin")}
              variant="primary"
              fullWidth={false}
              className="px-5"
            />
          </div>
        ) : null
      }
    />
  );
}