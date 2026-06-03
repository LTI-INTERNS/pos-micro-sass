"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import FormField from "@/components/Admin/common/FormField";

type FormValues = {
  branchId: string;
  name: string;
  city: string; 
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
  // THE FIX: Updated type to allow async Promise
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
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
    city: "", 
    phoneNumber: "",
    address: "",
    registrationNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const setField = (name: keyof FormValues, next: string) => {
    if (name === "phoneNumber") {
      next = next.replace(/[^\d+\s]/g, ""); 
    }

    setValues((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) newErrors.name = "Name is required";
    else if (values.name.length > 15) newErrors.name = "Name must be less than or equal to 15 characters";

    if (!values.city.trim()) newErrors.city = "City is required";

    if (values.phoneNumber.trim()) {
      const phoneWithoutSpaces = values.phoneNumber.replace(/\s+/g, "");

      const allowedPrefixes = [
        { code: "+94", len: 9 },
        { code: "+1",  len: 10 },
        { code: "+44", len: 10 },
        { code: "+91", len: 10 },
        { code: "+61", len: 9 },
        { code: "+65", len: 8 },
        { code: "+60", len: 10 },
        { code: "0",   len: 9 },
      ];

      const matchedConfig = allowedPrefixes.find(p => phoneWithoutSpaces.startsWith(p.code));

      if (!matchedConfig) {
        newErrors.phoneNumber = "Phone must start with a valid code (+94, +1, +44, +91, +61, +65, +60 or 0)";
      } else {
        const numberPart = phoneWithoutSpaces.slice(matchedConfig.code.length);
        if (!/^\d+$/.test(numberPart) || numberPart.length !== matchedConfig.len) {
          newErrors.phoneNumber = `For ${matchedConfig.code}, the number must be exactly ${matchedConfig.len} digits long.`;
        }
      }
    } else {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!values.address.trim()) newErrors.address = "Address is required";

    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = "Please enter a valid email address";

    if (
      values.registrationNumber.trim() && 
      (!/[a-zA-Z]/.test(values.registrationNumber) || !/\d/.test(values.registrationNumber))
    ) {
      newErrors.registrationNumber = "Registration Number must contain at least one letter and one number";
    }

    if (!values.password) newErrors.password = "Password is required";
    else if (values.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!values.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (values.password !== values.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // THE FIX: Wait for the API to confirm success before wiping the form data
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit(values);
        resetForm();
      } catch (error) {
        // Failed! Form data stays intact so the user can fix the specific field
      }
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
      city: "", 
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
      widthClassName="w-[700px] max-w-[92vw]"
    >
      <form className="space-y-0.5 mt-[-10px]">
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
            label="City"
            placeholder="Enter city"
            value={values.city}
            onChange={(next) => setField("city", next)}
          />
          {errors.city && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.city}</p>
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
            <p className="text-xs text-red-500 mt-1 px-3">
              {errors.phoneNumber}
            </p>
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
            <p className="text-xs text-red-500 mt-1 px-3">
              {errors.registrationNumber}
            </p>
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
              <p className="text-xs text-red-500 mt-1 px-3">
                {errors.confirmPassword}
              </p>
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
                  // Replaced standard onClick with our new async handleSubmit
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