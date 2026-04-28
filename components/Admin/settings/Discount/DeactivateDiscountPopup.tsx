"use client";

import ActionButton from "@/components/Admin/common/ActionButton";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Discount } from "@/types/discount";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  discount?: Discount;
  onConfirm: () => void;
};

export default function DeactivateDiscountPopup({
  isOpen,
  onClose,
  discount,
  onConfirm,
}: Props) {
  if (!isOpen || !discount) return null;

  const isActive = discount.status;

  const message = (
    <>
      Are you sure you want to {isActive ? "deactivate" : "reactivate"} this discount?
      <br />
      <br />
      Title - {discount.title}
      <br />
      Percentage - {discount.percentage}%
    </>
  );

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={isActive ? "Deactivate Discount" : "Reactivate Discount"}
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
