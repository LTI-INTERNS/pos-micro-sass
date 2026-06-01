"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddCustomerModal, {
  CustomerFormValues,
} from "@/components/Admin/common/AddCustomerModal";
import { customerService } from "@/lib/services/customer-service";
import { branchService } from "@/lib/services/branch-service";
import type { Customer } from "@/types/customer.types";
import type { Branch } from "@/types/branch.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type AddCustomerFormProps = {
  open: boolean;
  onClose: () => void;
  onAdded?: (customer: Customer) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX: Accept showToast
};

export default function AddCustomerForm({
  open,
  onClose,
  onAdded,
  showToast,
}: AddCustomerFormProps) {
  const { data: session } = useSession();
  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";

  const canSelectBranch = role === "OWNER" || role === "ADMIN";

  // ── Branch picker state (OWNER / ADMIN only) ──────────────────────────────
  const [branches, setBranches]           = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [branchesLoading, setBranchesLoading]   = useState(false);
  const [branchError, setBranchError]           = useState("");

  // ── Form submission state ─────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  // Fetch branches once when the modal opens (only for OWNER / ADMIN)
  useEffect(() => {
    if (!open || !canSelectBranch) return;
    setBranchesLoading(true);
    setBranchError("");
    branchService
      .getAll()
      .then(setBranches)
      .catch(() => setBranchError("Failed to load branches."))
      .finally(() => setBranchesLoading(false));
  }, [open, canSelectBranch]);

  // Reset branch selection when modal closes
  useEffect(() => {
    if (!open) setSelectedBranchId("");
  }, [open]);

  const handleSubmit = async (values: CustomerFormValues) => {
    // OWNER / ADMIN use their dropdown pick; MANAGER uses session branchId
    const effectiveBranchId = canSelectBranch ? selectedBranchId : branchId;

    if (!effectiveBranchId) {
      showToast(
        canSelectBranch
          ? "Please select a branch before adding a customer."
          : "No branch assigned to your account. Contact an administrator.",
        "error"
      );
      throw new Error("Validation Error"); // THE FIX: Throw error so the form data doesn't wipe
    }

    setSubmitting(true);

    try {
      const newCustomer = await customerService.create({
        branchId:     effectiveBranchId,
        name:         values.name,
        phoneNumber1: values.phoneNumber1,
        phoneNumber2: values.phoneNumber2 || undefined,
        email:        values.email        || undefined,
        promocard:    values.promocard    || undefined,
      });

      onAdded?.(newCustomer);
      onClose();
      showToast("Customer added successfully!", "success");
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err, "Failed to add customer. Please try again."), "error");
      throw err; // THE FIX: Throw error so the parent AddCustomerModal catches it and doesn't wipe data
    } finally {
      setSubmitting(false);
    }
  };

  // Branch dropdown rendered above the modal form (OWNER / ADMIN only)
  const branchSelector = canSelectBranch ? (
    <div className="space-y-2 pb-1">
      <label className="text-[12px] text-gray-500 block">
        Branch <span className="text-red-500">*</span>
      </label>
      {branchesLoading ? (
        <p className="text-xs text-gray-400 py-2">Loading branches…</p>
      ) : branchError ? (
        <p className="text-xs text-red-500 py-2">{branchError}</p>
      ) : (
        <select
          value={selectedBranchId}
          onChange={(e) => {
            setSelectedBranchId(e.target.value);
          }}
          className={`
            w-full rounded-full border px-4 py-2 outline-none text-sm font-normal
            ${!selectedBranchId ? "text-gray-300" : "text-gray-800"}
            border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200
          `}
        >
          <option value="" disabled>Select a branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}{b.city ? ` — ${b.city}` : ""}
            </option>
          ))}
        </select>
      )}
    </div>
  ) : null;

  return (
    <>
      <AddCustomerModal
        open={open}
        title="New Customer"
        onClose={() => {
          onClose();
        }}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Adding..." : "Add Customer"}
        headerSlot={branchSelector}
      />
    </>
  );
}