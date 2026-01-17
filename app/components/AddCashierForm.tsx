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
  
  return (
    <ModalShell
      open={isOpen}
      title="Add New Cashier"
      onClose={handleCancel}
      
    >

    </ModalShell>
     );
}