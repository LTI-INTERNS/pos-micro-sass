"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

export type CustomerFormValues = {
  name: string;
  phoneNumber: string;
  phoneNumber2?: string;
  email?: string;
};

type FormErrors = Partial<Record<keyof CustomerFormValues, string>>;

type AddCustomerModalProps = {
  open: boolean;
  title?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
};

export default function AddCustomerModal({
  open,
  title = "New customer",
  submitLabel = "Add customer",
  onClose,
  onSubmit,
}: AddCustomerModalProps) {
  const [values, setValues] = React.useState<CustomerFormValues>({
    name: "",
    phoneNumber: "",
    phoneNumber2: "",
    email: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (name: keyof CustomerFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (values.phoneNumber2?.trim()) {
      if (!/^\d{10}$/.test(values.phoneNumber2.replace(/\D/g, ""))) {
        newErrors.phoneNumber2 = "Phone number must be exactly 10 digits";
      }
    }

    if (values.email?.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      phoneNumber2: values.phoneNumber2?.trim() || undefined,
      email: values.email?.trim() || undefined,
    });

    resetForm();
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setValues({
      name: "",
      phoneNumber: "",
      phoneNumber2: "",
      email: "",
    });
    setErrors({});
  };

  return (
    <ModalShell
      open={open}
      title={title}
      onClose={handleCancel}
      widthClassName="w-[600px] max-w-[92vw]"
    >
      <form className="space-y-1 mt-[-10px]">
        <FormField
          label="Name *"
          placeholder="Enter name"
          value={values.name}
          onChange={(v) => setField("name", v)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 px-3">{errors.name}</p>
        )}

        <FormField
          label="Phone number 1 *"
          placeholder="Enter phone number"
          value={values.phoneNumber}
          onChange={(v) =>
            setField("phoneNumber", v.replace(/\D/g, "").slice(0, 10))
          }
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-500 px-3">{errors.phoneNumber}</p>
        )}

        <FormField
          label="Phone number 2 (optional)"
          placeholder="Enter phone number"
          value={values.phoneNumber2 ?? ""}
          onChange={(v) =>
            setField("phoneNumber2", v.replace(/\D/g, "").slice(0, 10))
          }
        />
        {errors.phoneNumber2 && (
          <p className="text-xs text-red-500 px-3">{errors.phoneNumber2}</p>
        )}

        <FormField
          label="Email (optional)"
          placeholder="Enter email address"
          value={values.email ?? ""}
          onChange={(v) => setField("email", v)}
        />
        {errors.email && (
          <p className="text-xs text-red-500 px-3">{errors.email}</p>
        )}

        <div className="flex justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  variant: "secondary",
                  onClick: handleCancel,
                },
                {
                  label: submitLabel,
                  variant: "primary",
                  onClick: handleSubmit,
                },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
