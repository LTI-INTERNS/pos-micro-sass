import React, { ReactNode } from 'react';

interface GlassCardProps {
  icon?: ReactNode;
  title?: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  icon,
  title,
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
}) => {
  return (
    <div
      className={`
        group relative w-full max-w-[320px] sm:max-w-[265px] h-[200px] sm:h-[210px] md:h-[220px] lg:h-[238px]
        [@media(min-width:2560px)]:max-w-none
        [@media(min-width:2560px)]:h-[520px]
        rounded-3xl overflow-hidden
        backdrop-blur-md bg-white/1
        border border-white/20
        hover:bg-white/5 hover:border-white/10
        transition-all duration-300 ease-in-out
        hover:transform hover:scale-105
        ${className}
      `}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 py-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Icon */}
        <div
          className={`
            flex items-center justify-center text-white
            w-[36px] h-[36px]
            sm:w-[42px] sm:h-[42px]
            md:w-[48px] md:h-[48px]
            lg:w-[55px] lg:h-[55px]
            [&>svg]:w-[28px] [&>svg]:h-[28px]
            sm:[&>svg]:w-[34px] sm:[&>svg]:h-[34px]
            md:[&>svg]:w-[38px] md:[&>svg]:h-[38px]
            lg:[&>svg]:w-[40px] lg:[&>svg]:h-[40px]
            [@media(min-width:2560px)]:w-[110px]
            [@media(min-width:2560px)]:h-[110px]
            [@media(min-width:2560px)]:[&>svg]:w-24
            [@media(min-width:2560px)]:[&>svg]:h-24
            ${iconClassName}
          `}
        >
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 [@media(min-width:2560px)]:gap-6 text-center">
          <h3
            className={`
              text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white leading-tight
              [@media(min-width:2560px)]:text-2xl
              [@media(min-width:2560px)]:leading-snug
              ${titleClassName}
            `}
          >
            {title}
          </h3>
          <p
            className={`
              text-xs sm:text-sm md:text-sm lg:text-base font-light text-white/90 leading-5 sm:leading-6
              [@media(min-width:2560px)]:text-lg
              [@media(min-width:2560px)]:leading-8
              ${descriptionClassName}
            `}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;