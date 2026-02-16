"use client";

import Image from "next/image";
import React from "react";

type AboutCardProps = {
  icon?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function AboutCard({
  icon,
  title,
  description,
  children,
  className = "",
}: AboutCardProps) {
  return (
    <div
      className={`relative rounded-2xl backdrop-blur-md bg-black/30 border border-orange-400/50 p-6 shadow-lg ${className}`}
    >

      {icon && (
          <Image src={icon} alt="icon" width={61} height={71} />
      )}

      {title && (
        <h3 className="text-white font-semibold text-lg mb-2 mt-5">{title}</h3>
      )}

      {description && (
        <p className="text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}
