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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  


    return (
        <ModalShell
        open={open}
        title="New customer"
        onClose={onClose}
        widthClassName="w-[600px] max-w-[92vw]"
        >
        <form className="space-y-1 mt-[-4]">
            
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
        </form>.
        </ModalShell>
  );
}