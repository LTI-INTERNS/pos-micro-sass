"use client";

import { ReactNode } from "react";
import { CloudLightning, BarChart3, Box, UserCheck } from "lucide-react";

export default function GrowthSection() {
  return (
    <section className="relative text-white">
      
      <div className="absolute inset-0 bg-linear-to-b from-[#2b0c05]/90 to-[#0b0b0b]/95" />

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        
        <div className="text-center ">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Grow Your Business with Smart POS Technology
          </h3>

          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            Improve efficiency, reduce manual work, and make smarter decisions
            with real-time business insights.
          </p>

         
          <div className="flex flex-wrap justify-center gap-6">
            <StatCard text="Reduce Billing Time by 40%" />
            <StatCard text="Increase Sales Visibility" />
            <StatCard text="Reduce Inventory Loss" />
            <StatCard text="Better Profit Tracking" />
          </div>
        </div>
        
        
        <div className="grid md:grid-cols-2 gap-10 items-center mt-20">
          
          
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
            <BenefitCard icon={<CloudLightning size={22} />} text="Faster Checkout" />
            <BenefitCard icon={<BarChart3 size={22} />} text="Data-Driven Decisions" />
            <BenefitCard icon={<Box size={22} />} text="Smart Inventory" />
            <BenefitCard icon={<UserCheck size={22} />} text="Better Customer Retention" />
          </div>
        </div>

        
      </div>
    </section>
  );
}



type BenefitCardProps = {
  icon: ReactNode;
  text: string;
};

type StatCardProps = {
  text: string;
};



function BenefitCard({ icon, text }: BenefitCardProps) {
  return (
    <div className="flex items-center gap-4 border border-orange-400/60 rounded-xl px-6 py-4 bg-white/5 backdrop-blur hover:bg-white/10 transition">
      <div className="text-orange-400">{icon}</div>
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}

function StatCard({ text }: StatCardProps) {
  return (
    <div className="px-8 py-4 rounded-xl border border-orange-400/60 bg-black/40 backdrop-blur hover:bg-orange-500/10 transition">
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}
