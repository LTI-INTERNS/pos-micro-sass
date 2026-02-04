"use client";

import React from "react";
import ActionButton from "../common/ActionButton";
import ModalShell from "../common/ModalShell";

type Props<T extends { id?: string | number } = any> = {
  isOpen: boolean;
  onClose: () => void;
  item?: T;
  itemName?: string;
  onConfirm: () => void;
  getDisplayText?: (item: T) => React.ReactNode;
};

export default function DeletePopup<T extends { id?: string | number }>({
  isOpen,
  onClose,
  item,
  itemName = "Item",
  onConfirm,
  getDisplayText,
}: Props<T>) {
  if (!isOpen || !item) return null;

  const displayText = getDisplayText
    ? getDisplayText(item)
    : (
        <>
          {itemName}
          <br />
          ID - {item.id}
        </>
      );

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={`Delete ${itemName}`}
      widthClassName="w-[420px] max-w-[92vw]"
    >
      <p className="mb-6 text-sm text-gray-800 leading-relaxed">
        Are you sure you want to delete this?
        {displayText}
      </p>

      <div className="flex justify-end gap-3">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth={true}
          onClick={onClose}
        />
        <ActionButton
          label="Delete"
          variant="primary"
          fullWidth={true}
          onClick={onConfirm}
        />
      </div>
    </ModalShell>
  );
}
