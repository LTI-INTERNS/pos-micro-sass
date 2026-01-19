"use client";

import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import FormField from "@/app/components/Dashboard/common/FormField";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

type FormValues = {
  name: string;
  phoneNumber: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
};

export default function AddCustomerForm({
  open,
  onClose,
  onSubmit,
}: AddCustomerFormProps) {
  const [values, setValues] = React.useState<FormValues>({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (name: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Phone number validation - exactly 10 digits
    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form is valid! Submitted data:", values);
      onSubmit(values);
      resetForm();
    }
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setValues({
      name: "",
      phoneNumber: "",
      email: "",
    });
    setErrors({});
  };

  return (
    <ModalShell
      open={open}
      title="New customer"
      onClose={handleCancel}
      widthClassName="w-[600px] max-w-[92vw]"
    >
      <form className="space-y-1 mt-[-10px]">
        <div>
          <FormField
            label="Name"
            placeholder="Enter name"
            value={values.name}
            onChange={(next) => setField("name", next)}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.name}</p>
          )}
        </div>

        
        <div>
          <FormField
            label="Phone number"
            placeholder="Enter phone number"
            value={values.phoneNumber}
            onChange={(next) => setField("phoneNumber", next)}
            type="text"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.phoneNumber}</p>
          )}
        </div>

        
        <div>
          <FormField
            label="Email"
            placeholder="Enter email address"
            value={values.email}
            onChange={(next) => setField("email", next)}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.email}</p>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  onClick: handleCancel,
                  variant: "secondary",
                },
                {
                  label: "Add customer",
                  onClick: handleSubmit,
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}