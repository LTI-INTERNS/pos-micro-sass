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
              px-20 rounded-full py-2 font-semibold transition active:scale-[0.98]
              ${
                isPrimary
                  ? "bg-orange-500 text-white hover:bg-orange-600"
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
