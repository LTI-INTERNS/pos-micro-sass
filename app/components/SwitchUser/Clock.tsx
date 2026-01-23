"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  
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
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin tracking-wide font-sans">
          {time.replace(` ${ampm}`, "")}
        </h1>


        
        <span className="mb-3 text-2xl md:text-3xl lg:text-4xl font-thin tracking-wider font-sans">
          {ampm}
        </span>
      </div>


      
      <p className="mt-2 text-sm md:text-base">
        {date}
      </p>
    </div>
  );
}