type SplitPanelLayoutProps = {
  left?: React.ReactNode;
  right: React.ReactNode;

  /** optional sizes */
  leftClassName?: string;
  rightClassName?: string;

  /** show left on mobile? (default false like most auth screens) */
  showLeftOnMobile?: boolean;
};

export default function SplitPanelLayout({
  left,
  right,
  leftClassName = "",
  rightClassName = "",
  showLeftOnMobile = false,
}: SplitPanelLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Left */}
      {left && (
        <div
          className={[
            showLeftOnMobile ? "flex" : "hidden",
            "md:flex items-center justify-center p-10",
            "border-b md:border-b-0 md:border-r border-white/15",
            leftClassName,
          ].join(" ")}
        >
          {left}
        </div>
      )}

      {/* Right */}
      <div
        className={[
          "flex items-center justify-center p-10",
          rightClassName,
        ].join(" ")}
      >
        {right}
      </div>
    </div>
  );
}
