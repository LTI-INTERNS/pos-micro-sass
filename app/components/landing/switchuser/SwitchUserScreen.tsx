import Image from "next/image";
import TimeDisplay from "./Clock";
import UserRow from "./UserRow";

export default function SwitchUserScreen() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background */}
      <Image
        src="/landing.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <TimeDisplay />
        <div className="mt-16 w-full">
          <UserRow />
        </div>
      </div>
    </div>
  );
}
