"use client";

import { CloudLightning, BarChart3, Box, UserCheck } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function GrowthSection() {
  return (
    <section className="text-white">
      {/* ================= TOP SECTION  ================= */}
      <div className="relative">
        <div className="absolute inset-0 bg-cover bg-center" />

        {/* ✅ Full width (no max-w / no mx-auto) but keep px-28 on 4K */}
        <div className="relative w-full px-6 lg:px-28 2xl:px-28 py-20 2xl:py-28">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold mb-4 2xl:mb-6">
              Grow Your Business with Smart POS Technology
            </h3>

            <p className="text-gray-300 mb-10 2xl:mb-14 max-w-2xl 2xl:max-w-4xl mx-auto text-sm sm:text-base lg:text-lg 2xl:text-xl leading-relaxed">
              Improve efficiency, reduce manual work, and make smarter decisions
              with real-time business insights.
            </p>

            <div className="flex flex-wrap justify-center gap-6 2xl:gap-8">
              <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:scale-105">
                <StatCard text="Reduce Billing Time by 40%" />
              </div>
              <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:scale-105">
                <StatCard text="Increase Sales Visibility" />
              </div>
              <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:scale-105">
                <StatCard text="Reduce Inventory Loss" />
              </div>
              <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:scale-105">
                <StatCard text="Better Profit Tracking" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION  ================= */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/saas/landing/growthbottom.png')] bg-cover bg-center" />

        {/* ✅ Full width (no max-w / no mx-auto) but keep px-28 on 4K */}
        <div className="relative w-full px-6 lg:px-28 2xl:px-28 py-20 2xl:py-28">
          <div className="grid md:grid-cols-2 gap-10 2xl:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold mb-6 2xl:mb-8">
                Growth Benefits
              </h2>

              <p className="text-gray-200 leading-relaxed text-sm sm:text-base lg:text-lg 2xl:text-xl">
                Small and medium businesses often struggle with disconnected
                systems for sales, inventory, and customer management. Our
                cloud-based POS platform brings everything together in one simple,
                secure, and scalable solution—designed to grow with your business.
                <br />
                <br />
                Small and medium businesses often struggle with disconnected
                systems for sales, inventory, and customer management. Our
                cloud-based POS platform brings everything together in one simple,
                secure, and scalable solution—designed to grow with your business.
              </p>
            </div>

            <div className="space-y-5 2xl:space-y-7">
              <FeatureCard
                icon={
                  <CloudLightning className="w-6 h-6 lg:w-7 lg:h-7 2xl:w-9 2xl:h-9" />
                }
                label="Faster Checkout"
                className="hover:cursor-pointer"
              />
              <FeatureCard
                icon={
                  <BarChart3 className="w-6 h-6 lg:w-7 lg:h-7 2xl:w-9 2xl:h-9" />
                }
                label="Data-Driven Decisions"
                className="hover:cursor-pointer"
              />
              <FeatureCard
                icon={<Box className="w-6 h-6 lg:w-7 lg:h-7 2xl:w-9 2xl:h-9" />}
                label="Smart Inventory"
                className="hover:cursor-pointer"
              />
              <FeatureCard
                icon={
                  <UserCheck className="w-6 h-6 lg:w-7 lg:h-7 2xl:w-9 2xl:h-9" />
                }
                label="Better Customer Retention"
                className="hover:cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TYPES ================= */

type StatCardProps = {
  text: string;
  className?: string;
};

function StatCard({ text, className = "" }: StatCardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-orange-400/60 bg-black/40 backdrop-blur hover:bg-orange-500/10 transition",
        // ✅ fixed consistent height across cards
        "h-20 lg:h-24 2xl:h-28",
        // ✅ padding + center content
        "px-8 lg:px-10 2xl:px-12",
        "flex items-center justify-center text-center",
        className,
      ].join(" ")}
    >
      <span className="font-medium text-base lg:text-lg 2xl:text-xl leading-snug">
        {text}
      </span>
    </div>
  );
}