import LoginForm from "@/app/components/Landing/Auth/LoginForm";
import Image from "next/image";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      
      <Image
        src="/landing.png"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 w-full max-w-md px-6 py-8">
        <LoginForm />
      </div>

    </div>
  );
}