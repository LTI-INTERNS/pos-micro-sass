"use client";

import * as React from "react";
import ModalShell from "../common/ModalShell";
import PopupActions from "../common/PopupActions";

export type ProductNotifyValues = {
  name: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
};

export type ProductNotifySubmit = ProductNotifyValues & {
  description: string; 
};

type Props = {
  open: boolean;
  onClose: () => void;

  // notification data to show (read-only)
  initialValues: ProductNotifyValues | null;

  // Accept -> returns product + description
  onSave: (values: ProductNotifySubmit) => void;
};

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <p className="col-span-4 text-sm text-gray-500 font-medium">{label}</p>
      <div className="col-span-8">
        <div className="h-11 rounded-full border border-gray-200 bg-gray-100 px-5 flex items-center text-sm text-gray-700">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}

export default function ProductNotificationPopup({
  open,
  onClose,
  onSave,
  initialValues,
}: Props) {
  const [description, setDescription] = React.useState("");

  // reset description when popup opens
  React.useEffect(() => {
    if (open) setDescription("");
  }, [open]);

  if (!open || !initialValues) return null;

  const handleAccept = () => {
    onSave({
      ...initialValues,
      description: description.trim(),
    });
  };

  return (
    <ModalShell
      open={open}
      title="Product Notification"
      onClose={onClose}
      widthClassName="w-[980px] max-w-[92vw]"
    >
      <div className="space-y-6">
        {/*  Read-only Product Details */}
        <div className="space-y-4">
          <ReadOnlyRow label="Name" value={initialValues.name} />
          <ReadOnlyRow label="Price" value={initialValues.price} />
          <ReadOnlyRow label="Discount" value={initialValues.discount} />
          <ReadOnlyRow label="Tax" value={initialValues.tax} />
          <ReadOnlyRow label="Stock" value={initialValues.stock} />
        </div>

        {/* Only editable field: Description */}
        <div className="grid grid-cols-12 gap-3">
          <label className="col-span-4 text-sm text-gray-500 font-medium pt-2">
            Description
          </label>

          <div className="col-span-8">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter reason / notes (editable)"
              className="w-full min-h-[110px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900
                         outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/*  Actions */}
        <div className="flex items-center justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Reject", onClick: onClose, variant: "secondary" },
                {
                  label: "Accept",
                  onClick: handleAccept,
                  variant: "primary",
                  disabled: description.trim().length === 0, // optional: require description
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
