"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

type VerificationStatus = "unverified" | "sent" | "verified";

type Props = {
  email: string;
};

export default function EmailVerification({ email }: Props) {
  const [status, setStatus] = useState<VerificationStatus>("unverified");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);

    //  MOCK API CALL (replace later)
    setTimeout(() => {
      setStatus("sent");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="mt-2 space-y-1">
      {/*  VERIFIED */}
      {status === "verified" && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle size={16} />
          Email verified
        </div>
      )}

      {/*  NOT VERIFIED */}
      {status === "unverified" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-yellow-600 text-sm">
            <AlertTriangle size={16} />
            Email not verified
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="text-sm text-orange-600 font-medium hover:underline disabled:opacity-50"
          >
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </div>
      )}

      {/*  VERIFICATION SENT */}
      {status === "sent" && (
        <p className="text-sm text-gray-500">
          Verification email sent. Please check your inbox.
        </p>
      )}
    </div>
  );
}
