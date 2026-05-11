"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AddCustomerModal, {
  CustomerFormValues,
} from "@/components/Admin/common/AddCustomerModal";
import { customerService } from "@/lib/services/customer-service";


type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (customer: CustomerFormValues) => void; 
};

export default function AddCustomerForm({
  open,
  onClose,
  onSubmit
}: AddCustomerFormProps) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminSubmit = async (values: CustomerFormValues) => {
    const branchId = session?.user?.branchId ?? "";
    if (!branchId) {
      setError("No branch assigned to your account. Contact an administrator.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const createdCustomer = await customerService.create({
        branchId,
        name: values.name,
        phoneNumber1: values.phoneNumber1,
        phoneNumber2: values.phoneNumber2 || undefined,
        email: values.email || undefined,
        promocard: values.promocard || undefined,
      });

      onSubmit?.({
        name: createdCustomer.name,
        email: createdCustomer.email ?? undefined,
        promocard: createdCustomer.promoCard ?? undefined,
        activeState: createdCustomer.activeState,
        phoneNumber1: createdCustomer.phone,
        phoneNumber2: createdCustomer.phones[0]?.phone2 ?? undefined,
      });

      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add customer. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="fixed inset-x-0 top-20 z-60 mx-auto max-w-sm rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 shadow">
          {error}
        </div>
      )}

      <AddCustomerModal
        open={open}
        onClose={() => {
          setError(null);
          onClose();
        }}
        onSubmit={handleAdminSubmit}
        submitLabel={submitting ? "Adding..." : "Add Customer"}
      />
    </>
  );
}