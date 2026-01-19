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


    return (
        <ModalShell 
            open={open} 
            title="New Branch" 
            onClose={onClose} 
            widthClassName="w-[700px] max-w-[92vw]">

        </ModalShell>
    );
}