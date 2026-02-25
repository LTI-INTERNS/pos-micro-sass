"use client";

import { useState } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ActionButton from "@/components/Admin/common/ActionButton";
import { Product } from "@/lib/services";

type Props = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (addedQty: number) => void;
};

export default function AddStockPopup({ product, isOpen, onClose, onSave }: Props) {
  const [quantity, setQuantity] = useState<number>(0);

  const handleSave = () => {
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    onSave(quantity);
    setQuantity(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      open={isOpen}
      onClose={onClose}
      title={`Add Stock - ${product.name}`}
      widthClassName="w-[420px] max-w-[92vw]"
    >
      <p className="mb-6 text-sm text-gray-800 leading-relaxed">
        Quantity to Add
      </p>

      <div className="space-y-4">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? 0 : parseInt(e.target.value))
          }
          className=" w-full rounded-full border px-4 py-2 outline-none text-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 border-gray-200"
        />

        <div className="flex justify-end gap-3">
          <ActionButton label="Cancel" variant="outline" onClick={onClose} />
          <ActionButton label="Add Stock" variant="primary" onClick={handleSave} />
        </div>
      </div>
    </ModalShell>
  );
}
