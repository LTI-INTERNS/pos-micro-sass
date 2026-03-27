"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import ImageUploader from "@/components/Admin/common/ImageUploader";

type FormValues = {
  name: string;
  number: string;
  branchName: string;
  email: string;
  pin: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AddCashierFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddCashierForm({ isOpen, onClose }: AddCashierFormProps) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "";
  const branchName = session?.user?.branchName ?? "";

  // Only OWNER and ADMIN can select a branch; MANAGER is locked to their own branch
  const canSelectBranch = role === "OWNER" || role === "ADMIN";

  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);

  const [formValues, setFormValues] = React.useState<FormValues>({
    name: "",
    number: "",
    branchName: canSelectBranch ? "" : branchName,
    email: "",
    pin: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  // Reset form when popup opens
  React.useEffect(() => {
    if (!isOpen) return;
    setFormValues({
      name: "",
      number: "",
      branchName: canSelectBranch ? "" : branchName,
      email: "",
      pin: "",
    });
    setProfileImageUrl(null);
    setErrors({});
  }, [isOpen, canSelectBranch, branchName]);

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

    if (!formValues.branchName) {
      newErrors.branchName = "Please select a branch";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
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
      branchName: canSelectBranch ? "" : branchName,
      email: "",
      pin: "",
    });
    setProfileImageUrl(null);
    setErrors({});
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Form submitted:", { ...formValues, profileImageUrl });
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

        {/* Profile Image */}
        <ImageUploader
          shape="circle"
          label="Avatar"
          hint="Cashier profile image"
          value={profileImageUrl}
          onChange={(url) => setProfileImageUrl(url)}
        />

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
          label="Cashier No"
          placeholder="Enter Number"
          value={formValues.number}
          onChange={(val) => setNumericField("number", val)}
        />
        {errors.number && (
          <p className="text-xs text-red-500 px-3">{errors.number}</p>
        )}

        {/* Branch: selectable for OWNER / ADMIN; locked for MANAGER */}
        <div>
          <FormField
            label="Branch Name"
            placeholder={canSelectBranch ? "Select Branch" : branchName}
            value={formValues.branchName}
            onChange={(val) => canSelectBranch && setField("branchName", val)}
            type="dropdown"
            disabled={!canSelectBranch}
            options={[
              { value: "branch-a", label: "Branch A" },
              { value: "branch-b", label: "Branch B" },
              { value: "branch-c", label: "Branch C" },
            ]}
          />
          {!canSelectBranch && (
            <p className="text-xs text-gray-400 px-3 mt-1">
              Cashiers are added to your branch only.
            </p>
          )}
          {errors.branchName && (
            <p className="text-xs text-red-500 px-3">{errors.branchName}</p>
          )}
        </div>

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