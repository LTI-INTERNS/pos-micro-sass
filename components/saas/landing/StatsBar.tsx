"use client";

import Image from "next/image";

type StatItem = {
  value: string;
  label: string;
};

const STATS: StatItem[] = [
  { value: "200+", label: "ACTIVE USERS" },
  { value: "50+", label: "COMPANIES" },
  { value: "LKR 10M+", label: "MONTHLY TRANSACTIONS" },
  { value: "98%", label: "CLIENT SATISFACTION" },
];

export default function StatsBar() {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden border border-white/20 min-h-[100px] [@media(min-width:2560px)]:min-h-[180px]">
        {/* Background Image */}
        <Image
          src="/saas/landing/saas-landing-stat.png"
          alt="Stats background"
          fill
          className="object-cover object-center"
          priority={false}
        />

        {/* Glass Layer */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/1 border border-white/10" />
        <div className="absolute inset-0 bg-cover bg-center" />

        {/* Content */}
        <div
          className="
            relative py-5 px-4 sm:px-12 lg:px-28
            [@media(min-width:2560px)]:py-16
            [@media(min-width:2560px)]:px-48
          "
        >
          <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="
                    text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl font-extrabold text-white drop-shadow
                    [@media(min-width:2560px)]:text-5xl
                  "
                >
                  {stat.value}
                </div>
                <div
                  className="
                    mt-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[12px] xl:text-[13px] font-semibold tracking-[0.12em] text-white/80 drop-shadow
                    [@media(min-width:2560px)]:text-2xl
                    [@media(min-width:2560px)]:mt-4
                    [@media(min-width:2560px)]:tracking-[0.2em]
                  "
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom inner shadow */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-30px_60px_rgba(0,0,0,0.25)]" />
      </div>
    </section>
  );
}