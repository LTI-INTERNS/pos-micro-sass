"use client";

export type CashierStatus = "all" | "new" | "top";

type Props = {
  value: CashierStatus;
  onChange: (v: CashierStatus) => void;
};

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full text-xs font-semibold border transition",
        active
          ? "bg-orange-50 border-orange-400 text-orange-600"
          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function CashierStatusTabs({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <TabButton active={value === "all"} onClick={() => onChange("all")}>
        All
      </TabButton>
      <TabButton active={value === "new"} onClick={() => onChange("new")}>
        New
      </TabButton>
      <TabButton active={value === "top"} onClick={() => onChange("top")}>
        Top
      </TabButton>
    </div>
  );
}
