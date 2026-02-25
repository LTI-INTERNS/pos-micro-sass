import React from 'react';
import { CheckCheck } from 'lucide-react';

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
      <div
        className="
          relative py-10 sm:px-12 lg:px-28
          [@media(min-width:2560px)]:px-48
          [@media(min-width:2560px)]:py-20
        "
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-40 [@media(min-width:2560px)]:gap-64">

          {/* Left Side - Title */}
          <div className="flex-shrink-0">
            <h2
              className="
                text-[32px] font-semibold text-white leading-tight
                [@media(min-width:2560px)]:text-6xl
              "
            >
              Why Choose Us?
            </h2>
          </div>

          {/* Right Side - Features List */}
          <div className="flex flex-col gap-11 [@media(min-width:2560px)]:gap-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 [@media(min-width:2560px)]:gap-8 group">
                <div className="flex-shrink-0">
                  <CheckCheck
                    size={22}
                    className="
                      text-white group-hover:scale-110 transition-transform duration-200
                      [@media(min-width:2560px)]:w-10
                      [@media(min-width:2560px)]:h-10
                    "
                    strokeWidth={2.5}
                  />
                </div>
                <p
                  className="
                    text-2xl font-normal text-white
                    [@media(min-width:2560px)]:text-4xl
                  "
                >
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