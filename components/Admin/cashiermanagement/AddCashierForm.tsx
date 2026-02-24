"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

type FormValues = {
  name: string;
  number: string;
  displayName: string;
  branchName: string;
  email: string;
  password: string;
  pin: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AddCashierFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddCashierForm({ isOpen, onClose }: AddCashierFormProps) {
  const [formValues, setFormValues] = React.useState<FormValues>({
    name: "",
    number: "",
    displayName: "",
    branchName: "",
    email: "",
    password: "",
    pin: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (name: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const setNumericField = (
    name: "number" | "pin",
    value: string,
    maxLength?: number
  ) => {
    let digitsOnly = value.replace(/\D/g, "");

    if (maxLength) {
      digitsOnly = digitsOnly.slice(0, maxLength);
    }

    setField(name, digitsOnly);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formValues.name.trim().length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    if (!formValues.number.trim()) {
      newErrors.number = "Number is required";
    }

    if (!formValues.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (!formValues.branchName) {
      newErrors.branchName = "Please select a branch";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formValues.pin) {
      newErrors.pin = "PIN is required";
    } else if (!/^\d{4,6}$/.test(formValues.pin)) {
      newErrors.pin = "PIN must be 4–6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      number: "",
      displayName: "",
      branchName: "",
      email: "",
      password: "",
      pin: "",
    });
    setErrors({});
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Form submitted:", formValues);
      resetForm();
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalShell open={isOpen} title="Add New Cashier" onClose={handleCancel}>
      <div className="space-y-2 mt-[-4px]">
        <FormField
          label="Name"
          placeholder="Enter name"
          value={formValues.name}
          onChange={(val) => setField("name", val)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 px-3">{errors.name}</p>
        )}

        <FormField
          label="Number"
          placeholder="Enter Number"
          value={formValues.number}
          onChange={(val) => setNumericField("number", val)}
        />
        {errors.number && (
          <p className="text-xs text-red-500 px-3">{errors.number}</p>
        )}

        <FormField
          label="Display Name"
          placeholder="Enter display name"
          value={formValues.displayName}
          onChange={(val) => setField("displayName", val)}
        />
        {errors.displayName && (
          <p className="text-xs text-red-500 px-3">{errors.displayName}</p>
        )}

        <FormField
          label="Branch Name"
          placeholder="Select Branch"
          value={formValues.branchName}
          onChange={(val) => setField("branchName", val)}
          type="dropdown"
          options={[
            { value: "branch-a", label: "Branch A" },
            { value: "branch-b", label: "Branch B" },
            { value: "branch-c", label: "Branch C" },
          ]}
        />
        {errors.branchName && (
          <p className="text-xs text-red-500 px-3">{errors.branchName}</p>
        )}

        <FormField
          label="Email"
          placeholder="Enter Email"
          value={formValues.email}
          onChange={(val) => setField("email", val)}
        />
        {errors.email && (
          <p className="text-xs text-red-500 px-3">{errors.email}</p>
        )}

        <FormField
          label="Password"
          placeholder="Enter Password"
          value={formValues.password}
          onChange={(val) => setField("password", val)}
          type="password"
        />
        {errors.password && (
          <p className="text-xs text-red-500 px-3">{errors.password}</p>
        )}
        
        <FormField
          label="PIN"
          placeholder="Enter PIN"
          value={formValues.pin}
          onChange={(val) => setNumericField("pin", val, 6)}
          type="password"
        />
        {errors.pin && (
          <p className="text-xs text-red-500 px-3">{errors.pin}</p>
        )}

        <div className="flex justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  onClick: handleCancel,
                  variant: "secondary",
                },
                {
                  label: "Save",
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