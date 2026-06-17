"use client";

import * as React from "react";
import Image from "next/image";
import {
  X, CheckCircle2, XCircle, Package,
  User, Building2, Clock, AlertTriangle, ShieldCheck,
} from "lucide-react";
import type { ProductApprovalData } from "@/lib/context/NotificationsContext";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Props = {
  open: boolean;
  data: ProductApprovalData | null;
  onClose: () => void;
  onApprove: (productId: string) => void;
  onReject: (productId: string, reason: string) => void;
  /** Shows a spinner on action buttons while API call is in flight */
  loading?: boolean;
  userRole?: "admin" | "owner" | "manager";
};

type DataWarnings = {
  price?: string;
  discount?: string;
  tax?: string;
  stock?: string;
  productName?: string;
  branchName?: string;
  branchManager?: string;
  submittedBy?: string;
  submittedAt?: string;
};

function validateProductData(data: ProductApprovalData): DataWarnings {
  const w: DataWarnings = {};

  if (!data.productName?.trim())
    w.productName = "Product name is missing.";
  else if (data.productName.trim().length < 2)
    w.productName = "Product name is too short (min 2 chars).";
  else if (data.productName.trim().length > 100)
    w.productName = "Product name is too long (max 100 chars).";

  if (typeof data.price !== "number" || !isFinite(data.price))
    w.price = "Price is not a valid number.";
  else if (data.price <= 0)
    w.price = "Price must be greater than 0.";
  else if (data.price > 1_000_000)
    w.price = "Price cannot exceed 1,000,000.";

  if (typeof data.discount !== "number" || !isFinite(data.discount))
    w.discount = "Discount is not a valid number.";
  else if (data.discount < 0)
    w.discount = "Discount cannot be negative.";
  else if (data.discount > 100)
    w.discount = "Discount cannot exceed 100%.";

  if (typeof data.tax !== "number" || !isFinite(data.tax))
    w.tax = "Tax is not a valid number.";
  else if (data.tax < 0)
    w.tax = "Tax cannot be negative.";
  else if (data.tax > 100)
    w.tax = "Tax cannot exceed 100%.";

  if (typeof data.stock !== "number" || !isFinite(data.stock))
    w.stock = "Stock is not a valid number.";
  else if (!Number.isInteger(data.stock))
    w.stock = "Stock must be a whole number.";
  else if (data.stock < 0)
    w.stock = "Stock cannot be negative.";

  if (!data.branchName?.trim()) w.branchName = "Branch name is missing.";
  if (!data.branchManager?.trim()) w.branchManager = "Branch manager name is missing.";
  if (!data.submittedBy?.trim()) w.submittedBy = "Submitted-by field is missing.";

  if (!data.submittedAt?.trim()) {
    w.submittedAt = "Submission timestamp is missing.";
  } else {
    const ts = Date.parse(data.submittedAt);
    if (isNaN(ts)) w.submittedAt = "Submission timestamp is not a valid date.";
    else if (ts > Date.now() + 60_000) w.submittedAt = "Submission timestamp is in the future.";
  }

  return w;
}

const MIN_REASON = 10;
const MAX_REASON = 500;

function validateReason(value: string): string {
  const t = value.trim();
  if (!t) return "Rejection reason is required.";
  if (t.length < MIN_REASON)
    return `Too short — at least ${MIN_REASON} characters (${t.length}/${MIN_REASON}).`;
  if (t.length > MAX_REASON)
    return `Too long — max ${MAX_REASON} characters (${t.length}/${MAX_REASON}).`;
  return "";
}

function DetailRow({
  label, value, highlight, warning,
}: {
  label: string; value: string; highlight?: boolean; warning?: string;
}) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <div className="text-right">
        <span className={`text-xs font-semibold ${warning ? "text-red-500" : highlight ? "text-orange-500" : "text-gray-800"}`}>
          {value}
        </span>
        {warning && (
          <p className="text-[10px] text-red-400 mt-0.5 flex items-center justify-end gap-1">
            <AlertTriangle size={9} /> {warning}
          </p>
        )}
      </div>
    </div>
  );
}

function AuditRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className="text-[10px] text-gray-600 font-medium">{value}</span>
    </div>
  );
}

