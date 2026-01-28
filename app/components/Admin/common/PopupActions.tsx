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
    <div className="mt-6 flex gap-4">
      {actions.map((action, index) => {
        const isPrimary = action.variant === "primary";

        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className={`
              w-full rounded-full py-3 font-semibold transition active:scale-[0.98]
              ${
                isPrimary
                  ? "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
                  : "border border-orange-500 bg-white text-orange-500 hover:bg-orange-50 cursor-pointer"
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
