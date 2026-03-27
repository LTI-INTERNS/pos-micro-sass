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
};

export default function Navigation({
  title = "Micro-Saas Registration Dashboard",
  logoSrc,
  logoAlt,
}: NavigationProps) {
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
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="primary"
            fullWidth={false}
            className="px-5"
          />
        </div>
      }
    />
  );
}