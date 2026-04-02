"use client";

import React, { useRef } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { Order } from "@/lib/services";

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order | null;
};

export default function OrderBillModal({ open, onClose, order }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current || !order) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Bill #${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #111827;
              background: #ffffff;
              
            }
            .bill-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e5e7eb;
              padding: 24px;
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin-top: 6px;
              color: #6b7280;
              font-size: 14px;
            }
            .meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px 24px;
              margin-bottom: 24px;
              font-size: 14px;
            }
            .meta-item {
              padding: 6px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .summary {
              margin-top: 24px;
              display: flex;
              justify-content: flex-end;
            }
            .summary-box {
              width: 280px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
              font-size: 14px;
            }
            .summary-row.total {
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              margin-top: 32px;
              text-align: center;
              font-size: 13px;
              color: #6b7280;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!order) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={`Order Bill - #${order.id}`}
      widthClassName="w-[820px] max-w-[95vw]"
    >
      <div className="space-y-4">
        <div
          ref={printRef}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black">Order Bill</h1>
            <p className="mt-1 text-sm text-black">
              Generated order receipt
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-black">
            <div className="border-b border-gray-100 pb-2">
              <strong>Order ID:</strong> #{order.id}
            </div>
            <div className="border-b border-gray-100 pb-2">
              <strong>Date & Time:</strong> {order.dateTime ?? "-"}
            </div>
            <div className="border-b border-gray-100 pb-2">
              <strong>Branch:</strong> {order.branch ?? "-"}
            </div>
            <div className="border-b border-gray-100 pb-2">
              <strong>Cashier:</strong> {order.cashier ?? "-"}
            </div>
            <div className="border-b border-gray-100 pb-2">
              <strong>Payment Type:</strong> {order.paymenttype ?? "-"}
            </div>
            <div className="border-b border-gray-100 pb-2">
              <strong>Status:</strong> {order.status ?? "-"}
            </div>
          </div>

          <div className="mt-8 flex justify-end text-black">
            <div className="w-full max-w-[320px] space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
                <span>Total Amount</span>
                <span className="font-semibold">
                  {order.totalamount !== undefined
                    ? `LKR ${order.totalamount.toFixed(2)}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-gray-500">
            <p>Thank you for your purchase</p>
            <p>Generated by your POS system</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[420px]">
            <PopupActions
              actions={[
                { label: "Close", onClick: onClose, variant: "secondary" },
                {
                  label: "Print / Save PDF",
                  onClick: handlePrint,
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}