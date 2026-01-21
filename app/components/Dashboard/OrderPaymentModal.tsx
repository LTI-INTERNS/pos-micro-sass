"use client";

import { Delete } from "lucide-react"; // Import Lucide Delete icon

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function OrderPaymentModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      {/* Right panel */}
      <div className="h-full w-[420px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-black leading-none">Order payment</h2>
            <p className="text-sm text-gray-400 mt-1">Order #102</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl leading-none mt-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Amount summary */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tip Amount</span>
              <span className="font-semibold text-black">$ 8.12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-orange-500 font-semibold">$ 64.00</span>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="mb-2 text-sm font-semibold text-black">Payment method</p>
            <div className="grid grid-cols-4 gap-3">
              {["💵", "💳", "VISA", "🏧"].map((item, i) => (
                <button
                  key={i}
                  className={`h-14 rounded-xl border flex items-center justify-center
                  ${i === 0 ? "border-orange-500" : "border-gray-200"}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <p className="mb-2 text-sm font-semibold text-black">Input amount</p>
            <input
              placeholder="Input amount"
              className="w-full h-14 rounded-full border border-gray-400 px-5 text-center outline-none focus:border-orange-400 text-gray-600 font-semibold placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3 text-black">
            {[
              "1", "2", "3", "10",
              "4", "5", "6", "20",
              "7", "8", "9", "⌫",
              "C", "0", ".", "Add",
            ].map((key) => (
              <button
                key={key}
  className={`h-14 rounded-full text-lg font-bold transition-all active:scale-90 flex items-center justify-center
    ${["10", "20"].includes(key) ? "bg-blue-50 text-blue-600" :
            key === "C" ? "bg-orange-50 text-orange-500" :
            key === "⌫" ? "bg-orange-50" : 
            key === "Add" ? "bg-gray-100 text-gray-800 font-normal" :
            "bg-gray-100 text-gray-800"}
                `}
    >
            {key === "⌫" ? (
                <Delete size={28} strokeWidth={2} color="#ffffff" fill="#f97316" />) : (key) 
            }
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t flex gap-3">
          <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white text-sm">
            Gift receipt
          </button>
          <button className="flex-1 h-12 rounded-xl bg-gray-900 text-white text-sm">
            Email
          </button>
          <button className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-semibold">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}