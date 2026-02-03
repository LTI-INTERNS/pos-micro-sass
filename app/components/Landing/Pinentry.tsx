"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Cashier = {
  name: string;
  img: string;
};

export default function PinEntryPage() {
  const router = useRouter();

  const [pin, setPin] = useState<string>("");
  const [cashier, setCashier] = useState<Cashier | null>(null);

  
  const CASHIER_TIMEOUT_MS = 2 * 60 * 1000; 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  
  const resetCashierTimeout = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      sessionStorage.removeItem("cashier");
      router.replace("/switchuser");
    }, CASHIER_TIMEOUT_MS);
  };

  
  useEffect(() => {
    const stored = sessionStorage.getItem("cashier");

    if (!stored) {
      router.replace("/switchuser");
      return;
    }

    setCashier(JSON.parse(stored));
    resetCashierTimeout();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    
  }, []);

  
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handler = () => resetCashierTimeout();

    events.forEach((event) => window.addEventListener(event, handler));
    return () => events.forEach((event) => window.removeEventListener(event, handler));
   
  }, []);

  
  const handleNumber = (num: number) => {
    resetCashierTimeout();

    
    if (pin.length >= 4) return;

    setPin((prev) => prev + num.toString());
  };

  const clearPin = () => {
    resetCashierTimeout();
    setPin("");
  };

  const backspace = () => {
    resetCashierTimeout();
    setPin((prev) => prev.slice(0, -1));
  };

  const goBack = () => {
    sessionStorage.removeItem("cashier");
    router.push("/switchuser");
  };

  
  const pinDots = "●".repeat(pin.length);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/landing.png')" }}
    >
     
      <button
        onClick={goBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="p-8 w-[320px] text-center rounded-2xl bg-black/10 backdrop-blur-md border border-white/20">
        
        {cashier && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={cashier.img}
              alt={cashier.name}
              className="w-16 h-16 rounded-full border border-white/30 object-cover"
            />
            <p className="mt-3 text-sm text-white/70">Cashier</p>
            <h2 className="text-lg font-semibold text-white">{cashier.name}</h2>
          </div>
        )}

       
        <div className="w-full mb-10 text-center">
          <div
            className="
              w-full py-3
              text-white text-2xl tracking-[0.35em]
              bg-transparent
              border-b border-white/30
              select-none
            "
          >
            {pin.length === 0 ? (
              <span className="text-white/60 text-base tracking-normal">
                Enter your PIN
              </span>
            ) : (
              pinDots
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
            >
              {num}
            </button>
          ))}

          <button
            onClick={clearPin}
            className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
          >
            C
          </button>

          <button
            onClick={() => handleNumber(0)}
            className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
          >
            0
          </button>

          <button
            onClick={backspace}
            className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30"
          >
            <img src="/backspace.png" alt="Backspace" className="w-6 h-6 mx-auto" />
          </button>
        </div>

        <button
          disabled={pin.length !== 4}
          className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
