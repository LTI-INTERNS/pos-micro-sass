"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

export type CustomerFormValues = {
  name: string;
  email?: string;
  promocard?: string;
  activeState: boolean;
  phoneNumber1: string;
  phoneNumber2?: string;
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
  title = "New Customer",
  submitLabel = "Add Customer",
  onClose,
  onSubmit,
}: AddCustomerModalProps) {
  const [values, setValues] = React.useState<CustomerFormValues>({
    name: "",
    email: "",
    promocard: "",
    activeState: true,
    phoneNumber1: "",
    phoneNumber2: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (
    name: keyof CustomerFormValues,
    value: string | boolean
  ) => {
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

    if (!values.phoneNumber1.trim()) {
      newErrors.phoneNumber1 = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phoneNumber1.replace(/\D/g, ""))) {
      newErrors.phoneNumber1 = "Phone number must be exactly 10 digits";
    }

    if (values.phoneNumber2?.trim()) {
      if (!/^\d{10}$/.test(values.phoneNumber2.replace(/\D/g, ""))) {
        newErrors.phoneNumber2 = "Phone number must be exactly 10 digits";
      }
    }

    if (values.email?.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues({
      name: "",
      email: "",
      promocard: "",
      activeState: true,
      phoneNumber1: "",
      phoneNumber2: "",
    });
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      name: values.name.trim(),
      email: values.email?.trim() || undefined,
      promocard: values.promocard?.trim() || undefined,
      activeState: values.activeState,
      phoneNumber1: values.phoneNumber1.trim(),
      phoneNumber2: values.phoneNumber2?.trim() || undefined,
    });

    resetForm();
  };

  const handleCancel = () => {
    onClose();
    resetForm();
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
          label="Customer Name *"
          placeholder="Enter customer name"
          value={values.name}
          onChange={(v) => setField("name", v)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 px-3">{errors.name}</p>
        )}

        <FormField
          label="Phone Number 1 *"
          placeholder="Enter primary phone number"
          value={values.phoneNumber1}
          onChange={(v) =>
            setField("phoneNumber1", v.replace(/\D/g, "").slice(0, 10))
          }
        />
        {errors.phoneNumber1 && (
          <p className="text-xs text-red-500 px-3">{errors.phoneNumber1}</p>
        )}

        <FormField
          label="Phone Number 2 (Optional)"
          placeholder="Enter secondary phone number"
          value={values.phoneNumber2 ?? ""}
          onChange={(v) =>
            setField("phoneNumber2", v.replace(/\D/g, "").slice(0, 10))
          }
        />
        {errors.phoneNumber2 && (
          <p className="text-xs text-red-500 px-3">{errors.phoneNumber2}</p>
        )}

        <FormField
          label="Email (Optional)"
          placeholder="Enter email address"
          value={values.email ?? ""}
          onChange={(v) => setField("email", v)}
        />
        {errors.email && (
          <p className="text-xs text-red-500 px-3">{errors.email}</p>
        )}

        <FormField
          label="Promo Card (Optional)"
          placeholder="Enter promo card number/code"
          value={values.promocard ?? ""}
          onChange={(v) => setField("promocard", v)}
        />

        

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