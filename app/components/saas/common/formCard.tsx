"use client";

import React from "react";

type CardVariant = "glass" | "gradient" | "solid" | "image";
type CardPadding = "sm" | "md" | "lg";
type CardElevation = "sm" | "md" | "lg";
type CardRadius = "lg" | "xl" | "2xl" | "full";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;

  variant?: CardVariant;
  padding?: CardPadding;
  elevation?: CardElevation;
  radius?: CardRadius;

 
  backgroundImage?: string;
  overlayOpacity?: number; // 0 - 1
  blur?: boolean;
};

export default function Card({
  title,
  children,
  className = "",
  variant = "glass",
  padding = "md",
  elevation = "md",
  radius = "2xl",
  backgroundImage,
  overlayOpacity = 0.4,
  blur = true,
}: CardProps) {
  const base = "relative overflow-hidden";

  const paddings: Record<CardPadding, string> = {
    sm: "p-5",
    md: "p-8",
    lg: "p-10",
  };

  const elevations: Record<CardElevation, string> = {
    sm: "shadow-md",
    md: "shadow-xl",
    lg: "shadow-2xl",
  };

  const radiuses: Record<CardRadius, string> = {
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const variants: Record<CardVariant, string> = {
    glass: [
      "bg-white/10 backdrop-blur-md",
      "border border-white/15",
      "text-white",
    ].join(" "),

    gradient: [
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "text-white",
    ].join(" "),

    solid: [
      "bg-white",
      "border border-gray-200",
      "text-black",
    ].join(" "),

    image: "text-white",
  };

  return (
    <div
      className={[
        base,
        radiuses[radius],
        paddings[padding],
        elevations[elevation],
        variants[variant],
        className,
      ].join(" ")}
      style={
        variant === "image" && backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/*Image Overlay */}
      {variant === "image" && (
        <div
          className={["absolute inset-0", blur ? "backdrop-blur-md" : ""].join(
            " "
          )}
          style={{
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          }}
        />
      )}

      {/* subtle highlight for glass */}
      {variant === "glass" && (
        <div className="pointer-events-none absolute inset-0 bg-white/5" />
      )}

      <div className="relative z-10">
        {title && (
          <h2
            className={[
              "font-semibold mb-6 text-xl",
              variant === "solid" ? "text-black" : "text-white",
            ].join(" ")}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}
