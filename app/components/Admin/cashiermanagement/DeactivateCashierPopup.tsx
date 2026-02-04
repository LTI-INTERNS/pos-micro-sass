"use client";

import ActionButton from "../common/ActionButton";
import ModalShell from "../common/ModalShell";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cashier?: { id: string; name: string; status?: "Active" | "Deactive" };
  onConfirm: () => void;
};

export default function DeactivateCashierPopup({
  isOpen,
  onClose,
  cashier,
  onConfirm,
}: Props) {
  if (!isOpen || !cashier) return null;

  const isActive = cashier.status === "Active";

  const message = (
    <>
      Are you sure you want to {isActive ? "deactivate" : "reactivate"} cashier?
      <br />
      <br />
      ID - {cashier.id}
      <br />
      Name - {cashier.name}
    </>
  );

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={isActive ? "Deactivate Cashier" : "Reactivate Cashier"}
      widthClassName="w-96"
    >
      <p className="mb-6 text-sm text-gray-800">{message}</p>

      <div className="flex justify-end gap-3">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth={true}
          onClick={onClose}
        />
        <ActionButton
          label={isActive ? "Deactivate" : "Reactivate"}
          variant="primary"
          fullWidth={true}
          onClick={onConfirm}
        />
      </div>
    </ModalShell>
  );
}
