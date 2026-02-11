type GlassShellProps = {
  children: React.ReactNode;
  fullScreen?: boolean;
};

export default function GlassShell({
  children,
  fullScreen = true,
}: GlassShellProps) {
  return (
<div
  className="
    relative
    bg-black/25
    backdrop-blur-3xl
    border border-white/20
    rounded-3xl
    shadow-[0_0_60px_rgba(0,0,0,0.7)]
    before:absolute before:inset-0
    before:rounded-3xl
    before:bg-gradient-to-br
    before:from-white/10
    before:to-transparent
    before:pointer-events-none
  "
>
  {children}
</div>

  );
}
