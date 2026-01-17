"use client";

import * as React from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import FormField from "@/app/components/Dashboard/common/FormField";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

type AddCashierFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddCashierForm({ isOpen, onClose }: AddCashierFormProps) {
  return (
    <ModalShell
      open={isOpen}
      title="Add New Cashier"
      onClose={handleCancel}
      
    >

    </ModalShell>
     );
}