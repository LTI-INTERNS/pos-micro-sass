import React from 'react';
import { CheckCheck  } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    'No complex setup',
    'Fast support',
    'Affordable monthly plans',
    'Local business friendly',
  ];

  return (
    <section className="relative w-full py-14 overflow-hidden">

      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/saas/landing/about.png')",
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-[120px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-16 lg:gap-40">
          {/* Left Side - Title */}
          <div className="flex-shrink-0">
            <h2 className="text-[32px] font-semibold text-white leading-tight">
              Why Choose Us?
            </h2>
          </div>

          {/* Right Side - Features List */}
          <div className="flex flex-col gap-11">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 group"
              >
                {/* Check Icon */}
                <div className="flex-shrink-0">
                  <CheckCheck  
                    size={22} 
                    className="text-white group-hover:scale-110 transition-transform duration-200" 
                    strokeWidth={2.5}
                  />
                </div>

                {/* Feature Text */}
                <p className="text-2xl font-normal text-white">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;