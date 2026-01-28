"use client";

import { useState } from "react";

export default function PinEntryPage() {
  const [pin, setPin] = useState<string>("");

  const handleNumber = (num: number) => {
    
      setPin(pin + num.toString());
    
  };

  const clearPin = () => setPin("");
  const backspace = () => setPin(pin.slice(0, -1));

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/landing.png')" }}
    >
      <div className=" p-8 w-[320px] text-center">
        
        <input type="text" className="w-full  mb-10 text-center outline-none " placeholder="Enter your PIN" value={pin} readOnly />
         
        <div className="grid grid-cols-3 gap-x-0 gap-y-4 mb-6 ">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 "
            >
              {num}
            </button>
          ))}

          <button onClick={clearPin} className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30">
            C
          </button>
          <button
            onClick={() => handleNumber(0)}
            className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30"
          >
            0
          </button>
          <button onClick={backspace} className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30">
            <img src="/backspace.png" alt="Backspace" className="w-6 h-6 mx-auto" />
          </button>
        </div>

        <button className="w-full py-1 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold cursor-pointer">
          Unlock
        </button>
      </div>
    </div>
  );
}