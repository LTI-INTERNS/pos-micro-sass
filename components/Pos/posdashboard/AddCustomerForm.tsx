"use client";

import { useState } from "react";
import AddCustomerModal, { CustomerFormValues } from "@/components/Admin/common/AddCustomerModal";
import { customerService } from "@/lib/services/customer-service";

type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (customer: CustomerFormValues) => void; 
};

export default function AddCustomerForm({ open, onClose, onSubmit }: AddCustomerFormProps) {
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handleSubmit = async (values: CustomerFormValues) => {
    setSaving(true);
    setError(null);
    try {
      // Save to backend
      await customerService.create({
        name:   values.name,
        phone:  values.phoneNumber,
        phone2: values.phoneNumber2 ?? undefined,
        email:  values.email        ?? undefined,
      });

      // Pass back to POS panel to auto-select the new customer
      onSubmit?.(values);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save customer. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AddCustomerModal
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel={saving ? "Saving…" : "Add Customer"}
      />
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white text-sm px-5 py-3 rounded-full shadow-lg">
          {error}
        </div>
      )}
    </>
  );
}