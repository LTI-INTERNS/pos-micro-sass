"use client";

import Image from "next/image";
import ActionButton from "@/components/Admin/common/ActionButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="
        relative isolate overflow-hidden min-h-screen
        2xl:min-h-screen
        [@media(min-width:1920px)]:pt-20
        [@media(min-width:2560px)]:min-h-0
        [@media(min-width:2560px)]:py-16
        [@media(min-width:2560px)]:mt-20
      "
    >
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

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/60 to-black/10" />

      {/* Content */}
      <div
        className="
          w-full px-10 lg:px-28 pt-48 pb-20
          [@media(min-width:1024px)]:pt-52
          [@media(min-width:1280px)]:pt-48
          [@media(min-width:1440px)]:pt-80
          [@media(min-width:1536px)]:pt-48
          [@media(min-width:2560px)]:px-48
          [@media(min-width:2560px)]:py-0
        "
      >
        <div className="grid items-center lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1
              className="
                text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold leading-tight text-white
                [@media(min-width:2560px)]:text-[7rem]
                [@media(min-width:2560px)]:leading-tight
              "
            >
              All-in-One POS &amp;
              <br />
              Business Management Platform
            </h1>

            <p
              className="
                mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base
                [@media(min-width:2560px)]:text-3xl
                [@media(min-width:2560px)]:max-w-3xl
                [@media(min-width:2560px)]:mt-10
                [@media(min-width:2560px)]:leading-relaxed
              "
            >
              Manage sales, inventory, customers, and reports with a modern
              cloud-based POS built for growing businesses.
            </p>

            <div
              className="
                mt-6 w-56
                [@media(min-width:2560px)]:w-96
                [@media(min-width:2560px)]:mt-12
                [@media(min-width:2560px)]:text-2xl
              "
            >
              <ActionButton onClick={() => router.push("/saaslogin")}>
                Get Start
              </ActionButton>
            </div>

            <Link
              href="/login"
              className="
                mt-6 inline-block text-xs text-white/60 hover:text-white hover:underline
                [@media(min-width:2560px)]:text-xl
                [@media(min-width:2560px)]:mt-6
              "
            >
              Staff login
            </Link>
          </div>

          {/* Right Empty Column (for future illustration or image) */}
          <div className="lg:col-span-6" />
        </div>
      </div>
    </section>
  );
}