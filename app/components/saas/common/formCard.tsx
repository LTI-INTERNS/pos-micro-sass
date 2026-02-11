type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  title,
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "bg-white/10 backdrop-blur-md",
        "border border-white/20",
        "rounded-2xl",
        "p-8",
        "shadow-xl",
        className,
      ].join(" ")}
    >
      {title && (
        <h2 className="text-xl font-semibold text-white mb-6">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
