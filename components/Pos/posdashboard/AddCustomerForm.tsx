"use client";

import AddCustomerModal, {
  CustomerFormValues,
} from "@/app/components/Admin/common/AddCustomerModal";


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
  const handleAdminSubmit = (values: CustomerFormValues) => {
    // pos logic here
    console.log("Pos customer:", values);

    onSubmit?.(values);

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