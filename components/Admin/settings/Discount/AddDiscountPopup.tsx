"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import { discountService } from "@/lib/services/discountService";

type DiscountValues = {
  title: string;
  percentage: string;
  startDate: string;
  endDate: string;
  branchId: string;
};

type FormErrors = Partial<Record<keyof DiscountValues, string>>;

type AddDiscountPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: DiscountValues) => Promise<void>;
};

const AddDiscountPopup = ({ open, onClose, onSave }: AddDiscountPopupProps) => {
  const { data: session } = useSession();
  const role = session?.user?.role?.toUpperCase();
  const userBranchId = session?.user?.branchId ?? "";
  
  // THE FIX: Extracting the token properly here too
  const token = (session as any)?.user?.backendToken;

  const canSelectBranch = role === "OWNER" || role === "ADMIN";

  const [branches, setBranches] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<DiscountValues>({
    title: "",
    percentage: "",
    startDate: "",
    endDate: "",
    branchId: canSelectBranch ? "All" : userBranchId,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch branches when popup opens
  useEffect(() => {
    if (open && canSelectBranch && token) {
      const fetchBranches = async () => {
        try {
          // Use the clean service method we just built
          const data = await discountService.getBranches(token);
          const branchOptions = data.map((b: any) => ({
            label: b.name,
            value: b.branchId,
          }));
          setBranches([{ label: "All Branches", value: "All" }, ...branchOptions]);
        } catch (error) {
          console.error("Failed to fetch branches", error);
        }
      };
      fetchBranches();
    }
  }, [open, canSelectBranch, token]);

  // Reset form when popup opens
  useEffect(() => {
    if (!open) return;
    setValues({
      title: "",
      percentage: "",
      startDate: "",
      endDate: "",
      branchId: canSelectBranch ? "All" : userBranchId,
    });
    setErrors({});
    setApiError(null);
  }, [open, canSelectBranch, userBranchId]);

  const setField = (name: keyof DiscountValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.title.trim()) newErrors.title = "Title is required";
    else if (values.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";

    if (!values.percentage.trim()) newErrors.percentage = "Percentage is required";
    else if (Number.isNaN(Number(values.percentage))) newErrors.percentage = "Must be a number";
    else if (Number(values.percentage) <= 0 || Number(values.percentage) > 100) {
      newErrors.percentage = "Percentage must be between 1 and 100";
    }

    if (!values.startDate) newErrors.startDate = "Start date is required";
    
    if (!values.endDate) newErrors.endDate = "End date is required";
    else if (values.startDate && new Date(values.endDate) < new Date(values.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setApiError(null);
    try {
      await onSave(values);
      onClose();
    } catch (err: any) {
      setApiError(err.message || "Failed to save discount. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setErrors({});
    setApiError(null);
  };

  return (
    <ModalShell
      open={open}
      title="Add New Discount"
      onClose={handleCancel}
      widthClassName="w-[980px] max-w-[92vw]"
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {apiError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{apiError}</p>}

        <FormField
          label="Title"
          placeholder="Enter discount title"
          value={values.title}
          onChange={(v) => setField("title", v)}
          type="text"
        />
        {errors.title && <p className="text-xs text-red-500 px-3">{errors.title}</p>}

        <FormField
          label="Discount Percentage"
          placeholder="Enter percentage"
          value={values.percentage}
          onChange={(v) => setField("percentage", v)}
          type="number"
        />
        {errors.percentage && <p className="text-xs text-red-500 px-3">{errors.percentage}</p>}

        <FormField
          label="Start Date"
          value={values.startDate}
          onChange={(v) => setField("startDate", v)}
          type="date"
        />
        {errors.startDate && <p className="text-xs text-red-500 px-3">{errors.startDate}</p>}

        <FormField
          label="End Date"
          value={values.endDate}
          onChange={(v) => setField("endDate", v)}
          type="date"
        />
        {errors.endDate && <p className="text-xs text-red-500 px-3">{errors.endDate}</p>}

        <div>
          {canSelectBranch ? (
            <div className="flex flex-col space-y-1">
               <label className="text-sm font-medium text-gray-700">Branch</label>
               <select
                 className="border rounded-md px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={values.branchId}
                 onChange={(e) => setField("branchId", e.target.value)}
               >
                 {branches.map((b) => (
                   <option key={b.value} value={b.value}>{b.label}</option>
                 ))}
               </select>
            </div>
          ) : (
            <>
              <FormField
                label="Branch"
                placeholder="Your Branch"
                value="Your Assigned Branch"
                onChange={() => {}}
                type="text"
                disabled={true}
              />
              <p className="text-xs text-gray-400 px-3 mt-1">
                Discounts are applied to your branch only.
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center mt-10">
          <div className="w-105">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  onClick: handleCancel,
                  variant: "secondary",
                  disabled: loading
                },
                {
                  label: loading ? "Saving..." : "Save Discount",
                  onClick: handleSave,
                  variant: "primary",
                  disabled: loading
                },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddDiscountPopup;