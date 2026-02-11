import GlassShell from "@/app/components/saas/common/layout/GlassShell";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[url('/saasbackground.png')] bg-cover bg-center flex items-center justify-center">
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glass content */}
      <div className="relative z-10 w-full max-w-5xl">
        <GlassShell fullScreen={false}>
          <div className="p-16">
            Login Form Here
          </div>
        </GlassShell>
      </div>
    </div>
  );
}
