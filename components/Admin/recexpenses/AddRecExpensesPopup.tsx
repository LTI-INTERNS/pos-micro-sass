"use client";

import React from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

type RecExpenseValues = {
  date: string;
  category: string;
  description: string;
  amount: string;
  branch: string;
};

type PaymentMethod = "card" | "cash" | "check" | "bankTransfer" | "";

type FormErrors = Partial<Record<keyof RecExpenseValues, string>> & {
  paymentMethod?: string;
};

type AddRecExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: RecExpenseValues & { paymentMethod: PaymentMethod }) => void;
};

type UserRole = "owner" | "admin" | "manager";

const CATEGORY_OPTIONS = [
  { value: "Monthly Rent", label: "Monthly Rent" },
  { value: "Monthly Salaries", label: "Monthly Salaries" },
  { value: "Electricity Bill", label: "Electricity Bill" },
  { value: "Water Bill", label: "Water Bill" },
  { value: "Internet & Phone", label: "Internet & Phone" },
  { value: "Equipment Lease", label: "Equipment Lease" },
  { value: "Insurance Premium", label: "Insurance Premium" },
  { value: "Software Subscription", label: "Software Subscription" },
  { value: "Waste Management", label: "Waste Management" },
  { value: "Security Service", label: "Security Service" },
  { value: "Cleaning Service", label: "Cleaning Service" },
  { value: "Cold Storage Lease", label: "Cold Storage Lease" },
  { value: "Cold Storage Maintenance", label: "Cold Storage Maintenance" },
  { value: "Transportation Contracts", label: "Transportation Contracts" },
];

const BRANCH_OPTIONS = [
  { value: "Colombo", label: "Colombo" },
  { value: "Negombo", label: "Negombo" },
  { value: "Nugegoda", label: "Nugegoda" },
  { value: "Galle", label: "Galle" },
  { value: "Matara", label: "Matara" },
  { value: "Kandy", label: "Kandy" },
];

const PAYMENT_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "check", label: "Check" },
  { value: "bankTransfer", label: "Bank Transfer" },
];

const AddRecExpensesPopup = ({
  open,
  onClose,
  onSave,
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
  const sessionBranch = session?.user?.branchName?.trim() ?? "";

  const [values, setValues] = React.useState<RecExpenseValues>({
    date: "",
    category: "",
    description: "",
    amount: "",
    branch: "",
  });

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("");
  const [errors, setErrors] = React.useState<FormErrors>({});

  React.useEffect(() => {
    if (!open) return;

    setValues({
      date: "",
      category: "",
      description: "",
      amount: "",
      branch: canEditBranch ? "" : sessionBranch,
    });

    setPaymentMethod("");
    setErrors({});
  }, [open, canEditBranch, sessionBranch]);

  const setField = (name: keyof RecExpenseValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.date.trim()) newErrors.date = "Date is required";
    if (!values.category.trim()) newErrors.category = "Category is required";

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

    if (!values.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave({ ...values, paymentMethod });
  };

  const handleCancel = () => {
    onClose();
    setValues({
      date: "",
      category: "",
      description: "",
      amount: "",
      branch: canEditBranch ? "" : sessionBranch,
    });
    setPaymentMethod("");
    setErrors({});
  };

  return (
    <ModalShell
      open={open}
      title="Add Recurring Expense"
      onClose={handleCancel}
      widthClassName="w-[760px] max-w-[92vw]"
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
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
            {errors.date && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div>
            <FormField
              label="Category"
              placeholder="Select category"
              value={values.category}
              onChange={(v) => setField("category", v)}
              type="dropdown"
              options={CATEGORY_OPTIONS}
            />
            {errors.category && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.category}</p>
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
            {errors.amount && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.amount}</p>
            )}
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
              <p className="px-3 pt-1 text-xs text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Branch"
              placeholder="Select branch"
              value={values.branch}
              onChange={(v) => setField("branch", v)}
              type="dropdown"
              options={BRANCH_OPTIONS}
              disabled={!canEditBranch}
            />
            {errors.branch && (
              <p className="px-3 pt-1 text-xs text-red-500">{errors.branch}</p>
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
              <p className="px-3 pt-1 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="w-full md:w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: handleCancel, variant: "secondary" },
                { label: "Save", onClick: handleSave, variant: "primary" },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddRecExpensesPopup;