import React from "react";
import OrderConfirmation from "@/components/Pos/OrderConfirmation";
import type { PaymentSummary } from "@/components/Pos/posdashboard/OrderPaymentModal";
import type { ConfirmItem } from "@/components/Pos/OrderConfirmation";

type Props = {
  open: boolean;
  onClose: () => void;
  items: ConfirmItem[];
  payment: PaymentSummary;
  customerEmail?: string | null;
  onCancelEdit?: () => void;
  onConfirm?: (email?: string, note?: string) => void;
};

export const OrderConfirmationPopup = (props: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <OrderConfirmation {...props} />
    </div>
  );
};