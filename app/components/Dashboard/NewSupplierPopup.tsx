"use client";
import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import ReusableForm, { FieldConfig } from "@/app/components/Dashboard/common/ReusableForm";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

const supplierFields: FieldConfig[] = [
  { name: "id", label: "ID", placeholder: "A001", type: "text" },
  { name: "type", label: "Supplier Type", type: "dropdown", placeholder: "Select type" },
  { name: "name", label: "Name", placeholder: "Enter name" },
  { name: "phone", label: "Phone number", placeholder: "Enter phone number" },
  { name: "email", label: "Email", placeholder: "Enter email address" },
  { name: "address", label: "Address", placeholder: "Enter address" },
  { name: "regNumber", label: "Registration Number (Optional)", placeholder: "Enter registration number" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
};

export default function NewSupplierPopup({ open, onClose, onSave }: Props) {
  const [latestValues, setLatestValues] = React.useState<Record<string, string>>({});
  const formWrapRef = React.useRef<HTMLDivElement>(null);

  const handleAddSupplier = () => {
    const formEl = formWrapRef.current?.querySelector("form") as HTMLFormElement | null;
    formEl?.requestSubmit?.();
  };

  return (
    <ModalShell
  open={open}
  title="New Supplier"
  onClose={onClose}
  widthClassName="w-[760px] max-w-[90vw]"
>
  <div className="flex flex-col text-left">
    {/* Body */}
    <div className="px-4 py-3">
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <ReusableForm
          fields={supplierFields}
          onSubmit={(values) => onSave(values)}
        />
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-gray-100 bg-white px-4 py-2">
      <div className="flex justify-end">
        <div className="w-[320px]">
          <PopupActions
            actions={[
              { label: "Cancel", onClick: onClose, variant: "secondary" },
              {
                label: "Add supplier",
                onClick: () => {}, // handled by form submit
                variant: "primary",
              },
            ]}
          />
        </div>
      </div>
    </div>

  </div>
</ModalShell>
  );
}
