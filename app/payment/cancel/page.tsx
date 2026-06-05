"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/companyregistration?paymentStatus=cancel");
  }, [router]);

  return null;
}
