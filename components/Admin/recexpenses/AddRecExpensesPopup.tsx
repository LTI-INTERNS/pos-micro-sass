"use client";

import React from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import {
  BranchItem,
  RecurringExpenseCategoryItem,
  RecurringExpenseFormPayload,
} from "@/lib/api/recurringExpenses";

type PaymentMethod = "CASH" | "CARD" | "";

type FormErrors = {
  date?: string;
  categoryId?: string;
  description?: string;
  amount?: string;
  branchId?: string;
  paymentMethod?: string;
};

type RecExpenseFormValues = {
  date: string;
  categoryId: string;
  description: string;
  amount: string;
  branchId: string;
};

type UserRole = "owner" | "admin" | "manager";

type AddRecExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: RecurringExpenseFormPayload) => Promise<void> | void;
  categories: RecurringExpenseCategoryItem[];
  branches: BranchItem[];
  loading?: boolean;
  mode?: "create" | "edit";
  initialValues?: {
    recExpensesId?: string;
    date?: string;
    categoryId?: string;
    description?: string;
    amount?: number | string;
    paymentType?: "CASH" | "CARD";
    branchId?: string;
  } | null;
};

const PAYMENT_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card" },
];

const AddRecExpensesPopup = ({
  open,
  onClose,
  onSave,
  categories,
  branches,
  loading = false,
  mode = "create",
  initialValues,
}: AddRecExpensesPopupProps) => {
  const { data: session } = useSession();

  const sessionRole =
    typeof session?.user?.role === "string"
      ? session.user.role.toLowerCase()
      : undefined;

  const role: UserRole | undefined =
    sessionRole === "owner" ||
    sessionRole === "admin" ||
    sessionRole === "manager"
      ? sessionRole
      : undefined;

  const canEditBranch = role === "owner" || role === "admin";
  const sessionBranchId =
    (session?.user as any)?.branchId?.trim?.() || "";

  const [values, setValues] = React.useState<RecExpenseFormValues>({
    date: "",
    categoryId: "",
    description: "",
    amount: "",
    branchId: "",
  });

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("");
  const [errors, setErrors] = React.useState<FormErrors>({});

  React.useEffect(() => {
    if (!open) return;

    setValues({
      date: initialValues?.date || "",
      categoryId: initialValues?.categoryId || "",
      description: initialValues?.description || "",
      amount:
        initialValues?.amount !== undefined && initialValues?.amount !== null
          ? String(initialValues.amount)
          : "",
      branchId:
        initialValues?.branchId || (canEditBranch ? "" : sessionBranchId),
    });

    setPaymentMethod(initialValues?.paymentType || "");
    setErrors({});
  }, [open, initialValues, canEditBranch, sessionBranchId]);

  const categoryOptions = categories.map((item) => ({
    value: item.categoryId,
    label: item.category,
  }));

  const branchOptions = branches.map((item) => ({
    value: item.branchId,
    label: item.name,
  }));

  const setField = (name: keyof RecExpenseFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.date.trim()) newErrors.date = "Date is required";
    if (!values.categoryId.trim()) newErrors.categoryId = "Category is required";

    if (!values.description.trim()) {
      newErrors.description = "Description is required";
    } else if (values.description.trim().length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }

    if (!values.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (Number.isNaN(Number(values.amount))) {
      newErrors.amount = "Amount must be a valid number";
    } else if (Number(values.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!values.branchId.trim()) {
      newErrors.branchId = "Branch is required";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    await onSave({
      categoryId: values.categoryId,
      date: values.date,
      description: values.description.trim(),
      amount: Number(values.amount),
      paymentType: paymentMethod as "CASH" | "CARD",
      ...(values.branchId ? { branchId: values.branchId } : {}),
    });
  };

  const handleCancel = () => {
    onClose();
    setErrors({});
  };

  return (
    <ModalShell
      open={open}
      title={mode === "edit" ? "Edit Recurring Expense" : "Add Recurring Expense"}
      onClose={handleCancel}
      widthClassName="w-[760px] max-w-[92vw]"
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSave();
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FormField
              label="Date"
              placeholder="Enter date"
              value={values.date}
              onChange={(v) => setField("date", v)}
              type="date"
            />
            {errors.date && <p className="px-3 pt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          <div>
            <FormField
              label="Category"
              placeholder="Select category"
              value={values.categoryId}
              onChange={(v) => setField("categoryId", v)}
              type="dropdown"
              options={categoryOptions}
            />
            {errors.categoryId && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <FormField
              label="Amount"
              placeholder="Enter amount"
              value={values.amount}
              onChange={(v) => setField("amount", v)}
              type="number"
            />
            {errors.amount && <p className="px-3 pt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <FormField
              label="Payment Method"
              placeholder="Select payment method"
              value={paymentMethod}
              onChange={(v) => {
                setPaymentMethod(v as PaymentMethod);
                if (errors.paymentMethod) {
                  setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                }
              }}
              type="dropdown"
              options={PAYMENT_OPTIONS}
            />
            {errors.paymentMethod && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.paymentMethod}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Branch"
              placeholder="Select branch"
              value={values.branchId}
              onChange={(v) => setField("branchId", v)}
              type="dropdown"
              options={branchOptions}
              disabled={!canEditBranch}
            />
            {errors.branchId && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.branchId}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Description"
              placeholder="Enter description"
              value={values.description}
              onChange={(v) => setField("description", v)}
              type="text"
            />
            {errors.description && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="w-full md:w-105">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: handleCancel, variant: "secondary" },
                {
                  label: loading
                    ? mode === "edit"
                      ? "Updating..."
                      : "Saving..."
                    : mode === "edit"
                    ? "Update"
                    : "Save",
                  onClick: handleSave,
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddRecExpensesPopup;