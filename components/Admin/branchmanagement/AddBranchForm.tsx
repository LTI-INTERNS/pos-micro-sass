"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import FormField from "@/components/Admin/common/FormField";


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
      branchId: branchId,
      name: "",
      phoneNumber: "",
      address: "",
      registrationNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };


  return (
    <ModalShell
      open={open}
      title="New Branch"
      onClose={handleCancel}
      widthClassName="w-[700px] max-w-[92vw]">
      <form className="space-y-0.5 mt-[-10px]">
        <div className="space-y-1">
          <label className="text-[12px] text-gray-500">ID</label>
          <input
            type="text"
            value={values.branchId}
            disabled
            className="
                        w-full rounded-full border border-gray-200 px-4 py-2 outline-none
                        bg-gray-100 text-gray-400 cursor-not-allowed
                        placeholder:text-gray-300
                    "
          />
        </div>

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
            type="tel"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <FormField
            label="Address"
            placeholder="Enter Address"
            value={values.address}
            onChange={(next) => setField("address", next)}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.address}</p>
          )}
        </div>

        <div>
          <FormField
            label="Registration Number (Optional)"
            placeholder="Enter Registration Number"
            value={values.registrationNumber}
            onChange={(next) => setField("registrationNumber", next)}
          />
          {errors.registrationNumber && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.registrationNumber}</p>
          )}
        </div>

        <div>
          <FormField
            label="Email"
            placeholder="Enter email address"
            value={values.email}
            onChange={(next) => setField("email", next)}
            type="email"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormField
              label="Password"
              placeholder="Enter Password"
              value={values.password}
              onChange={(next) => setField("password", next)}
              type="password"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 px-3">{errors.password}</p>
            )}
          </div>

          <div>
            <FormField
              label="Confirm Password"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={(next) => setField("confirmPassword", next)}
              type="password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 px-3">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

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
                  label: "Add Branch",
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