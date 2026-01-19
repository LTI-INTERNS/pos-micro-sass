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

    return (
        <ModalShell
        open={open}
        title="New customer"
        onClose={onClose}
        widthClassName="w-[600px] max-w-[92vw]"
        >
        </ModalShell>
  );
}