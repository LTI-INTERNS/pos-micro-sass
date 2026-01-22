"use client";

import { useState } from "react";
import OrderPaymentModal from "../components/Dashboard/OrderPaymentModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-orange-500 px-6 py-3 text-white"
      >
        Open Payment
      </button>

      <OrderPaymentModal
        open={open}
        onClose={() => setOpen(false)}
        orderNo={102}
        tipAmount={500}
        totalAmount={5670}
      />
    </div>
  );
}
