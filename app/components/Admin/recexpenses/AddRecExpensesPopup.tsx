"use client";

import React from "react";
import Image from "next/image";
import ModalShell from "../common/ModalShell";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";

type RecExpenseValues = {
  date: string;
  category: string;
  description: string;
  amount: string;
};

type PaymentMethod = "card" | "cash" | null;

type FormErrors = Partial<Record<keyof RecExpenseValues, string>>;

type AddRecExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: RecExpenseValues & { paymentMethod: PaymentMethod }) => void;
};

const AddRecExpensesPopup = ({
  open,
  onClose,
  onSave,
}: AddRecExpensesPopupProps) => {
  const [values, setValues] = React.useState<RecExpenseValues>({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>(null);

  const [errors, setErrors] = React.useState<FormErrors>({});

  // Reset form when popup opens
  React.useEffect(() => {
    if (!open) return;

    setValues({
      date: "",
      category: "",
      description: "",
      amount: "",
    });

    setPaymentMethod(null);
    setErrors({});
  }, [open]);

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
    });
    setPaymentMethod(null);
    setErrors({});
  };

  const cardBase =
    "flex h-20 w-full cursor-pointer items-center justify-center rounded-md border transition-all";

  const selectedCard =
    "border-orange-500 ring-2 ring-orange-200 bg-orange-50";

  const unselectedCard =
    "border-gray-200 hover:border-orange-300";

  return (
    <ModalShell
      open={open}
      title="Add Recurring Expense"
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
          type="text"
        />
        {errors.category && <p className="text-xs text-red-500 px-3">{errors.category}</p>}

        <FormField
          label="Description"
          placeholder="Enter description"
          value={values.description}
          onChange={(v) => setField("description", v)}
          type="text"
        />
        {errors.description && <p className="text-xs text-red-500 px-3">{errors.description}</p>}

        <FormField
          label="Amount"
          placeholder="Enter amount"
          value={values.amount}
          onChange={(v) => setField("amount", v)}
          type="number"
        />
        {errors.amount && <p className="text-xs text-red-500 px-3">{errors.amount}</p>}

        {/* Payment Method Selection */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <div
            onClick={() => setPaymentMethod("card")}
            className={`${cardBase} ${
              paymentMethod === "card" ? selectedCard : unselectedCard
            }`}
          >
            <Image
              src="/Popcard.png"
              alt="Card Payment"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div
            onClick={() => setPaymentMethod("cash")}
            className={`${cardBase} ${
              paymentMethod === "cash" ? selectedCard : unselectedCard
            }`}
          >
            <Image
              src="/Popcash.png"
              alt="Cash Payment"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
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

export default AddRecExpensesPopup;