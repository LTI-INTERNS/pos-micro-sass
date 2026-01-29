"use client";

import { useEffect, useState } from "react";

type ClockVariant = "landing" | "navbar";

type ClockProps = {
  variant?: ClockVariant;
};

export default function Clock({ variant = "landing" }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  /* ---------- LANDING PAGE FORMAT ---------- */
  if (variant === "landing") {
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const ampm = now
      .toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      })
      .slice(-2);

    const date = now.toLocaleDateString([], {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return (
      <div className="text-center text-white">
        <div className="flex items-end justify-center gap-2">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin tracking-wide">
            {time.replace(` ${ampm}`, "")}
          </h1>

          <span className="mb-3 text-2xl md:text-3xl lg:text-4xl font-thin tracking-wider">
            {ampm}
          </span>
        </div>

        <p className="mt-2 text-sm md:text-base">{date}</p>
      </div>
    );
  }

  /* ---------- NAVBAR FORMAT ---------- */
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <span className="hidden sm:inline bg-gray-100 px-4 py-1 rounded-full text-[13px] font-bold text-gray-600">
      {`${time} ${date}`}
    </span>
  );
}
