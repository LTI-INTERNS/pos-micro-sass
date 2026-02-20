"use client";

import * as React from "react";
import { X, CheckCircle2, XCircle, Package, User, Building2, Clock } from "lucide-react";
import type { ProductApprovalData } from "../../../context/NotificationsContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

type Props = {
  open: boolean;
  data: ProductApprovalData | null;
  onClose: () => void;
  onApprove: (productId: number) => void;
  onReject: (productId: number, reason: string) => void;
};

export default function ProductApprovalModal({ open, data, onClose, onApprove, onReject }: Props) {
  const { currency } = useCurrency();
  const [rejecting, setRejecting] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState("");

  React.useEffect(() => {
    if (!open) { setRejecting(false); setReason(""); setReasonError(""); }
  }, [open]);

  if (!open || !data) return null;

  const isAlreadyActioned = data.status !== "pending";

  const handleApprove = () => onApprove(data.id);

  const handleRejectConfirm = () => {
    if (!reason.trim()) { setReasonError("Please provide a rejection reason"); return; }
    onReject(data.id, reason.trim());
  };

  const statusBanner = data.status === "approved" ? (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
      <p className="text-xs font-semibold text-green-700">This product has been approved</p>
    </div>
  ) : data.status === "rejected" ? (
    <div className="flex flex-col gap-1 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
      <div className="flex items-center gap-2">
        <XCircle size={16} className="text-red-500 flex-shrink-0" />
        <p className="text-xs font-semibold text-red-700">This product was rejected</p>
      </div>
      {data.rejectionReason && <p className="text-xs text-red-500 pl-6">Reason: {data.rejectionReason}</p>}
    </div>
  ) : null;

  const DetailRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold ${highlight ? "text-orange-500" : "text-gray-800"}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[560px] overflow-hidden">

        <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-500" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Package size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Product Request</p>
              <h2 className="text-sm font-bold text-gray-900">Approval Required</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {statusBanner}

          <div className="flex items-stretch gap-3">
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Building2 size={14} className="text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Branch</p>
                <p className="text-xs font-semibold text-gray-800">{data.branchName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <User size={14} className="text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Manager</p>
                <p className="text-xs font-semibold text-gray-800">{data.branchManager}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Clock size={14} className="text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Time</p>
                <p className="text-xs font-semibold text-gray-800">{data.submittedAt}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-orange-50 border border-orange-100">
            {data.imageUrl ? (
              <img src={data.imageUrl} alt={data.productName} className="w-14 h-14 rounded-xl object-cover border border-orange-200 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Package size={22} className="text-orange-400" />
              </div>
            )}
            <div>
              <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mb-0.5">Product Name</p>
              <p className="text-base font-bold text-gray-900">{data.productName}</p>
              {data.category && <p className="text-xs text-gray-500">{data.category}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 px-4 py-1">
            <DetailRow
              label="Price"
              value={formatCurrency(parseFloat(data.price), currency)}
              highlight
            />
            <DetailRow label="Discount" value={`${data.discount}%`} />
            <DetailRow label="Tax" value={`${data.tax}%`} />
            <DetailRow label="Stock" value={`${data.stock}${data.unit ? ` ${data.unit}` : " units"}`} />
          </div>

          {data.description && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Description</p>
              <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
            </div>
          )}

          {rejecting && !isAlreadyActioned && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Rejection Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => { setReason(e.target.value); if (reasonError) setReasonError(""); }}
                placeholder="Explain why this product is being rejected..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-800 outline-none resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              {reasonError && <p className="text-xs text-red-500">{reasonError}</p>}
            </div>
          )}
        </div>
        
        {!isAlreadyActioned ? (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            {!rejecting ? (
              <>
                <button type="button" onClick={() => setRejecting(true)}
                  className="flex-1 py-2.5 rounded-full border border-red-300 bg-white text-red-500 text-sm font-semibold hover:bg-red-50 transition-all active:scale-95 cursor-pointer">
                  Reject
                </button>
                <button type="button" onClick={handleApprove}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:brightness-110 transition-all active:scale-95 cursor-pointer shadow-md shadow-orange-200">
                  Approve
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => { setRejecting(false); setReason(""); setReasonError(""); }}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={handleRejectConfirm}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all active:scale-95 cursor-pointer">
                  Confirm Reject
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="w-full py-2.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all active:scale-95 cursor-pointer">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
