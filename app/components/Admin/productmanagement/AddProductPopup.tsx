"use client";

import ModalShell from "../common/ModalShell";
import ReusableForm, { FieldConfig } from "../common/ReusableForm";
import PopupActions from "../common/PopupActions";
import * as React from "react";

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: {
    name: string;
    price: string;
    discount: string;
    tax: string;
    stock: string;
  }) => void;
};

const addProductFields: FieldConfig[] = [
  { name: "name", label: "Name", placeholder: "Enter name", type: "text" },
  { name: "price", label: "Price", placeholder: "Enter price", type: "number" },
  { name: "discount", label: "Discount", placeholder: "Enter discount", type: "number" },
  { name: "tax", label: "Tax", placeholder: "Enter tax", type: "number" },
  { name: "stock", label: "Stock", placeholder: "Enter stock", type: "number" },
];

export default function AddProductPopup({ open, onClose, onSave }: AddProductPopupProps) {
  const [latestValues, setLatestValues] = React.useState<Record<string, string>>({});

  return (
    <ModalShell open={open} title="Add New Product" onClose={onClose} widthClassName="w-[980px] max-w-[92vw]">
      <div className="space-y-6">
        <ReusableForm
          fields={addProductFields}
          onSubmit={(values) => {
            setLatestValues(values);
            onSave(values as any);
          }}
        />

        <div className="flex items-center justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                {
                  label: "Save",
                  onClick: () => onSave(latestValues as any),
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
