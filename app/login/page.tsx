"use client";

import React from "react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import GlassBackground from "@/components/saas/common/GlassBackground";
import LoginForm from "@/components/Landing/Auth/LoginForm";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function LoginPage() {
  const router = useRouter();

  return (
    <CommonLayout navbar={<Navigation
          title="Welcome to POS System"
          showLogout={false}
          rightContent={
            <ActionButton
              label="Home"
              onClick={() => router.push("/")} 
              variant="primary"
              fullWidth={false}
              className="px-5"
            />
          }
        />} >
      <div className="pt-12 pb-20 px-4">
        <GlassBackground className="max-w-md mx-auto px-6 md:px-10 py-12">
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Log In
            </h1>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </GlassBackground>
      </div>
    </CommonLayout>
  );
}
