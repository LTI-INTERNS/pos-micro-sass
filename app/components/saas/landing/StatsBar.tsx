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
      <div className="relative overflow-hidden border border-white/20">
        {/* Background Image */}
        <Image
          src="/saas/landing/saas-landing-stat.png"
          alt="Stats background"
          fill
          className="object-cover object-center"
          priority={false}
        />

        {/* Glass Layer */}
        <div
          className={[
            "absolute inset-0",
            "backdrop-blur-sm",
            "bg-white/1",
            "border border-white/10",
          ].join(" ")}
        />

        {/* Content */}
        <div className="relative px-6 py-10 sm:px-12">
          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-white sm:text-2xl drop-shadow">
                  {stat.value}
                </div>
                <div className="mt-2 text-[15px] font-semibold tracking-[0.18em] text-white/80 drop-shadow">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra depth shadow (bottom inner) */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_-30px_60px_rgba(0,0,0,0.25)]" />
      </div>
    </section>
  );
}
