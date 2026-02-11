import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

export default function LoginPage() {
  return (
    <GlassBackground backgroundImage="/saasbackground.png">
      <SplitPanelLayout
        left={
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-white">Welcome Back</h2>
            <p className="mt-3 text-white/70">
              Manage your POS business with MicroSaaS.
            </p>

            <div className="mt-10 space-y-3 text-white/70">
              <div>✅ Fast checkout</div>
              <div>✅ Multi-branch ready</div>
              <div>✅ Reports & analytics</div>
            </div>
          </div>
        }
        right={
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold text-white">Sign In</h1>
            <p className="mt-2 text-white/70">
              Enter your credentials to continue.
            </p>

            <div className="mt-8 text-white">Login Form Here</div>
          </div>
        }
      />
    </GlassBackground>
  );
}
