"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { User } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

type Testimonial = {
  name: string;
  role: string;
  message: string;
  avatar?: string; // Optional, as we use a placeholder icon
};

const testimonials: Testimonial[] = [
  {
    name: "Jhon Doe",
    role: "Manager - ABC Company",
    message:
      "This POS made our daily sales and inventory tracking incredibly simple. We save hours every week.",
    avatar: "https://i.pravatar.cc/150?img=32",  
  },
  {
    name: "Sarah Smith",
    role: "Owner - Retail Store",
    message:
      "The dashboard is clean and easy to use. My staff learned it in one day.",
    avatar: "https://i.pravatar.cc/150?img=12",  
  },
  {
    name: "Michael Brown",
    role: "CEO - Cafe Group",
    message:
      "Inventory management has never been easier. Highly recommended system.",
    avatar: "https://i.pravatar.cc/150?img=5",  
  },
  {
    name: "Emily Johnson",
    role: "Operations Head - Supermarket",
    message: "Reports and analytics help us make smarter decisions daily.",
    avatar: "https://i.pravatar.cc/150?img=42",

  },
  {
    name: "David Lee",
    role: "Founder - Grocery Hub",
    message:
      "The automation features saved us time and reduced manual errors significantly.",
    avatar: "https://i.pravatar.cc/150?img=8",  
  },
];

export default function TestimonialSection() {
  const total = testimonials.length;

  // Track the REAL active index (not duplicated loop indices)
  const [activeReal, setActiveReal] = useState(0);

  const { prevReal, nextReal } = useMemo(() => {
    const prev = (activeReal - 1 + total) % total;
    const next = (activeReal + 1) % total;
    return { prevReal: prev, nextReal: next };
  }, [activeReal, total]);

  const handleInitOrChange = (swiper: SwiperType) => {
    // realIndex works correctly with loop:true
    setActiveReal(swiper.realIndex);
  };

  return (
    <section
      className="relative w-full py-16 sm:py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/saas/landing/testimonial.png')",
      }}
    >
      {/* This clips all non-adjacent slides so only 3 are visible */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-hidden [@media(min-width:2560px)]:max-w-[120rem] [@media(min-width:2560px)]:px-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10 sm:mb-12 md:mb-16 [@media(min-width:2560px)]:text-6xl">
          What Our Clients Say
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          centeredSlides
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          slidesPerView={1.15}
          spaceBetween={-140}
          breakpoints={{
            640: {
              slidesPerView: 1.35,
              spaceBetween: -150,
            },
            768: {
              slidesPerView: 2.05,
              spaceBetween: -170,
            },
            1024: {
              slidesPerView: 2.6,
              spaceBetween: -190,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: -220,
            },
            // 4K tuning (ONLY affects >= 2560px width screens)
            2560: {
              slidesPerView: 3,
              spaceBetween: -340,
            },
          }}
          className="!overflow-visible"
          onSwiper={handleInitOrChange}
          onSlideChange={handleInitOrChange}
        >
          {testimonials.map((item, index) => {
            const isActive = index === activeReal;
            const isPrev = index === prevReal;
            const isNext = index === nextReal;
            const isVisible = isActive || isPrev || isNext;

            // CRITICAL: zIndex on the actual SwiperSlide element
            const slideZIndex = isActive ? 30 : isPrev || isNext ? 20 : 10;

            return (
              <SwiperSlide
                key={index}
                className="!flex !justify-center !relative"
                style={{ zIndex: slideZIndex }}
              >
                <div
                  className={[
                    "relative flex justify-center pb-10 transition-all duration-500",
                    isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative rounded-2xl p-6 sm:p-8 text-left transition-all duration-500",
                      "w-[300px] sm:w-[360px] md:w-[420px] lg:w-[440px]",
                      // 4K: make cards noticeably wider to fill the screen
                      "[@media(min-width:2560px)]:w-[680px]",
                      "h-[200px] [@media(min-width:2560px)]:h-[240px]",
                      isActive
                        ? "scale-110 opacity-100"
                        : isPrev || isNext
                        ? "scale-90 opacity-90"
                        : "scale-90 opacity-0",
                    ].join(" ")}
                    style={{
                      backgroundImage: "url('/saas/landing/t-card.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Glow only for active (center) */}
                    {isActive && (
                      <>
                        <div className="pointer-events-none absolute -left-28 top-0 h-full w-24 bg-gradient-to-r from-orange-600 via-orange-500 to-transparent blur-3xl opacity-100 rounded-full" />
                        <div className="pointer-events-none absolute -right-28 top-0 h-full w-24 bg-gradient-to-l from-orange-600 via-orange-500 to-transparent blur-3xl opacity-100 rounded-full" />
                      </>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center [@media(min-width:2560px)]:w-16 [@media(min-width:2560px)]:h-16">
                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base sm:text-lg [@media(min-width:2560px)]:text-2xl">
                          {item.name}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm [@media(min-width:2560px)]:text-lg">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed [@media(min-width:2560px)]:text-xl">
                      “{item.message}”
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}