import React from 'react';
import GlassCard from '@/components/saas/landing/Glasscard';
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
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" />
      </div>

      <section
        className="
          relative z-10 w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 pt-10
          [@media(min-width:2560px)]:gap-16
          [@media(min-width:2560px)]:pt-20
        "
      >
        <h2
          className="
            text-xl sm:text-2xl lg:text-3xl font-semibold text-white text-center leading-tight px-4
            [@media(min-width:2560px)]:text-6xl
            [@media(min-width:2560px)]:leading-snug
            [@media(min-width:2560px)]:px-48
          "
        >
          Simplifying Business Operations with Smart POS Solutions
        </h2>

        <p
          className="
            text-xs sm:text-sm md:text-base font-normal text-white/90 text-center
            max-w-[560px] sm:max-w-[720px] lg:max-w-[1000px]
            leading-relaxed px-6
            [@media(min-width:2560px)]:text-2xl
            [@media(min-width:2560px)]:max-w-[1600px]
            [@media(min-width:2560px)]:px-0
            [@media(min-width:2560px)]:leading-loose
          "
        >
          Small and medium businesses often struggle with disconnected systems for sales, inventory, and customer
          management. Our cloud-based POS platform brings everything together in one simple, secure, and scalable
          solution—designed to grow with your business.
        </p>

        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full px-6 sm:px-12 lg:px-28
            [@media(min-width:2560px)]:gap-12
            [@media(min-width:2560px)]:px-48
          "
        >
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <GlassCard
                icon={
                  <span className="[@media(min-width:2560px)]:[&>svg]:w-20 [@media(min-width:2560px)]:[&>svg]:h-20">
                    {feature.icon}
                  </span>
                }
                title={feature.title}
                description={feature.description}
                className="[@media(min-width:2560px)]:p-10"
                titleClassName="[@media(min-width:2560px)]:text-3xl"
                descriptionClassName="[@media(min-width:2560px)]:text-xl"
              />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default About;