"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TimeDisplay from "@/components/Landing/clock";
import UserRow from "@/components/Landing/switchuser/UserRow";
import { useImage } from "@/lib/context/ImageContext";
import SessionExpiryGuard from "@/components/Pos/SessionExpiryGuard";

export default function SwitchUserScreen() {
  const router = useRouter();
  const { backgroundImage } = useImage();

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <SessionExpiryGuard variant="switchuser" />

      {backgroundImage && backgroundImage.trim() !== "" ? (
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )}

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <button
        onClick={() => router.push("/login")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-gray/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <TimeDisplay />
        <div className="mt-16 w-full">
          <UserRow />
        </div>
      </div>
    </div>
  );
}