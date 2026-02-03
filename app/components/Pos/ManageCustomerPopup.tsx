"use client";

import { useState } from "react";
import ManageCustomer from "./ManageCustomer";
import AddCustomerForm from "./posdashboard/AddCustomerForm";
import { CustomerFormValues } from "@/app/components/Admin/common/AddCustomerModal";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Props = {
  onClose: () => void;
  onCustomerSelected: (customer: CustomerFormValues) => void;
};

export default function ManageCustomersPopup({
  onClose,
  onCustomerSelected,
}: Props) {
  const [showManage, setShowManage] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {showManage && (
        <ManageCustomer
          onClose={onClose}
          onAddCustomer={() => {
            setShowManage(false);
            setShowAdd(true);
          }}
          onCustomerSelected={(customer: Customer) => {
            
            onCustomerSelected({
              name: customer.name,
              phoneNumber: customer.phone,
              email: customer.email,
            });
            onClose();
          }}
        />
      )}

      <AddCustomerForm
        open={showAdd}
        onClose={onClose}
        onSubmit={(customer) => {
          // Already CustomerFormValues
          onCustomerSelected(customer);
          onClose();
        }}
      />
    </div>
  );
}
