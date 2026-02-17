"use client";

import React from "react";
import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/landing/Navigation";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import LoginForm from "@/app/components/Landing/Auth/LoginForm";

export default function LoginPage() {
  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="pt-12 pb-20 px-4">
        <GlassBackground className="max-w-md mx-auto px-6 md:px-10 py-12">
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm md:text-base text-center">
              Sign in to manage your POS system
            </p>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </GlassBackground>
      </div>
    </CommonLayout>
  );
}
