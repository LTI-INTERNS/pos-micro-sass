"use client";

import React from "react";
import Image from "next/image";

export type ReceiptDisplayProps = {
  headerText?: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;
  customerDetails?: string;
  storeName: string;
  branchName: string;
  cashierName: string;
  telephone: string;
  logoUrl: string | null;
  orderId: string;
  date: string;
  time: string;
  items: { name: string; qty: number; price: number }[];
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashPaid?: number;
  cardPaid?: number;
  format: (value: number) => string;
};

export default function ReceiptDisplay({
  headerText,
  footerMessage,
  showLogo,
  showTaxNumber,
  taxNumber,
  showCustomerDetails,
  customerDetails,
  storeName,
  branchName,
  cashierName,
  telephone,
  logoUrl,
  orderId,
  date,
  time,
  items,
  discount,
  tax,
  total,
  paymentMethod,
  cashPaid,
  cardPaid,
  format,
}: ReceiptDisplayProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = (cashPaid || 0) - total;
  const itemsCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="font-mono text-xs leading-relaxed space-y-2">

      {/* Store Header */}
      <div className="pb-2 border-b border-gray-300">
        <div className="flex items-center justify-center gap-3 mb-2">
          {showLogo && (
            logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={48} 
                height={48}
                className="rounded-full object-cover flex-shrink-0"
                priority={true}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-500 rounded-full text-xs font-semibold flex-shrink-0">
                LOGO
              </div>
            )
          )}
          <div className="text-center">
            <h2 className="text-[14px] font-bold uppercase tracking-wide text-gray-900">
              {storeName}
            </h2>

            {/* Branch */}
            {branchName && (
              <p className="text-gray-600 text-xs">
                {branchName}
              </p>
            )}

            {/* Optional header text */}
            {headerText && (
              <p className="text-gray-600 text-xs">
                {headerText}
              </p>
            )}
          </div>
        </div>
        
        {telephone && (
          <p className="text-gray-600 text-xs text-center">Tel: {telephone}</p>
        )}
      </div>

      {/* Transaction Info */}
      <div className="text-center space-y-1 py-2 border-b border-gray-300 text-gray-700">
        <p>
          <span className="font-semibold">Order:</span> {orderId}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {date}
        </p>
        <p>
          <span className="font-semibold">Time:</span> {time}
        </p>
        <p>
          <span className="font-semibold">Cashier:</span> {cashierName}
        </p>
        <p className="text-gray-600">Items: {itemsCount}</p>
      </div>

      {/* Customer Details */}
      {showCustomerDetails && customerDetails && (
        <div className="text-center py-2 border-b border-gray-300">
          <p className="font-semibold text-gray-800 mb-1">Customer</p>
          <p className="text-gray-700">{customerDetails}</p>
        </div>
      )}

      {/* Items */}
      <div className="py-2 border-b border-gray-300">
        <div className="space-y-1 mb-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-2 text-gray-800">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">
                  x{item.qty} @ {format(item.price)}
                </p>
              </div>
              <div className="text-right whitespace-nowrap font-semibold">
                {format(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-gray-700 pt-1 border-t border-gray-200">
          <span>Subtotal</span>
          <span className="font-semibold">{format(subtotal)}</span>
        </div>
      </div>

      {/* Totals */}
      <div className="py-2 border-b border-gray-300 space-y-1">
        {discount > 0 && (
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Discount</span>
            <span className="text-green-700 font-semibold">-{format(discount)}</span>
          </div>
        )}
        {tax > 0 && (
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Tax (VAT)</span>
            <span className="font-semibold">{format(tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-900 pt-1 border-t border-gray-300">
          <span className="font-bold text-sm">TOTAL</span>
          <span className="font-bold text-sm">{format(total)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="py-2 border-b border-gray-300 space-y-1 text-gray-700">
        <div className="font-medium text-gray-900">
          Payment Method: {paymentMethod}
        </div>
        {cashPaid !== undefined && cashPaid > 0 && (
          <>
            <div className="flex justify-between">
              <span>Cash Received</span>
              <span className="font-semibold">{format(cashPaid)}</span>
            </div>
            {change !== 0 && (
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="font-medium">Change</span>
                <span className="font-semibold">{format(Math.max(change, 0))}</span>
              </div>
            )}
          </>
        )}
        {cardPaid !== undefined && cardPaid > 0 && (
          <div className="flex justify-between">
            <span>Card Amount</span>
            <span className="font-semibold">{format(cardPaid)}</span>
          </div>
        )}
      </div>

      {/* Tax Number */}
      {showTaxNumber && taxNumber && (
        <div className="text-center py-2 border-b border-gray-300">
          <p className="text-gray-700">
            <span className="font-semibold">Tax ID:</span> {taxNumber}
          </p>
        </div>
      )}

      {/* Footer Message */}
      {footerMessage && (
        <div className="text-center py-2 space-y-1">
          <p className="text-gray-700 font-medium">{footerMessage}</p>
        </div>
      )}

      {/* Receipt Footer */}
      <div className="text-center pt-2 border-t border-gray-300">
        <p className="text-gray-600 text-xs">Thank you for your purchase!</p>
        <p className="text-gray-500 text-xs mt-1">
          Please keep this receipt for your records
        </p>
        <p className="text-gray-500 text-xs mt-2 font-mono">
          Receipt printed: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}