export default function ProductApprovalModal({
  open, data, onClose, onApprove, onReject, loading = false, userRole = "admin"
}: Props) {
  const { currency } = useCurrency();

  const [rejecting, setRejecting] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [reasonError, setReasonError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setRejecting(false);
      setReason("");
      setReasonError("");
    }
  }, [open]);

  if (!open || !data) return null;

  const isAlreadyActioned = data.status !== "pending";

  const warnings = validateProductData(data);
  const warningCount = Object.keys(warnings).length;
  const hasWarnings = warningCount > 0;

  const handleApprove = () => onApprove(data.id);

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (reasonError) setReasonError(validateReason(e.target.value));
  };

  const handleRejectConfirm = () => {
    const err = validateReason(reason);
    if (err) { setReasonError(err); return; }
    onReject(data.id, reason.trim());
  };

  const priceDisplay = typeof data.price === "number" && isFinite(data.price)
    ? formatCurrency(data.price, currency) : "—";
  const discountDisplay = typeof data.discount === "number" && isFinite(data.discount)
    ? `${data.discount}%` : "—";
  const taxDisplay = typeof data.tax === "number" && isFinite(data.tax)
    ? `${data.tax}%` : "—";
  const stockDisplay = typeof data.stock === "number" && isFinite(data.stock)
    ? `${data.stock}${data.unit ? ` ${data.unit}` : " units"}` : "—";

  const reviewedAtDisplay = data.reviewedAt
    ? new Date(data.reviewedAt).toLocaleString([], {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
    : undefined;

  const submittedAtDisplay = (() => {
    const ts = Date.parse(data.submittedAt);
    if (isNaN(ts)) return data.submittedAt;
    return new Date(ts).toLocaleString([], {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  })();

  // Status
  const statusBanner =
    data.status === "approved" ? (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-green-700">This product has been approved</p>
          <p className="text-[10px] text-green-500 mt-0.5">
            By {data.reviewerName || data.approvedBy || "Admin"} ({data.reviewerRole || "Administrator"})
          </p>
        </div>
      </div>
    ) : data.status === "rejected" ? (
      <div className="flex flex-col gap-1 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 shadow-sm">
        <div className="flex items-center gap-2">
          <XCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-red-700">This product was rejected</p>
        </div>
        <p className="text-[10px] text-red-400 pl-6">
          By {data.reviewerName || data.rejectedBy || "Admin"} ({data.reviewerRole || "Administrator"})
        </p>
        {data.rejectionReason && (
          <div className="mt-1 pl-6">
            <p className="text-[11px] font-medium text-red-800">Reason:</p>
            <p className="text-[11px] text-red-600 italic">&quot;{data.rejectionReason}&quot;</p>
          </div>
        )}
      </div>
    ) : null;

  // Data warnings 
  const warningsBanner = !isAlreadyActioned && hasWarnings ? (
    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
        <p className="text-xs font-bold text-amber-700">
          {warningCount} data issue{warningCount > 1 ? "s" : ""} found — review before acting
        </p>
      </div>
      {Object.values(warnings).map((msg, i) => (
        <p key={i} className="text-[11px] text-amber-600 pl-5">• {msg}</p>
      ))}
    </div>
  ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[560px] overflow-hidden">

        <div className={`h-1 w-full ${hasWarnings && !isAlreadyActioned
          ? "bg-gradient-to-r from-amber-400 to-amber-500"
          : "bg-gradient-to-r from-orange-400 to-orange-500"}`}
        />

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
          <button
            type="button" onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {statusBanner}
          {warningsBanner}

          <div className="flex items-stretch gap-3">
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Building2 size={14} className={`flex-shrink-0 ${warnings.branchName ? "text-red-400" : "text-orange-400"}`} />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Branch</p>
                <p className={`text-xs font-semibold ${warnings.branchName ? "text-red-500" : "text-gray-800"}`}>
                  {data.branchName || <span className="italic text-gray-400">Missing</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <User size={14} className={`flex-shrink-0 ${warnings.branchManager ? "text-red-400" : "text-orange-400"}`} />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Manager</p>
                <p className={`text-xs font-semibold ${warnings.branchManager ? "text-red-500" : "text-gray-800"}`}>
                  {data.branchManager || <span className="italic text-gray-400">Missing</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <Clock size={14} className={`flex-shrink-0 ${warnings.submittedAt ? "text-red-400" : "text-orange-400"}`} />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Submitted</p>
                <p className={`text-xs font-semibold ${warnings.submittedAt ? "text-red-500" : "text-gray-800"}`}>
                  {submittedAtDisplay}
                </p>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${warnings.submittedBy ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}>
            <ShieldCheck size={13} className={warnings.submittedBy ? "text-red-400" : "text-orange-400"} />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Submitted by</span>
            <span className={`text-xs font-semibold ml-1 ${warnings.submittedBy ? "text-red-500" : "text-gray-700"}`}>
              {data.submittedBy || <span className="italic text-gray-400">Not recorded</span>}
            </span>
          </div>

          <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${warnings.productName ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-100"}`}>
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt={data.productName || "Product Image"}
                width={56}
                height={56}
                className="rounded-xl object-cover border border-orange-200 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Package size={22} className="text-orange-400" />
              </div>
            )}
            <div>
              <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mb-0.5">
                Product Name
              </p>
              <p className={`text-base font-bold ${warnings.productName ? "text-red-600" : "text-gray-900"}`}>
                {data.productName || <span className="italic text-gray-400 text-sm">Name missing</span>}
              </p>
              {warnings.productName && (
                <p className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5">
                  <AlertTriangle size={9} /> {warnings.productName}
                </p>
              )}
              {data.category && <p className="text-xs text-gray-500">{data.category}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 px-4 py-1">
            <DetailRow
              label="Price"
              value={priceDisplay}
              highlight={!warnings.price}
              warning={warnings.price}
            />
            <DetailRow
              label="Discount"
              value={discountDisplay}
              warning={warnings.discount}
            />
            <DetailRow
              label="Tax"
              value={taxDisplay}
              warning={warnings.tax}
            />
            <DetailRow
              label="Stock"
              value={stockDisplay}
              warning={warnings.stock}
            />
          </div>

          {isAlreadyActioned && (data.reviewerName || data.approvedBy || data.rejectedBy || reviewedAtDisplay) && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1 shadow-inner">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                Audit Trail
              </p>
              <AuditRow label="Submitted by" value={data.submittedBy} />
              <AuditRow label="Submitted at" value={submittedAtDisplay} />
              <AuditRow 
                label={data.status === "approved" ? "Approved by" : "Rejected by"} 
                value={`${data.reviewerName || data.approvedBy || data.rejectedBy || "Unknown"} (${data.reviewerRole || "Staff"})`} 
              />
              <AuditRow label="Reviewed at" value={reviewedAtDisplay} />
            </div>
          )}

          {/* New Sections for Brand, Description, and Variants */}
          <div className="space-y-4">
             {(data.brand || data.description) && (
               <div className="grid grid-cols-2 gap-3">
                 {data.brand && (
                   <div className="px-3 py-2 rounded-xl bg-blue-50/50 border border-blue-100">
                     <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">Brand</p>
                     <p className="text-xs font-semibold text-gray-800">{data.brand}</p>
                   </div>
                 )}
                 {data.category && (
                   <div className="px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-100">
                     <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-0.5">Category</p>
                     <p className="text-xs font-semibold text-gray-800">{data.category}</p>
                   </div>
                 )}
               </div>
             )}

             {data.description && (
               <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Description</p>
                 <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
               </div>
             )}

             {data.variants && data.variants.length > 0 && (
               <div className="space-y-2">
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest px-1">
                   Variants ({data.variants.length})
                 </p>
                 <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                   {data.variants.map((v, i) => (
                     <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-orange-200 transition-colors">
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <p className="text-[11px] font-bold text-gray-800 truncate">{v.sku}</p>
                            {v.barcode && <span className="text-[9px] text-gray-400 bg-gray-100 px-1 rounded">#{v.barcode}</span>}
                         </div>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {v.optionValues?.map((ov: { optionName: string; value: string }, idx: number) => (
                             <span key={idx} className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md font-medium">
                               {ov.optionName}: {ov.value}
                             </span>
                           ))}
                         </div>
                       </div>
                       <div className="text-right ml-3">
                         <p className="text-[11px] font-bold text-orange-600">{formatCurrency(Number(v.sellingPrice), currency)}</p>
                         <p className="text-[9px] text-gray-400">{v.sellUnit}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>

          {rejecting && !isAlreadyActioned && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Rejection Reason <span className="text-red-400">*</span>
                </label>
                <span className={`text-[10px] ${reason.trim().length > MAX_REASON ? "text-red-500 font-bold" : "text-gray-400"}`}>
                  {reason.trim().length}/{MAX_REASON}
                </span>
              </div>
              <textarea
                value={reason}
                onChange={handleReasonChange}
                placeholder={`Explain why this product is being rejected (min ${MIN_REASON} characters)…`}
                rows={3}
                className={`w-full rounded-xl border px-4 py-3 text-xs text-gray-800 outline-none resize-none transition-all
                  ${reasonError
                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  }`}
              />
              {reasonError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={11} /> {reasonError}
                </p>
              )}
            </div>
          )}
        </div>

        {!isAlreadyActioned && userRole !== "manager" ? (
          <div className="px-6 py-4 border-t border-gray-100 space-y-3">
            {hasWarnings && !rejecting && (
              <p className="text-[11px] text-amber-600 text-center flex items-center justify-center gap-1">
                <AlertTriangle size={11} />
                Data has {warningCount} issue{warningCount > 1 ? "s" : ""} — review above before approving
              </p>
            )}
            <div className="flex gap-3">
              {!rejecting ? (
                <>
                  <button
                    type="button" onClick={() => setRejecting(true)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-full border border-orange-300 bg-white text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                  <button
                    type="button" onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:brightness-110 transition-all active:scale-95 cursor-pointer shadow-md shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    Approve
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setRejecting(false); setReason(""); setReasonError(""); }}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-full border border-orange-200 bg-white text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button" onClick={handleRejectConfirm}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    Confirm Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              type="button" onClick={onClose}
              className="w-full py-2.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold hover:bg-orange-200 transition-all active:scale-95 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
