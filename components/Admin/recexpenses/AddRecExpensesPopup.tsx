"use client";

import React from "react";
import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

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



// / ============================================
//   // Seed RecExpenseCategory
//   // ============================================
//   await prisma.recExpenseCategory.createMany({
//     data: [
//       // CAFE
//       { categoryId: 'rc-001', businessTypeId: 'bt-001', category: 'Monthly Rent' },
//       { categoryId: 'rc-002', businessTypeId: 'bt-001', category: 'Monthly Salaries' },
//       { categoryId: 'rc-003', businessTypeId: 'bt-001', category: 'Electricity Bill' },
//       { categoryId: 'rc-004', businessTypeId: 'bt-001', category: 'Water Bill' },
//       { categoryId: 'rc-005', businessTypeId: 'bt-001', category: 'Internet & Phone' },
//       { categoryId: 'rc-006', businessTypeId: 'bt-001', category: 'Equipment Lease' },
//       { categoryId: 'rc-007', businessTypeId: 'bt-001', category: 'Insurance Premium' },
//       { categoryId: 'rc-008', businessTypeId: 'bt-001', category: 'Software Subscription' },
//       { categoryId: 'rc-009', businessTypeId: 'bt-001', category: 'Waste Management' },
//       { categoryId: 'rc-010', businessTypeId: 'bt-001', category: 'Security Service' },
//       { categoryId: 'rc-011', businessTypeId: 'bt-001', category: 'Cleaning Service' },

//       // CLOTHING
//       { categoryId: 'rc-101', businessTypeId: 'bt-002', category: 'Monthly Rent' },
//       { categoryId: 'rc-102', businessTypeId: 'bt-002', category: 'Monthly Salaries' },
//       { categoryId: 'rc-103', businessTypeId: 'bt-002', category: 'Electricity Bill' },
//       { categoryId: 'rc-104', businessTypeId: 'bt-002', category: 'Water Bill' },
//       { categoryId: 'rc-105', businessTypeId: 'bt-002', category: 'Internet & Phone' },
//       { categoryId: 'rc-106', businessTypeId: 'bt-002', category: 'Insurance Premium' },
//       { categoryId: 'rc-107', businessTypeId: 'bt-002', category: 'Software Subscription' },
//       { categoryId: 'rc-108', businessTypeId: 'bt-002', category: 'Security Service' },
//       { categoryId: 'rc-109', businessTypeId: 'bt-002', category: 'Cleaning Service' },
//       { categoryId: 'rc-110', businessTypeId: 'bt-002', category: 'Waste Management' },

//       // SUPERMARKET
//       { categoryId: 'rc-201', businessTypeId: 'bt-003', category: 'Monthly Rent' },
//       { categoryId: 'rc-202', businessTypeId: 'bt-003', category: 'Monthly Salaries' },
//       { categoryId: 'rc-203', businessTypeId: 'bt-003', category: 'Electricity Bill' },
//       { categoryId: 'rc-204', businessTypeId: 'bt-003', category: 'Water Bill' },
//       { categoryId: 'rc-205', businessTypeId: 'bt-003', category: 'Internet & Phone' },
//       { categoryId: 'rc-206', businessTypeId: 'bt-003', category: 'Cold Storage Lease' },
//       { categoryId: 'rc-207', businessTypeId: 'bt-003', category: 'Insurance Premium' },
//       { categoryId: 'rc-208', businessTypeId: 'bt-003', category: 'Software Subscription' },
//       { categoryId: 'rc-209', businessTypeId: 'bt-003', category: 'Security Service' },
//       { categoryId: 'rc-210', businessTypeId: 'bt-003', category: 'Cleaning Service' },

//       // PHARMACY
//       { categoryId: 'rc-301', businessTypeId: 'bt-004', category: 'Monthly Rent' },
//       { categoryId: 'rc-302', businessTypeId: 'bt-004', category: 'Monthly Salaries' },
//       { categoryId: 'rc-303', businessTypeId: 'bt-004', category: 'Electricity Bill' },
//       { categoryId: 'rc-304', businessTypeId: 'bt-004', category: 'Cold Storage Maintenance' },
//       { categoryId: 'rc-305', businessTypeId: 'bt-004', category: 'Insurance Premium' },
//       { categoryId: 'rc-306', businessTypeId: 'bt-004', category: 'Software Subscription' },
//       { categoryId: 'rc-307', businessTypeId: 'bt-004', category: 'Security Service' },
//       { categoryId: 'rc-308', businessTypeId: 'bt-004', category: 'Cleaning Service' },
//       { categoryId: 'rc-309', businessTypeId: 'bt-004', category: 'Waste Management' },

//       // HARDWARE
//       { categoryId: 'rc-401', businessTypeId: 'bt-005', category: 'Monthly Rent' },
//       { categoryId: 'rc-402', businessTypeId: 'bt-005', category: 'Monthly Salaries' },
//       { categoryId: 'rc-403', businessTypeId: 'bt-005', category: 'Electricity Bill' },
//       { categoryId: 'rc-404', businessTypeId: 'bt-005', category: 'Transportation Contracts' },
//       { categoryId: 'rc-405', businessTypeId: 'bt-005', category: 'Insurance Premium' },
//       { categoryId: 'rc-406', businessTypeId: 'bt-005', category: 'Security Service' },
//       { categoryId: 'rc-407', businessTypeId: 'bt-005', category: 'Cleaning Service' },

//       // BOOKSHOP
//       { categoryId: 'rc-501', businessTypeId: 'bt-006', category: 'Monthly Rent' },
//       { categoryId: 'rc-502', businessTypeId: 'bt-006', category: 'Monthly Salaries' },
//       { categoryId: 'rc-503', businessTypeId: 'bt-006', category: 'Electricity Bill' },
//       { categoryId: 'rc-504', businessTypeId: 'bt-006', category: 'Internet & Phone' },
//       { categoryId: 'rc-505', businessTypeId: 'bt-006', category: 'Insurance Premium' },
//       { categoryId: 'rc-506', businessTypeId: 'bt-006', category: 'Software Subscription' },
//       { categoryId: 'rc-507', businessTypeId: 'bt-006', category: 'Cleaning Service' }
//     ],
//     skipDuplicates: true
//   })
