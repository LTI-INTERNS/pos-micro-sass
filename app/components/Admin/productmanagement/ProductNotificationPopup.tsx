"use client";

import * as React from "react";
import {
  Package,
  Store,
  User,
  Tag,
  Percent,
  Receipt,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import ModalShell from "../common/ModalShell";

export type ProductNotifyValues = {
  name: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
  branchName: string;
  branchManager: string;
};

export type ProductNotifySubmit = ProductNotifyValues & {
  description: string;
  action: "APPROVED" | "REJECTED";
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues: ProductNotifyValues | null;
  onSave: (values: ProductNotifySubmit) => void;
};

type ActionMode = null | "APPROVE" | "REJECT";

function InfoTile({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
        highlight
          ? "bg-orange-50 border-orange-200"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          highlight ? "bg-orange-100 text-orange-500" : "bg-white text-gray-400 border border-gray-200"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p
          className={`text-sm font-semibold truncate ${
            highlight ? "text-orange-600" : "text-gray-800"
          }`}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function ProductNotificationPopup({
  open,
  onClose,
  onSave,
  initialValues,
}: Props) {
  const [mode, setMode] = React.useState<ActionMode>(null);
  const [description, setDescription] = React.useState("");
  const [descError, setDescError] = React.useState("");
  const [submitted, setSubmitted] = React.useState<"APPROVED" | "REJECTED" | null>(null);

  // Reset state every time popup opens
  React.useEffect(() => {
    if (open) {
      setMode(null);
      setDescription("");
      setDescError("");
      setSubmitted(null);
    }
  }, [open]);

  if (!open || !initialValues) return null;

  const validateReject = () => {
    if (!description.trim()) {
      setDescError("A reason is required when rejecting a product request.");
      return false;
    }
    if (description.trim().length < 10) {
      setDescError("Please provide a more detailed reason (at least 10 characters).");
      return false;
    }
    setDescError("");
    return true;
  };

  const handleApprove = () => {
    onSave({ ...initialValues, description: "", action: "APPROVED" });
    setSubmitted("APPROVED");
  };

  const handleReject = () => {
    if (!validateReject()) return;
    onSave({ ...initialValues, description: description.trim(), action: "REJECTED" });
    setSubmitted("REJECTED");
  };

  const handleClose = () => {
    setMode(null);
    onClose();
  };

  const price = parseFloat(initialValues.price) || 0;
  const discount = parseFloat(initialValues.discount) || 0;
  const tax = parseFloat(initialValues.tax) || 0;
  const discountedPrice = price - (price * discount) / 100;
  const finalPrice = discountedPrice + (discountedPrice * tax) / 100;

  if (submitted) {
    const isApproved = submitted === "APPROVED";
    return (
      <ModalShell
        open={open}
        title="Product Request"
        onClose={handleClose}
        widthClassName="w-[480px] max-w-[92vw]"
      >
        <div className="py-6 flex flex-col items-center gap-4 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isApproved ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isApproved ? (
              <CheckCircle2 size={32} className="text-green-500" />
            ) : (
              <XCircle size={32} className="text-red-500" />
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {isApproved ? "Product Approved!" : "Request Rejected"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isApproved
                ? `"${initialValues.name}" has been approved and is now active.`
                : `The request from ${initialValues.branchName} has been rejected with a reason.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="mt-2 px-8 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      open={open}
      title="Product Approval Request"
      onClose={handleClose}
      widthClassName="w-[780px] max-w-[92vw]"
    >
      <div className="space-y-5">

        <div className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Store size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
              Request Origin
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-orange-700">
                {initialValues.branchName}
              </p>
              <ChevronRight size={12} className="text-orange-300" />
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-orange-400" />
                <p className="text-sm text-orange-600">{initialValues.branchManager}</p>
              </div>
            </div>
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-200 text-orange-700 uppercase tracking-widest">
            Pending
          </span>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
            Product Details
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="col-span-2 sm:col-span-3">
              <InfoTile
                icon={<Package size={15} />}
                label="Product Name"
                value={initialValues.name}
                highlight
              />
            </div>
            <InfoTile
              icon={<Tag size={15} />}
              label="Unit Price"
              value={`Rs. ${parseFloat(initialValues.price).toLocaleString()}`}
            />
            <InfoTile
              icon={<Percent size={15} />}
              label="Discount"
              value={`${initialValues.discount}%`}
            />
            <InfoTile
              icon={<Receipt size={15} />}
              label="Tax"
              value={`${initialValues.tax}%`}
            />
            <InfoTile
              icon={<Layers size={15} />}
              label="Stock"
              value={`${initialValues.stock} units`}
            />

            <div className="col-span-2">
              <div className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 border border-gray-800">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Final Price (after discount + tax)
                  </p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    Rs. {finalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  {discount > 0 && (
                    <p className="text-xs text-gray-500 line-through">
                      Rs. {price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-green-400 font-semibold">
                    {discount > 0 ? `${discount}% off` : "No discount"}
                  </p>
                </div>
              </div>
            </div>

            {parseInt(initialValues.stock) < 5 && (
              <div className="col-span-2 sm:col-span-3 flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-2.5">
                <AlertCircle size={15} className="text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700 font-medium">
                  Low stock alert — only{" "}
                  <span className="font-bold">{initialValues.stock} units</span> requested.
                  Confirm this is intentional.
                </p>
              </div>
            )}
          </div>
        </div>

        {mode === null && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
              Decision
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("APPROVE")}
                className="flex items-center justify-center gap-2.5 rounded-xl py-3.5 border-2 border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 hover:border-green-300 transition-all active:scale-95"
              >
                <CheckCircle2 size={18} className="text-green-500" />
                Approve Product
              </button>
              <button
                type="button"
                onClick={() => setMode("REJECT")}
                className="flex items-center justify-center gap-2.5 rounded-xl py-3.5 border-2 border-red-200 bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 hover:border-red-300 transition-all active:scale-95"
              >
                <XCircle size={18} className="text-red-400" />
                Reject Request
              </button>
            </div>
          </div>
        )}

        {mode === "APPROVE" && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <p className="text-sm font-semibold text-green-800">
                Confirm Approval
              </p>
            </div>
            <p className="text-xs text-green-700 leading-relaxed">
              You are about to approve{" "}
              <span className="font-bold">"{initialValues.name}"</span> from{" "}
              <span className="font-bold">{initialValues.branchName}</span>. This
              product will become active and available for sale immediately.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="flex-1 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all active:scale-95"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        )}

        {mode === "REJECT" && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-red-500" />
              <p className="text-sm font-semibold text-red-800">
                Rejection Reason
              </p>
              <span className="ml-auto text-[10px] font-bold text-red-400 uppercase tracking-widest">
                Required
              </span>
            </div>
            <p className="text-xs text-red-600">
              Provide a clear reason so{" "}
              <span className="font-semibold">{initialValues.branchManager}</span>{" "}
              can make the necessary corrections.
            </p>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descError) setDescError("");
              }}
              placeholder="e.g. Price is inconsistent with current market rates. Please revise and resubmit."
              rows={4}
              maxLength={500}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 resize-none outline-none transition-all
                ${
                  descError
                    ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                    : "border-red-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                }`}
            />

            <div className="flex items-start justify-between gap-2">
              <div>
                {descError && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{descError}</p>
                  </div>
                )}
              </div>
              <p
                className={`text-[10px] flex-shrink-0 ${
                  description.length > 450 ? "text-red-400" : "text-gray-400"
                }`}
              >
                {description.length}/500
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setMode(null); setDescError(""); }}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject & Notify
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}