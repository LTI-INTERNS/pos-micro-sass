import React from 'react';
import GlassCard from './Glasscard';
import { Zap, Cloud, BarChart3, Target } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Zap size={40} strokeWidth={2.5} />,
      title: 'All-in-One Platform',
      description: 'Sales, inventory, customers, and reports—fully integrated.',
    },
    {
      icon: <Cloud size={40} strokeWidth={2.5} />,
      title: 'Cloud-Based & Secure',
      description: 'Access your business data anytime, from any device.',
    },
    {
      icon: <BarChart3 size={40} strokeWidth={2.5} />,
      title: 'Built to Scale',
      description: 'Flexible plans that grow with your business.',
    },
    {
      icon: <Target size={40} strokeWidth={2.5} />,
      title: 'Simple & Intuitive',
      description: 'Designed for cashiers and owners, no training required.',
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          // style={{
          //   backgroundImage: "url('/saas/saasbg.png')",
          // }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 mb-16 max-w-[1307px] mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center leading-tight pt-15">
            Simplifying Business Operations with Smart POS Solutions
          </h2>
          <p className="text-base md:text-sm font-normal text-white/90 text-center max-w-[1000px] leading-relaxed pt-10">
            Small and medium businesses often struggle with disconnected systems for sales, inventory, and customer
            management. Our cloud-based POS platform brings everything together in one simple, secure, and scalable
            solution—designed to grow with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-[1442px] mx-auto px-4 lg:px-[120px]">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <GlassCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;