"use client";

import React from "react";
import { Check, X } from "lucide-react";

export type FeatureItem = {
  label: string;
  available: boolean;
};

type BaseCardProps = {
  title?: string;
  icon?: React.ReactNode;
  price?: string;
  features?: FeatureItem[];
  showButton?: boolean;
  buttonLabel?: string;
  onClick?: () => void;
  children?: React.ReactNode; 
};

export default function BaseCard({
  title,
  icon,
  price,
  features = [],
  showButton = false,
  buttonLabel = "Select",
  onClick,
  children,
}: BaseCardProps) {
  return (
    <div className="w-full rounded-2xl border border-orange-400 shadow-lg overflow-hidden bg-white/10 backdrop-blur-lg">

     
      <div className="bg-linear-to-b from-orange-500 to-orange-400 text-white text-center py-10 relative rounded-b-2xl">
        {icon && <div className="flex justify-center ">{icon}</div>}
        {title && <h2 className="text-xl font-bold">{title}</h2>}

        
        {price && (
          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 bg-gray-200 text-orange-500 px-15 py-4 rounded-xl shadow-md text-xl font-bold z-10">
            {price}
          </div>
        )}
      </div>

      
      <div className=" pt-10 pb-6 px-6">

       
        {children}

        
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 border-b pb-2">
              {f.available ? (
                <Check className="text-white-500 border bg-orange-400 rounded-full" size={14} />
              ) : (
                <X className="text-white-500 border bg-red-500 rounded-full" size={14} />
              )}
              <span className="text-sm text-white">{f.label}</span>
            </div>
          ))}
        </div>

       
        {showButton && (
          <button
            onClick={onClick}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-semibold transition "
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
