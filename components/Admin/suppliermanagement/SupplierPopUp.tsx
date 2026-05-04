"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
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
  onSave: (
    values: SupplierFormValues & { supplierType: SupplierType },
  ) => void | Promise<void>;
  supplierId?: string;
  title?: string;
  initialSupplier?: Supplier | null;
  branchOptions?: BranchOption[];
};

type SupplierFormFieldName = keyof SupplierFormValues;

type ValidationErrors = Partial<
  Record<SupplierFormFieldName | "branches", string>
>;

type LocalFieldConfig = {
  name: SupplierFormFieldName;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
};

const cooperateTopFields: LocalFieldConfig[] = [
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter name",
    type: "text",
  },
];

const cooperateBottomFields: LocalFieldConfig[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email address",
    type: "email",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter address",
    type: "text",
  },
  {
    name: "coverArea",
    label: "Cover Area",
    placeholder: "Enter cover area",
    type: "text",
  },
  {
    name: "registrationNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter registration number",
    type: "text",
  },
];

const individualFields: LocalFieldConfig[] = [
  { name: "name", label: "Name", placeholder: "Enter name", type: "text" },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "Enter phone number",
    type: "number",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email address",
    type: "email",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter address",
    type: "text",
  },
  {
    name: "coverArea",
    label: "Cover Area",
    placeholder: "Enter cover area",
    type: "text",
  },
  {
    name: "registrationNumber",
    label: "Registration Number (Optional)",
    placeholder: "Enter registration number",
    type: "text",
  },
];

const buildInitial = (
  supplierId?: string,
  initialSupplier?: Supplier | null,
): SupplierFormValues => {
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

const isBlank = (value: string | undefined | null) =>
  !value || value.trim().length === 0;

const getRequiredFieldErrors = (
  supplierType: SupplierType,
  values: SupplierFormValues,
): ValidationErrors => {
  const nextErrors: ValidationErrors = {};

  if (supplierType === "company") {
    if (isBlank(values.companyName))
      nextErrors.companyName = "Company name is required.";
    if (isBlank(values.contactPersonName))
      nextErrors.contactPersonName = "Name is required.";
    if (isBlank(values.contactPersonPhone)) {
      nextErrors.contactPersonPhone = "Phone number is required.";
    }
  } else {
    if (isBlank(values.name)) nextErrors.name = "Name is required.";
    if (isBlank(values.phone)) nextErrors.phone = "Phone number is required.";
  }

  if (isBlank(values.email)) nextErrors.email = "Email is required.";
  if (isBlank(values.address)) nextErrors.address = "Address is required.";
  if (isBlank(values.coverArea))
    nextErrors.coverArea = "Cover area is required.";

  if (values.branchIds.length === 0) {
    nextErrors.branches = "Select at least one branch.";
  }

  return nextErrors;
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
  const [supplierType, setSupplierType] =
    React.useState<SupplierType>("company");
  const [values, setValues] = React.useState<SupplierFormValues>(() =>
    buildInitial(supplierId, initialSupplier),
  );
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  React.useEffect(() => {
    if (!open) return;

    setSupplierType(
      initialSupplier?.type === "Individual" ? "individual" : "company",
    );
    setValues(buildInitial(supplierId, initialSupplier));
    setErrors({});
  }, [open, supplierId, initialSupplier]);

  const setField = (name: SupplierFormFieldName, next: string | string[]) => {
    setValues((prev) => ({ ...prev, [name]: next }) as SupplierFormValues);

    setErrors((prev) => {
      if (!prev[name]) return prev;

      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleRadioChange = (next: SupplierType) => {
    setSupplierType(next);
    setErrors({});

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

    setErrors((prev) => {
      if (!prev.branches) return prev;

      const nextErrors = { ...prev };
      delete nextErrors.branches;
      return nextErrors;
    });

    if (exists) {
      setField(
        "branchIds",
        values.branchIds.filter((id) => id !== branchId),
      );
      return;
    }

    setField("branchIds", [...values.branchIds, branchId]);
  };

  const handleSave = async () => {
    const nextErrors = getRequiredFieldErrors(supplierType, values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSave({ ...values, supplierType });
  };

  const renderFields = (fields: LocalFieldConfig[]) => (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldWithError
          key={field.name}
          field={field}
          value={String(values[field.name] ?? "")}
          error={errors[field.name]}
          onChange={(next) => setField(field.name, next)}
        />
      ))}
    </div>
  );

  return (
    <ModalShell
      open={open}
      title={title}
      onClose={onClose}
      widthClassName="w-[900px] max-w-[92vw]"
    >
      <div className="space-y-5">
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
            {renderFields(cooperateTopFields)}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldWithError
                field={{
                  name: "contactPersonName",
                  label: "Name",
                  placeholder: "Enter name",
                  type: "text",
                }}
                value={values.contactPersonName ?? ""}
                error={errors.contactPersonName}
                onChange={(next) => setField("contactPersonName", next)}
              />

              <FieldWithError
                field={{
                  name: "contactPersonPhone",
                  label: "Phone number",
                  placeholder: "Enter phone number",
                  type: "number",
                }}
                value={values.contactPersonPhone ?? ""}
                error={errors.contactPersonPhone}
                onChange={(next) => setField("contactPersonPhone", next)}
              />
            </div>

            {renderFields(cooperateBottomFields)}
          </div>
        ) : (
          renderFields(individualFields)
        )}

        {branchOptions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <p className="text-sm text-gray-500">Branches</p>
              {errors.branches ? (
                <p className="text-xs text-red-500">{errors.branches}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {branchOptions.map((branch) => {
                const checked = values.branchIds.includes(branch.id);

                return (
                  <BranchCheckboxOption
                    key={branch.id}
                    label={branch.name}
                    checked={checked}
                    onChange={() => toggleBranch(branch.id)}
                  />
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
                  label:
                    title === "Edit Supplier" ? "Save Changes" : "Add supplier",
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

function FieldWithError({
  field,
  value,
  error,
  onChange,
}: {
  field: LocalFieldConfig;
  value: string;
  error?: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="space-y-1">
      <FormField
        label={field.label}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        type={field.type ?? "text"}
      />
      {error ? <p className="px-4 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

function BranchCheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full cursor-pointer items-center gap-3 px-1 py-2 text-left text-sm text-gray-700 outline-none"
    >
      <span
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
          checked
            ? "border-orange-500 bg-orange-500"
            : "border-gray-300 bg-transparent",
        ].join(" ")}
      >
        {checked ? (
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
          </svg>
        ) : null}
      </span>

      <span className="flex-1">{label}</span>
    </button>
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
          "flex h-5 w-5 items-center justify-center rounded-full border",
          checked ? "border-orange-500" : "border-gray-300",
        ].join(" ")}
      >
        {checked ? (
          <span className="h-3 w-3 rounded-full bg-orange-500" />
        ) : null}
      </span>
    </button>
  );
}
