import React from "react";
import OrderConfirmation from "./OrderConfirmation";
import type { PaymentSummary } from "./posdashboard/OrderPaymentModal";
import type { ConfirmItem } from "./OrderConfirmation";

type Props = {
  open: boolean;
  onClose: () => void;
  items: ConfirmItem[];
  payment: PaymentSummary;
  customerEmail?: string | null;
  onCancelEdit?: () => void;
  onConfirm?: (email?: string) => void;
};

export const OrderConfirmationPopup = (props: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <OrderConfirmation {...props} />
    </div>
  );
};