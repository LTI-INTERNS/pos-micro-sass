"use client";

import { ReactNode } from "react";
import { CloudLightning, BarChart3, Box, UserCheck } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function GrowthSection() {
  return (
    <section className="text-white">

      {/* ================= TOP SECTION  ================= */}
      <div className="relative">
       
        <div className="absolute inset-0  bg-cover bg-center" />
        

        <div className="relative max-w-6xl mx-auto px-6 py-20">

          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Grow Your Business with Smart POS Technology
            </h3>

            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Improve efficiency, reduce manual work, and make smarter decisions
              with real-time business insights.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
  
                <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out
        hover:transform hover:scale-105 ">
                  <StatCard text="Reduce Billing Time by 40%" />
                </div>
                <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out
        hover:transform hover:scale-105">
                  <StatCard text="Increase Sales Visibility" /> 
                </div>
                <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out
        hover:transform hover:scale-105">
                  <StatCard text="Reduce Inventory Loss" />
                </div>

                
                <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:cursor-pointer transition-all duration-300 ease-in-out
        hover:transform hover:scale-105">
                  <StatCard text="Better Profit Tracking"/>
                </div>
            </div>

          </div>

        </div>
      </div>


      {/* ================= BOTTOM SECTION  ================= */}
      <div className="relative">
        
        <div className="absolute inset-0 bg-[url('/saas/landing/growthbottom.png')] bg-cover bg-center" />
        

        <div className="relative max-w-6xl mx-auto px-6 py-20">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            
            <div>
              <h2 className="text-3xl font-bold mb-6">Growth Benefits</h2>

              <p className="text-gray-200 leading-relaxed">
                Small and medium businesses often struggle with disconnected
                systems for sales, inventory, and customer management. Our
                cloud-based POS platform brings everything together in one simple,
                secure, and scalable solution—designed to grow with your business.
                <br /><br />
                Small and medium businesses often struggle with disconnected
                systems for sales, inventory, and customer management. Our
                cloud-based POS platform brings everything together in one simple,
                secure, and scalable solution—designed to grow with your business.
              </p>
            </div>

            
            <div className="space-y-5">
              <FeatureCard key={1} icon={<CloudLightning size={22} />} label="Faster Checkout" className="hover:cursor-pointer" />
              <FeatureCard key={2} icon={<BarChart3 size={22} />} label="Data-Driven Decisions" className="hover:cursor-pointer" />
              <FeatureCard key={3} icon={<Box size={22} />} label="Smart Inventory" className="hover:cursor-pointer" />
              <FeatureCard key={4} icon={<UserCheck size={22} />} label="Better Customer Retention" className="hover:cursor-pointer" />
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
      className={`px-8 py-4 rounded-xl border border-orange-400/60 bg-black/40 backdrop-blur hover:bg-orange-500/10 transition ${className}`}
    >
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}