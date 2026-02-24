"use client";

import Image from "next/image";
import React from "react";

type FeatureRowCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureRowCard({
  icon,
  title,
  description,
}: FeatureRowCardProps) {
  return (
    <div className="flex items-start gap-4">
      <Image src={icon} alt={title} width={26} height={26} />
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}
