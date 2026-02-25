"use client"

import { Lock } from "lucide-react";
import {useRouter} from "next/navigation";

type LockButtonProps = {
    redirectTo: string;
};
export default function LockButton({
  redirectTo = "/login",
}: LockButtonProps) {
  const router = useRouter();
   const handleLock = () => {
     localStorage.setItem("isLocked", "true");
    router.push(redirectTo);
  };
  return (
    <button
      onClick={handleLock}
      title="Lock Screen"
      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200
                 text-gray-700 px-3 py-1 rounded-full text-[13px] font-semibold"
    >
      <Lock size={14} />
      Lock
    </button>
  );
}