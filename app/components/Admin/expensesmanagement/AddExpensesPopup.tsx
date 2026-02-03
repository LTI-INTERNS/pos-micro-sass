"use client";

import React from "react";
import ModalShell from "../common/ModalShell";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";

type ExpenseValues = {
  date: string;
  category: string;
  description: string;
  amount: string;
};

type FormErrors = Partial<Record<keyof ExpenseValues, string>>;

type AddExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: ExpenseValues) => void;
};

const AddExpensesPopup = ({ open, onClose, onSave }: AddExpensesPopupProps) => {
  const [values, setValues] = React.useState<ExpenseValues>({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  // reset form when popup opens
  React.useEffect(() => {
    if (!open) return;
    setValues({
      date: "",
      category: "",
      description: "",
      amount: "",
    });
    setErrors({});
  }, [open]);

  const setField = (name: keyof ExpenseValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // clear error when user edits field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.date.trim()) {
      newErrors.date = "Date is required";
    }

    if (!values.category.trim()) {
      newErrors.category = "Category is required";
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(values);
  };

  const handleCancel = () => {
    onClose();
    setValues({
      date: "",
      category: "",
      description: "",
      amount: "",
    });
    setErrors({});
  };

  return (
    <ModalShell
      open={open}
      title="Add New Expense"
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
        <FormField
          label="Date"
          placeholder="Enter date"
          value={values.date}
          onChange={(v) => setField("date", v)}
          type="date"
        />
        {errors.date && <p className="text-xs text-red-500 px-3">{errors.date}</p>}

        <FormField
          label="Category"
          placeholder="Enter category"
          value={values.category}
          onChange={(v) => setField("category", v)}
          type="dropdown"
        />
        {errors.category && (
          <p className="text-xs text-red-500 px-3">{errors.category}</p>
        )}

        <FormField
          label="Description"
          placeholder="Enter description"
          value={values.description}
          onChange={(v) => setField("description", v)}
          type="text"
        />
        {errors.description && (
          <p className="text-xs text-red-500 px-3">{errors.description}</p>
        )}

        <FormField
          label="Amount"
          placeholder="Enter amount"
          value={values.amount}
          onChange={(v) => setField("amount", v)}
          type="number"
        />
        {errors.amount && (
          <p className="text-xs text-red-500 px-3">{errors.amount}</p>
        )}

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="flex h-20 w-full items-center justify-center rounded-md border border-gray-200"
          >
            <img
              src="/Popcard.png"
              className="h-10 w-auto object-contain"
              alt="card"
            />
          </a>
          <a
            href="#"
            className="flex h-20 w-full items-center justify-center rounded-md border border-gray-200"
          >
            <img
              src="/Popcash.png"
              className="h-10 w-auto object-contain"
              alt="cash"
            />
          </a>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-105">
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

export default AddExpensesPopup;
