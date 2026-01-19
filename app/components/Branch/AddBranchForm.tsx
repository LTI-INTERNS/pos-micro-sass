"use client";

import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";
import FormField from "@/app/components/Dashboard/common/FormField";

type FormValues = {
  branchId: string;
  name: string;
  phoneNumber: string;
  address: string;
  registrationNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AddBranchFormProps = {
  open: boolean;
  onClose: () => void;
  branchId: string;
  onSubmit: (values: Record<string, string>) => void;
};

export default function AddBranchForm({
  open,
  onClose,
  branchId,
  onSubmit,
}: AddBranchFormProps) {
    const [values, setValues] = React.useState<Record<string, string>>({
        branchId: branchId,
        name: "",
        phoneNumber: "",
        address: "",
        registrationNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = React.useState<FormErrors>({});

    React.useEffect(() => {
        setValues((prev) => ({
          ...prev,
          branchId: branchId,
        }));
      }, [branchId]);

    const setField = (name: keyof FormValues, next: string) => {
        setValues((prev) => ({ ...prev, [name]: next }));
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

    // Address validation
    if (!values.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    // Password validation
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


    return (
        <ModalShell 
            open={open} 
            title="New Branch" 
            onClose={onClose} 
            widthClassName="w-[700px] max-w-[92vw]">

        </ModalShell>
    );
}