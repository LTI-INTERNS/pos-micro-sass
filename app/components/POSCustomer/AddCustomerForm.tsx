"use client";

import AddCustomerModal, {
  CustomerFormValues,
} from "@/app/components/Dashboard/common/AddCustomerModal";

type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
  // Pass a function to handle selected customer
  onSelectCustomer: (customer: CustomerFormValues) => void;
};

export default function AddCustomerForm({
  open,
  onClose,
  onSelectCustomer,
}: AddCustomerFormProps) {
  const handlePosSubmit = (values: CustomerFormValues) => {
    // attach customer to current bill
    onSelectCustomer(values); 
    onClose(); 
  };

  return (
    <AddCustomerModal
      open={open}
      onClose={onClose}
      onSubmit={handlePosSubmit}
    />
  );
}
