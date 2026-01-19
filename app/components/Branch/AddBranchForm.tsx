"use client";

import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";
import FormField from "@/app/components/Dashboard/common/FormField";

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
    return (
        <ModalShell 
            open={open} 
            title="New Branch" 
            onClose={onClose} 
            widthClassName="w-[700px] max-w-[92vw]">

        </ModalShell>
    );
}