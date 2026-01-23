"use client";

type ActionButton = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type PopupActionsProps = {
  actions: ActionButton[];
};

export default function PopupActions({ actions }: PopupActionsProps) {
  return (
    <div className="mt-8 flex justify-center gap-6">
      {actions.map((action, index) => {
        const isPrimary = action.variant === "primary";

        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={`
              h-12 min-w-[230px] px-10 rounded-full text-sm font-semibold
              transition active:scale-[0.98]
              ${
                isPrimary
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                  : "border border-orange-500 bg-white text-orange-500 hover:bg-orange-50"
              }
            `}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
