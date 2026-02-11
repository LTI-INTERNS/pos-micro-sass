type GlassShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassShell({
  children,
  className = "",
}: GlassShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div
        className={`w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
