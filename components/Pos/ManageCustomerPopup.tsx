"use client";

import { useState } from "react";
import ManageCustomer from "@/components/Pos/ManageCustomer";
import AddCustomerForm from "@/components/Pos/posdashboard/AddCustomerForm";
import { CustomerFormValues } from "@/components/Admin/common/AddCustomerModal";
import type { Customer } from "@/types/customer.types";

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
              phoneNumber1: customer.phone,
              phoneNumber2: customer.phones[0]?.phone2 ?? undefined,
              email: customer.email ?? undefined,
              promocard: customer.promoCard ?? undefined,
              activeState: customer.activeState,
            });
            onClose();
          }}
        />
      )}

      <AddCustomerForm
        open={showAdd}
        onClose={onClose}
        onSubmit={(customer) => {
          onCustomerSelected(customer);
          onClose();
        }}
      />
    </div>
  );
}
