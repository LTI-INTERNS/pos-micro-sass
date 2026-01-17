"use client";

import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import FormField from "@/app/components/Dashboard/common/FormField";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

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
    pin: ""
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (name: keyof FormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formValues.name.trim().length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    // Number validation
    if (!formValues.number.trim()) {
      newErrors.number = "Number is required";
    } else if (!/^\d+$/.test(formValues.number)) {
      newErrors.number = "Number must contain only digits";
    }

    // Display Name validation
    if (!formValues.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    // Branch Name validation
    if (!formValues.branchName.trim()) {
      newErrors.branchName = "Branch name is required";
    }

    // Email validation
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // PIN validation
    if (!formValues.pin) {
      newErrors.pin = "PIN is required";
    } else if (!/^\d{4,6}$/.test(formValues.pin)) {
      newErrors.pin = "PIN must be 4-6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ModalShell
      open={isOpen}
      title="Add New Cashier"
      onClose={handleCancel}
      
    >

    </ModalShell>
     );
}