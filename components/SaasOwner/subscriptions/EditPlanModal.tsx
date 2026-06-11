"use client";

import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { saasOwnerService, type UpdateSubscriptionInput } from "@/lib/services/saas-owner.service";
import { queryKeys } from "@/lib/query-keys";
import type { SubscriptionType } from "@/types/subscription.types";

const REPORT_LABELS   = { BASIC: "Basic", ADVANCED: "Advanced", CUSTOM: "Custom" } as const;
const SUPPORT_LABELS  = { EMAIL: "Email", PRIORITY: "Priority", DEDICATED_24_7: "24/7 Dedicated" } as const;
const AI_LABELS       = { NOT_INCLUDED: "Not Included", INCLUDED: "Included", FULL_SUITE: "Full Suite" } as const;

type ReportLevel       = keyof typeof REPORT_LABELS;
type SupportLevel      = keyof typeof SUPPORT_LABELS;
type AIPredictionLevel = keyof typeof AI_LABELS;

interface Props {
  open:    boolean;
  type:    SubscriptionType | null;
  onClose: () => void;
}

const numOrNull = (v: string) => v.trim() === "" ? null : Number(v);

function LabeledInput({
  label, value, onChange, type = "text", prefix, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-400 transition-colors bg-white">
        {prefix && (
          <span className="px-3 text-sm text-gray-400 border-r border-gray-200 bg-gray-50 h-full flex items-center py-2">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Unlimited"}
          className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none bg-white"
          min={type === "number" ? "0" : undefined}
        />
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:border-orange-400 transition-colors cursor-pointer"
      >
        {(Object.entries(options) as [T, string][]).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
  );
}

export default function EditPlanModal({ open, type, onClose }: Props) {
  const queryClient = useQueryClient();

  const [price,       setPrice]       = useState("");
  const [branchLim,   setBranchLim]   = useState("");
  const [staffLim,    setStaffLim]    = useState("");
  const [productLim,  setProductLim]  = useState("");
  const [customerLim, setCustomerLim] = useState("");
  const [orderLim,    setOrderLim]    = useState("");
  const [reportLvl,   setReportLvl]   = useState<ReportLevel>("BASIC");
  const [supportLvl,  setSupportLvl]  = useState<SupportLevel>("EMAIL");
  const [aiLvl,       setAiLvl]       = useState<AIPredictionLevel>("NOT_INCLUDED");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: sub, isLoading: loadingSub } = useQuery({
    queryKey: queryKeys.saasOwner.subscriptionDetail(type!),
    queryFn:  () => saasOwnerService.getSubscriptionByType(type!),
    enabled:  open && Boolean(type),
    staleTime: 0,
  });

  useEffect(() => {
    if (!sub) return;
    setPrice(sub.priceMonthly);
    setBranchLim(sub.branchLimit   != null ? String(sub.branchLimit)        : "");
    setStaffLim(sub.staffLimit     != null ? String(sub.staffLimit)         : "");
    setProductLim(sub.productLimit != null ? String(sub.productLimit)       : "");
    setCustomerLim(sub.customerLimit != null ? String(sub.customerLimit)    : "");
    setOrderLim(sub.monthlyOrderLimit != null ? String(sub.monthlyOrderLimit) : "");
    setReportLvl(sub.reportLevel);
    setSupportLvl(sub.supportLevel);
    setAiLvl(sub.aiPredictionLevel);
    setSaveSuccess(false);
  }, [sub]);

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: (input: UpdateSubscriptionInput) =>
      saasOwnerService.updateSubscription(type!, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.saasOwner.companies() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.saasOwner.subscriptionSummary() });
      setSaveSuccess(true);
      setTimeout(() => { setSaveSuccess(false); onClose(); }, 1200);
    },
  });

  function handleSave() {
    if (!type) return;
    save({
      priceMonthly:      parseFloat(price) || 0,
      branchLimit:       numOrNull(branchLim),
      staffLimit:        numOrNull(staffLim),
      productLimit:      numOrNull(productLim),
      customerLimit:     numOrNull(customerLim),
      monthlyOrderLimit: numOrNull(orderLim),
      reportLevel:       reportLvl,
      supportLevel:      supportLvl,
      aiPredictionLevel: aiLvl,
    });
  }

  if (!type) return null;

  const PLAN_COLOR: Record<SubscriptionType, string> = {
    FREE:       "bg-gray-100 text-gray-600",
    PRO:        "bg-orange-100 text-orange-700",
    ENTERPRISE: "bg-purple-100 text-purple-700",
  };

  return (
    <ModalShell
      open={open}
      title="Edit Plan Details"
      onClose={onClose}
      widthClassName="w-[620px] max-w-[95vw]"
    >
      {/* Plan type chip */}
      <div className="flex items-center gap-2 mb-6">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${PLAN_COLOR[type]}`}>
          {type}
        </span>
        <span className="text-xs text-gray-400">
          Changes apply to all companies on this plan immediately.
        </span>
      </div>

      {loadingSub ? (
        <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading plan details…</span>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Pricing */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Pricing</p>
            <LabeledInput
              label="Monthly Price"
              value={price}
              onChange={setPrice}
              type="number"
              prefix="$"
              placeholder="0.00"
            />
          </div>

          {/* Limits */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Limits <span className="text-gray-400 normal-case font-normal">(leave blank for unlimited)</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput label="Branch Limit"        value={branchLim}   onChange={setBranchLim}   type="number" />
              <LabeledInput label="Staff Limit"         value={staffLim}    onChange={setStaffLim}    type="number" />
              <LabeledInput label="Product Limit"       value={productLim}  onChange={setProductLim}  type="number" />
              <LabeledInput label="Customer Limit"      value={customerLim} onChange={setCustomerLim} type="number" />
              <LabeledInput label="Monthly Order Limit" value={orderLim}    onChange={setOrderLim}    type="number" />
            </div>
          </div>

          {/* Feature levels */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Feature Levels</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SelectField label="Reports"       value={reportLvl}  options={REPORT_LABELS}  onChange={setReportLvl} />
              <SelectField label="Support"       value={supportLvl} options={SUPPORT_LABELS} onChange={setSupportLvl} />
              <SelectField label="AI Prediction" value={aiLvl}      options={AI_LABELS}      onChange={setAiLvl} />
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={onClose}
          disabled={saving}
          className="px-5 py-2 rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loadingSub || saveSuccess}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold text-white transition active:scale-95
            ${saveSuccess
              ? "bg-green-500 cursor-default"
              : "bg-orange-500 hover:bg-orange-600 cursor-pointer disabled:opacity-60"
            }`}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : saveSuccess ? (
            <><Check size={14} /> Saved!</>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </ModalShell>
  );
}
