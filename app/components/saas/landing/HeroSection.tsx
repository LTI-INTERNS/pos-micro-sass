"use client";

import Image from "next/image";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {

    const router = useRouter();

  return (
    <section className="relative isolate overflow-hidden min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/saas/landing/saas-landing.png"
          alt="SaaS landing background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 " />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/10" />

      {/* Content */}
      <div className="w-full px-10 lg:px-24 py-28">
        <div className="grid items-center lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold leading-tight text-white">
              All-in-One POS &amp;
              <br />
              Business Management Platform
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Manage sales, inventory, customers, and reports with a modern
              cloud-based POS built for growing businesses
            </p>

            <div className="mt-8 w-64">
              <PrimaryButton className="cursor-pointer" onClick={() => router.push("/saaslogin")}>
                Get Start
              </PrimaryButton>
            </div>

            <Link
              href="/login"
              className="mt-8 inline-block text-sm text-white/60 hover:text-white hover:underline"
            >
              Staff login
            </Link>
          </div>

          <div className="lg:col-span-6" />
        </div>
      </div>
    </section>
  );
}
