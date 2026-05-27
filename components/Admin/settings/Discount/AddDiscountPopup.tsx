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
  branchIds: string[]; // <-- Changed to array
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
  
  const token = (session as any)?.user?.backendToken;
  const canSelectBranch = role === "OWNER" || role === "ADMIN";

  const [branches, setBranches] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<DiscountValues>({
    title: "",
    percentage: "",
    startDate: "",
    endDate: "",
    branchIds: canSelectBranch ? [] : [userBranchId], // Auto-fill for managers
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch branches when popup opens
  useEffect(() => {
    if (open && canSelectBranch && token) {
      const fetchBranches = async () => {
        try {
          const data = await discountService.getBranches(token);
          const branchOptions = data.map((b: any) => ({
            label: b.name,
            value: b.branchId,
          }));
          setBranches(branchOptions);
        } catch (error) {
          console.error("Failed to fetch branches", error);
        }
      };
      fetchBranches();
    }
  }, [open, canSelectBranch, token]);

  // Reset form when popup opens/closes
  useEffect(() => {
    if (!open) return;
    setValues({
      title: "",
      percentage: "",
      startDate: "",
      endDate: "",
      branchIds: canSelectBranch ? [] : [userBranchId],
    });
    setErrors({});
    setApiError(null);
  }, [open, canSelectBranch, userBranchId]);

  const setField = (name: keyof DiscountValues, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  // --- Checkbox Logic ---
  const isAllSelected = branches.length > 0 && branches.every((b) => values.branchIds.includes(b.value));

  const handleToggleAll = () => {
    if (isAllSelected) {
      setField("branchIds", []); // Deselect all
    } else {
      setField("branchIds", branches.map((b) => b.value)); // Select all
    }
  };

  const handleToggleBranch = (id: string) => {
    const newIds = values.branchIds.includes(id)
      ? values.branchIds.filter((b) => b !== id)
      : [...values.branchIds, id];
    setField("branchIds", newIds);
  };
  // ----------------------

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

    if (values.branchIds.length === 0) {
      newErrors.branchIds = "Select at least one branch";
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

        {/* --- Branches Checkbox Grid --- */}
        <div>
          {canSelectBranch ? (
            <div className="flex flex-col space-y-2 mt-2">
               <label className="text-sm font-medium text-gray-700">Assign to Branches</label>
               <div className="p-3 border rounded-md bg-gray-50/50">
                 
                 {/* All Branches Toggle */}
                 <div className="mb-3 pb-3 border-b border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        checked={isAllSelected} 
                        onChange={handleToggleAll} 
                      />
                      <span className="text-sm font-medium text-black">All Branches</span>
                    </label>
                 </div>

                 {/* 3 Column Grid for Branches */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4">
                   {branches.map((b) => (
                     <label key={b.value} className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                         checked={values.branchIds.includes(b.value)} 
                         onChange={() => handleToggleBranch(b.value)} 
                       />
                       <span className="text-sm text-black truncate" title={b.label}>{b.label}</span>
                     </label>
                   ))}
                 </div>
               </div>
               {errors.branchIds && <p className="text-xs text-red-500 px-1">{errors.branchIds}</p>}
            </div>
          ) : (
            <div className="mt-2">
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
            </div>
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