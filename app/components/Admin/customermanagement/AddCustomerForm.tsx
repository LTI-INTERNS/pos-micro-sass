"use client";

import AddCustomerModal, {
  CustomerFormValues,
} from "@/app/components/Admin/common/AddCustomerModal";

type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddCustomerForm({
  open,
  onClose,
}: AddCustomerFormProps) {
  const handleAdminSubmit = (values: CustomerFormValues) => {
    // 🔹 Admin-specific logic here
    console.log("Admin customer:", values);

    // API call / DB save can go here

    onClose();
  };

  return (
    <AddCustomerModal
      open={open}
      onClose={onClose}
      onSubmit={handleAdminSubmit}
    />
  );
}