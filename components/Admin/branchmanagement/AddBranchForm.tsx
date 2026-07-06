"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
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
  });

  const [showPassword, setShowPassword] = React.useState(false);

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
    else if (!/[a-zA-Z]/.test(values.name)) newErrors.name = "Name must contain at least one letter (only numbers not allowed)";
    else if (values.name.length > 15) newErrors.name = "Name must be less than or equal to 15 characters";

    if (!values.city.trim()) newErrors.city = "City is required";
    else if (!/[a-zA-Z]/.test(values.city)) newErrors.city = "City must contain at least one letter (only numbers not allowed)";

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
    else if (!/[a-zA-Z]/.test(values.address)) newErrors.address = "Address must contain at least one letter (only numbers not allowed)";

    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = "Please enter a valid email address";
    else if (/[A-Z]/.test(values.email)) newErrors.email = "Email must contain lowercase letters only";

    if (
      values.registrationNumber.trim() && 
      (!/[a-zA-Z]/.test(values.registrationNumber) || !/\d/.test(values.registrationNumber))
    ) {
      newErrors.registrationNumber = "Registration Number must contain at least one letter and one number";
    }

    if (!values.password) newErrors.password = "Password is required";
    else if (values.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // THE FIX: Wait for the API to confirm success before wiping the form data
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit(values);
        // onSubmit is only awaited if it succeeds. If validation fails in the parent,
        // it throws, this code is skipped, and the modal stays open!
        resetForm();
        onClose(); 
      } catch {
        // Validation/API error occurred. Form data is preserved.
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
    });
    setShowPassword(false);
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
            onChange={(next) => setField("email", next.toLowerCase())}
            type="email"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="space-y-2">
            <label className="text-[12px] text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Enter Password"
                className="w-full rounded-full border border-gray-200 px-4 py-2 pr-11 outline-none text-gray-800 placeholder:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 px-3">{errors.password}</p>
          )}
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