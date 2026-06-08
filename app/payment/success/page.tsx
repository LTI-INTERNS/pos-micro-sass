"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const target = sessionId
      ? `/companyselection?paymentStatus=success&session_id=${encodeURIComponent(sessionId)}`
      : "/companyselection?paymentStatus=success";

    router.replace(target);
  }, [router]);

  return null;
}
