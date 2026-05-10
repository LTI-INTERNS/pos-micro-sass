"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import ReusableForm, { FieldConfig } from "@/components/Admin/common/ReusableForm";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import type { Supplier } from "@/types/supplier.types";

type SupplierType = "company" | "individual";

export type SupplierFormValues = {
  id: string;
  companyName: string;
  contactPersonName: string;
  contactPersonPhone: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  registrationNumber: string;
  coverArea: string;
  branchIds: string[];
};

type BranchOption = {
  id: string;
  name: string;
};

type SupplierPopUpProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: SupplierFormValues & { supplierType: SupplierType }) => void | Promise<void>;
  supplierId?: string;
  title?: string;
  initialSupplier?: Supplier | null;
  branchOptions?: BranchOption[];
};

const baseFields: FieldConfig[] = [];

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
  { name: "coverArea", label: "Cover Area", placeholder: "Enter cover area", type: "text" },
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
  { name: "coverArea", label: "Cover Area", placeholder: "Enter cover area", type: "text" },
  {
    name: "registrationNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter registration number",
    type: "text",
  },
];

const buildInitial = (supplierId?: string, initialSupplier?: Supplier | null) => {
  if (initialSupplier) {
    if (initialSupplier.type === "Company") {
      return {
        id: initialSupplier.id,
        companyName: initialSupplier.companyName ?? "",
        contactPersonName: initialSupplier.name ?? "",
        contactPersonPhone: initialSupplier.phone ?? "",
        name: "",
        phone: "",
        email: initialSupplier.email ?? "",
        address: initialSupplier.address ?? "",
        registrationNumber: initialSupplier.regNo ?? "",
        coverArea: initialSupplier.coverarea ?? "",
        branchIds: initialSupplier.branchIds ?? [],
      };
    }

    return {
      id: initialSupplier.id,
      companyName: "",
      contactPersonName: "",
      contactPersonPhone: "",
      name: initialSupplier.name ?? "",
      phone: initialSupplier.phone ?? "",
      email: initialSupplier.email ?? "",
      address: initialSupplier.address ?? "",
      registrationNumber: initialSupplier.regNo ?? "",
      coverArea: initialSupplier.coverarea ?? "",
      branchIds: initialSupplier.branchIds ?? [],
    };
  }

  return {
    id: supplierId ?? "",
    companyName: "",
    contactPersonName: "",
    contactPersonPhone: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    registrationNumber: "",
    coverArea: "",
    branchIds: [],
  };
};

export default function SupplierPopUp({
  open,
  onClose,
  onSave,
  supplierId,
  title = "New Supplier",
  initialSupplier = null,
  branchOptions = [],
}: SupplierPopUpProps) {
  const [supplierType, setSupplierType] = React.useState<SupplierType>("company");
  const [values, setValues] = React.useState<SupplierFormValues>(() =>
    buildInitial(supplierId, initialSupplier)
  );

  React.useEffect(() => {
    if (!open) return;

    setSupplierType(initialSupplier?.type === "Individual" ? "individual" : "company");
    setValues(buildInitial(supplierId, initialSupplier));
  }, [open, supplierId, initialSupplier]);

  const setField = (name: keyof SupplierFormValues, next: string | string[]) => {
    setValues((prev) => ({ ...prev, [name]: next } as SupplierFormValues));
  };

  const handleRadioChange = (next: SupplierType) => {
    setSupplierType(next);

    setValues((prev) => {
      const common = {
        id: prev.id,
        email: prev.email,
        address: prev.address,
        registrationNumber: prev.registrationNumber,
        coverArea: prev.coverArea,
        branchIds: prev.branchIds,
      };

      if (next === "company") {
        return {
          ...buildInitial(supplierId, initialSupplier),
          ...common,
          companyName: prev.companyName,
          contactPersonName: prev.contactPersonName,
          contactPersonPhone: prev.contactPersonPhone,
        };
      }

      return {
        ...buildInitial(supplierId, initialSupplier),
        ...common,
        name: prev.name,
        phone: prev.phone,
      };
    });
  };

  const toggleBranch = (branchId: string) => {
    const exists = values.branchIds.includes(branchId);

    if (exists) {
      setField(
        "branchIds",
        values.branchIds.filter((id) => id !== branchId)
      );
      return;
    }

    setField("branchIds", [...values.branchIds, branchId]);
  };

  const handleSave = async () => {
    await onSave({ ...values, supplierType });
  };

  const commonStringValues: Record<string, string> = {
    companyName: values.companyName ?? "",
    contactPersonName: values.contactPersonName ?? "",
    contactPersonPhone: values.contactPersonPhone ?? "",
    name: values.name ?? "",
    phone: values.phone ?? "",
    email: values.email ?? "",
    address: values.address ?? "",
    registrationNumber: values.registrationNumber ?? "",
    coverArea: values.coverArea ?? "",
  };

  const handleReusableFieldChange = (name: string, value: string) => {
    setField(name as keyof SupplierFormValues, value);
  };

  return (
    <ModalShell
      open={open}
      title={title}
      onClose={onClose}
      widthClassName="w-[900px] max-w-[92vw]"
    >
      <div className="space-y-5">
        <ReusableForm
          fields={baseFields}
          values={commonStringValues}
          onFieldChange={handleReusableFieldChange}
          onSubmit={() => {}}
        />

        <div className="flex items-center gap-10 px-1">
          <RadioOption
            label="Company"
            checked={supplierType === "company"}
            onClick={() => handleRadioChange("company")}
          />
          <RadioOption
            label="Individual"
            checked={supplierType === "individual"}
            onClick={() => handleRadioChange("individual")}
          />
        </div>

        {supplierType === "company" ? (
          <div className="space-y-4">
            <ReusableForm
              fields={cooperateTopFields}
              values={commonStringValues}
              onFieldChange={handleReusableFieldChange}
              onSubmit={() => {}}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Name"
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
              values={commonStringValues}
              onFieldChange={handleReusableFieldChange}
              onSubmit={() => {}}
            />
          </div>
        ) : (
          <ReusableForm
            fields={individualFields}
            values={commonStringValues}
            onFieldChange={handleReusableFieldChange}
            onSubmit={() => {}}
          />
        )}

        {branchOptions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 px-1">Branches</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {branchOptions.map((branch) => {
                const checked = values.branchIds.includes(branch.id);

                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => toggleBranch(branch.id)}
                    className={`w-full rounded-3xl border px-4 py-3 text-left text-sm transition ${
                      checked
                        ? "border-orange-400 bg-orange-50 text-gray-800"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {branch.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center pt-2">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                {
                  label: title === "Edit Supplier" ? "Save Changes" : "Add supplier",
                  onClick: handleSave,
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