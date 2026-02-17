"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { User } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

type Testimonial = {
  name: string;
  role: string;
  message: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Jhon Doe",
    role: "Manager - ABC Company",
    message:
      "This POS made our daily sales and inventory tracking incredibly simple. We save hours every week.",
  },
  {
    name: "Sarah Smith",
    role: "Owner - Retail Store",
    message:
      "The dashboard is clean and easy to use. My staff learned it in one day.",
  },
  {
    name: "Michael Brown",
    role: "CEO - Cafe Group",
    message:
      "Inventory management has never been easier. Highly recommended system.",
  },
  {
    name: "Emily Johnson",
    role: "Operations Head - Supermarket",
    message:
      "Reports and analytics help us make smarter decisions daily.",
  },
  {
    name: "David Lee",
    role: "Founder - Grocery Hub",
    message:
      "The automation features saved us time and reduced manual errors significantly.",
  },
];

export default function TestimonialSection() {
  return (
    <section
      className="relative w-full py-16 sm:py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/testimonial.png')",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-hidden">

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10 sm:mb-12 md:mb-16">
          What Our Clients Say
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1.99999}
          centeredSlides={true}
          loop={true}
          spaceBetween={-200}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1.3,
              spaceBetween: -130,
            },
            768: {
              slidesPerView: 1.5,
              spaceBetween: -140,
            },
            1024: {
              slidesPerView: 2.2,
              spaceBetween: -180,
            },
            1280: {
              slidesPerView: 2.5,
              spaceBetween: -200,
            },
          }}
          className="!overflow-visible"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              {({ isActive, isPrev, isNext }) => {

                //  Show only active + prev + next
                const isVisible = isActive || isPrev || isNext;

                return (
                  <div
                    className={`relative flex justify-center mb-8 transition-all duration-500 ${
                      isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    
                    <div
                      className={`relative rounded-2xl p-6 sm:p-8 w-full h-[200px]
                      max-w-[85%] sm:max-w-md md:max-w-lg
                      text-left transition-all duration-500
                      ${
                        isActive
                          ? "scale-100 opacity-100 z-20"
                          : "scale-90 opacity-100 z-10"
                      }`}
                      style={{
                        backgroundImage: "url('/t-card.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Glow only for active */}
                      {isActive && (
                        <>
                          <div className="pointer-events-none absolute -left-30 top-0 h-full w-24 bg-gradient-to-r from-orange-600 via-orange-500 to-transparent blur-3xl opacity-100 rounded-full" />
                          <div className="pointer-events-none absolute -right-30 top-0 h-full w-24 bg-gradient-to-l from-orange-600 via-orange-500 to-transparent blur-3xl opacity-100 rounded-full" />
                        </>
                      )}

                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-base sm:text-lg">
                            {item.name}
                          </h3>
                          <p className="text-gray-300 text-xs sm:text-sm">
                            {item.role}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed">
                        “{item.message}”
                      </p>
                    </div>

                  </div>
                );
              }}
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}