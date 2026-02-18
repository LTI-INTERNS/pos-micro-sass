import React, { ReactNode } from 'react';

interface GlassCardProps {
  icon?: ReactNode;
  title?: string;
  description: string;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  icon,
  title,
  description,
  className = '',
}) => {
  return (
    <div
      className={`
        group relative w-full max-w-[265px] h-[238px] 
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-6 gap-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-[55px] h-[55px] text-white">
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h3 className="text-xl font-medium text-white leading-[30px]">
            {title}
          </h3>
          <p className="text-base font-light text-white/90 leading-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlassCard;