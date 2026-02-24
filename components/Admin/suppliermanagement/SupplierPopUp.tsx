"use client";

import * as React from "react";
import ModalShell from "../common/ModalShell";
import ReusableForm, { FieldConfig } from "../common/ReusableForm";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";

type SupplierType = "co-operate" | "individual";

type SupplierPopUpProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  // optional: pass auto-generated ID from parent
  supplierId?: string;
};

const baseFields: FieldConfig[] = [
  {
    name: "id",
    label: "ID",
    placeholder: "Auto generated",
    type: "text",
    disabled: true,
  },
];

const cooperateTopFields: FieldConfig[] = [
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter name",
    type: "text",
  },
];

const cooperateBottomFields: FieldConfig[] = [
  { name: "email", label: "Email", placeholder: "Enter email address", type: "text" },
  { name: "address", label: "Address", placeholder: "Enter address", type: "text" },
  {
    name: "registrationNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter registration number",
    type: "text",
  },
];

const individualFields: FieldConfig[] = [
  { name: "name", label: "Name", placeholder: "Enter name", type: "text" },
  { name: "phone", label: "Phone number", placeholder: "Enter phone number", type: "number" },
  { name: "email", label: "Email", placeholder: "Enter email address", type: "text" },
  { name: "address", label: "Address", placeholder: "Enter address", type: "text" },
  {
    name: "registrationNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter registration number",
    type: "text",
  },
];

const buildInitial = (supplierId?: string) => ({
  id: supplierId ?? "A001",
  companyName: "",
  contactPersonName: "",
  contactPersonPhone: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  registrationNumber: "",
});

export default function SupplierPopUp({
  open,
  onClose,
  onSave,
  supplierId,
}: SupplierPopUpProps) {
  const [supplierType, setSupplierType] = React.useState<SupplierType>("co-operate");
  const [values, setValues] = React.useState<Record<string, string>>(() => buildInitial(supplierId));

  // reset values when popup opens (and refresh ID if provided)
  React.useEffect(() => {
    if (!open) return;
    setSupplierType("co-operate");
    setValues(buildInitial(supplierId));
  }, [open, supplierId]);

  const setField = (name: string, next: string) => {
    setValues((prev) => ({ ...prev, [name]: next }));
  };

  const handleRadioChange = (next: SupplierType) => {
    setSupplierType(next);

    // optional: clear fields that don't belong to the selected type (keeps data clean)
    setValues((prev) => {
      const common = {
        id: prev.id,
        email: prev.email,
        address: prev.address,
        registrationNumber: prev.registrationNumber,
      };

      if (next === "co-operate") {
        return {
          ...buildInitial(supplierId),
          ...common,
          companyName: prev.companyName,
          contactPersonName: prev.contactPersonName,
          contactPersonPhone: prev.contactPersonPhone,
        };
      }

      return {
        ...buildInitial(supplierId),
        ...common,
        name: prev.name,
        phone: prev.phone,
      };
    });
  };

  const handleSave = () => {
    // send full object (backend can use what it needs)
    onSave({ ...values, supplierType });
  };

  return (
    <ModalShell
      open={open}
      title="New Supplier"
      onClose={onClose}
      widthClassName="w-[900px] max-w-[92vw]"
    >
      <div className="space-y-5">
        {/* ID (disabled) */}
        <ReusableForm
          fields={baseFields}
          initialValues={values}
          onSubmit={() => {}}
        />

        <div className="flex items-center gap-10 px-1">
          <RadioOption
            label="Co-Operate"
            checked={supplierType === "co-operate"}
            onClick={() => handleRadioChange("co-operate")}
          />
          <RadioOption
            label="Individual"
            checked={supplierType === "individual"}
            onClick={() => handleRadioChange("individual")}
          />
        </div>

        {supplierType === "co-operate" ? (
          <div className="space-y-4">
            <ReusableForm
              fields={cooperateTopFields}
              initialValues={values}
              onSubmit={() => {}}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Contact person Name"
                placeholder="Enter name"
                value={values.contactPersonName ?? ""}
                onChange={(next) => setField("contactPersonName", next)}
                type="text"
              />
              <FormField
                label="Phone number"
                placeholder="Enter phone number"
                value={values.contactPersonPhone ?? ""}
                onChange={(next) => setField("contactPersonPhone", next)}
                type="number"
              />
            </div>

            <ReusableForm
              fields={cooperateBottomFields}
              initialValues={values}
              onSubmit={() => {}}
            />
          </div>
        ) : (
          <ReusableForm
            fields={individualFields}
            initialValues={values}
            onSubmit={() => {}}
          />
        )}

        <div className="flex items-center justify-center pt-2">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                { label: "Add supplier", onClick: handleSave, variant: "primary" },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function RadioOption({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-sm text-gray-700"
    >
      <span className="min-w-[90px] text-left">{label}</span>

      <span
        className={[
          "h-5 w-5 rounded-full border flex items-center justify-center",
          checked ? "border-orange-500" : "border-gray-300",
        ].join(" ")}
      >
        {checked ? <span className="h-3 w-3 rounded-full bg-orange-500" /> : null}
      </span>
    </button>
  );
}
