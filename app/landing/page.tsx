import Clock from "../components/Clock";
import RoleButton from "../components/RoleButton";

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/landing.png')",
      }}
    >
      
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <Clock />

        <div className="flex gap-4">
          <RoleButton label="Cashier" />
          <RoleButton label="Admin" />
        </div>
      </div>
    </main>
  );
}
