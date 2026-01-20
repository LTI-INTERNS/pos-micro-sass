"use client";

import { useMemo, useRef, useState } from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import ReusableForm, { FieldConfig } from "@/app/components/Dashboard/common/ReusableForm";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
};

/* ---------- Field Sets ---------- */

const baseFields: FieldConfig[] = [
  { name: "id", label: "ID", placeholder: "A001", type: "text", disabled: true },
  {
    name: "type",
    label: "",
    type: "radio",
    options: [
      { value: "co-operate", label: "Co-Operate" },
      { value: "individual", label: "Individual" },
    ],
  },
];

// Co-Operate screen
const cooperateFields: FieldConfig[] = [
  { name: "companyName", label: "Company Name", placeholder: "Enter name" },
  { name: "contactPerson", label: "Contact person Name", placeholder: "Enter name" },
  { name: "phone", label: "Phone number", placeholder: "Enter phone number" },
  { name: "email", label: "Email", placeholder: "Enter email address" },
  { name: "address", label: "Address", placeholder: "Enter Address" },
  {
    name: "regNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter Registration Number",
  },
];

// Individual screen
const individualFields: FieldConfig[] = [
  { name: "fullName", label: "Full Name", placeholder: "Enter name" },
  { name: "phone", label: "Phone number", placeholder: "Enter phone number" },
  { name: "email", label: "Email", placeholder: "Enter email address" },
  { name: "address", label: "Address", placeholder: "Enter Address" },
  { name: "nic", label: "NIC (Optional)", placeholder: "Enter NIC" },
];

export default function NewSupplierPopup({ open, onClose, onSave }: Props) {
  const formWrapRef = useRef<HTMLDivElement>(null);

  const [supplierType, setSupplierType] = useState<"co-operate" | "individual">("co-operate");

  // Build the active fields list based on radio selection
  const fields: FieldConfig[] = useMemo(() => {
    return [...baseFields, ...(supplierType === "co-operate" ? cooperateFields : individualFields)];
  }, [supplierType]);

  const handleAddSupplier = () => {
    const formEl = formWrapRef.current?.querySelector("form") as HTMLFormElement | null;
    formEl?.requestSubmit();
  };

  return (
    <ModalShell
      open={open}
      title="New Supplier"
      onClose={onClose}
      widthClassName="w-[900px] max-w-[92vw]"
    >
      <div className="flex flex-col">
        <div ref={formWrapRef}>
          <ReusableForm
            fields={fields}
            initialValues={{ id: "A001", type: supplierType }}
            resetKey={open ? "open" : "closed"} // reset only when popup opens/closes
            onValuesChange={(vals) => {
              const nextType = vals.type === "individual" ? "individual" : "co-operate";
              if (nextType !== supplierType) setSupplierType(nextType);
            }}
            onSubmit={onSave}
          />
        </div>

        <PopupActions
          actions={[
            { label: "Cancel", onClick: onClose, variant: "secondary" },
            { label: "Add supplier", onClick: handleAddSupplier, variant: "primary" },
          ]}
        />
      </div>
    </ModalShell>
  );
}
