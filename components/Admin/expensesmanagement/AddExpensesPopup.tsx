"use client";

import React from "react";
import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

type ExpenseValues = {
  date: string;
  category: string;
  description: string;
  amount: string;
};

type PaymentMethod = "card" | "cash" | null;

type FormErrors = Partial<Record<keyof ExpenseValues, string>>;

type AddExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: ExpenseValues & { paymentMethod: PaymentMethod }) => void;
};

const AddExpensesPopup = ({ open, onClose, onSave }: AddExpensesPopupProps) => {
  const [values, setValues] = React.useState<ExpenseValues>({
    date: "",
    category: "",
    description: "",
    amount: "",
  });

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(null);
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

  const setField = (name: keyof ExpenseValues, value: string) => {
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
    } else if (values.description.length < 3) {
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
              height={40}
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

export default AddExpensesPopup;


// // ============================================
//   // Seed ExpenseCategory
//   // ============================================
//  // await prisma.expenseCategory.createMany({
//    // data: [
//       // CAFE
//       { categoryId: 'ec-001', businessTypeId: 'bt-001', category: 'Ingredients' },
//       { categoryId: 'ec-002', businessTypeId: 'bt-001', category: 'Utilities' },
//       { categoryId: 'ec-003', businessTypeId: 'bt-001', category: 'Staff Salaries' },
//       { categoryId: 'ec-004', businessTypeId: 'bt-001', category: 'Rent' },
//       { categoryId: 'ec-005', businessTypeId: 'bt-001', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-006', businessTypeId: 'bt-001', category: 'Packaging' },
//       { categoryId: 'ec-007', businessTypeId: 'bt-001', category: 'Marketing' },
//       { categoryId: 'ec-008', businessTypeId: 'bt-001', category: 'Cleaning Supplies' },
//       { categoryId: 'ec-009', businessTypeId: 'bt-001', category: 'Licenses & Permits' },
//       { categoryId: 'ec-010', businessTypeId: 'bt-001', category: 'Insurance' },
//       { categoryId: 'ec-011', businessTypeId: 'bt-001', category: 'Repairs' },
//       { categoryId: 'ec-012', businessTypeId: 'bt-001', category: 'Transportation' },

//       // CLOTHING
//       { categoryId: 'ec-101', businessTypeId: 'bt-002', category: 'Stock Purchase' },
//       { categoryId: 'ec-102', businessTypeId: 'bt-002', category: 'Utilities' },
//       { categoryId: 'ec-103', businessTypeId: 'bt-002', category: 'Staff Salaries' },
//       { categoryId: 'ec-104', businessTypeId: 'bt-002', category: 'Rent' },
//       { categoryId: 'ec-105', businessTypeId: 'bt-002', category: 'Marketing' },
//       { categoryId: 'ec-106', businessTypeId: 'bt-002', category: 'Packaging' },
//       { categoryId: 'ec-107', businessTypeId: 'bt-002', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-108', businessTypeId: 'bt-002', category: 'Cleaning Supplies' },
//       { categoryId: 'ec-109', businessTypeId: 'bt-002', category: 'Licenses & Permits' },
//       { categoryId: 'ec-110', businessTypeId: 'bt-002', category: 'Insurance' },
//       { categoryId: 'ec-111', businessTypeId: 'bt-002', category: 'Security' },
//       { categoryId: 'ec-112', businessTypeId: 'bt-002', category: 'Transportation' },

//       // SUPERMARKET
//       { categoryId: 'ec-201', businessTypeId: 'bt-003', category: 'Stock Purchase' },
//       { categoryId: 'ec-202', businessTypeId: 'bt-003', category: 'Utilities' },
//       { categoryId: 'ec-203', businessTypeId: 'bt-003', category: 'Staff Salaries' },
//       { categoryId: 'ec-204', businessTypeId: 'bt-003', category: 'Rent' },
//       { categoryId: 'ec-205', businessTypeId: 'bt-003', category: 'Logistics' },
//       { categoryId: 'ec-206', businessTypeId: 'bt-003', category: 'Cold Storage' },
//       { categoryId: 'ec-207', businessTypeId: 'bt-003', category: 'Marketing' },
//       { categoryId: 'ec-208', businessTypeId: 'bt-003', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-209', businessTypeId: 'bt-003', category: 'Cleaning Supplies' },
//       { categoryId: 'ec-210', businessTypeId: 'bt-003', category: 'Licenses & Permits' },
//       { categoryId: 'ec-211', businessTypeId: 'bt-003', category: 'Insurance' },
//       { categoryId: 'ec-212', businessTypeId: 'bt-003', category: 'Security' },

//       // PHARMACY
//       { categoryId: 'ec-301', businessTypeId: 'bt-004', category: 'Medicine Purchase' },
//       { categoryId: 'ec-302', businessTypeId: 'bt-004', category: 'Utilities' },
//       { categoryId: 'ec-303', businessTypeId: 'bt-004', category: 'Staff Salaries' },
//       { categoryId: 'ec-304', businessTypeId: 'bt-004', category: 'Rent' },
//       { categoryId: 'ec-305', businessTypeId: 'bt-004', category: 'Cold Storage' },
//       { categoryId: 'ec-306', businessTypeId: 'bt-004', category: 'Licenses & Permits' },
//       { categoryId: 'ec-307', businessTypeId: 'bt-004', category: 'Insurance' },
//       { categoryId: 'ec-308', businessTypeId: 'bt-004', category: 'Security' },
//       { categoryId: 'ec-309', businessTypeId: 'bt-004', category: 'Cleaning Supplies' },
//       { categoryId: 'ec-310', businessTypeId: 'bt-004', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-311', businessTypeId: 'bt-004', category: 'Packaging' },

//       // HARDWARE
//       { categoryId: 'ec-401', businessTypeId: 'bt-005', category: 'Stock Purchase' },
//       { categoryId: 'ec-402', businessTypeId: 'bt-005', category: 'Utilities' },
//       { categoryId: 'ec-403', businessTypeId: 'bt-005', category: 'Staff Salaries' },
//       { categoryId: 'ec-404', businessTypeId: 'bt-005', category: 'Rent' },
//       { categoryId: 'ec-405', businessTypeId: 'bt-005', category: 'Transportation' },
//       { categoryId: 'ec-406', businessTypeId: 'bt-005', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-407', businessTypeId: 'bt-005', category: 'Marketing' },
//       { categoryId: 'ec-408', businessTypeId: 'bt-005', category: 'Security' },
//       { categoryId: 'ec-409', businessTypeId: 'bt-005', category: 'Insurance' },
//       { categoryId: 'ec-410', businessTypeId: 'bt-005', category: 'Licenses & Permits' },

//       // BOOKSHOP
//       { categoryId: 'ec-501', businessTypeId: 'bt-006', category: 'Book Purchase' },
//       { categoryId: 'ec-502', businessTypeId: 'bt-006', category: 'Utilities' },
//       { categoryId: 'ec-503', businessTypeId: 'bt-006', category: 'Staff Salaries' },
//       { categoryId: 'ec-504', businessTypeId: 'bt-006', category: 'Rent' },
//       { categoryId: 'ec-505', businessTypeId: 'bt-006', category: 'Marketing' },
//       { categoryId: 'ec-506', businessTypeId: 'bt-006', category: 'Packaging' },
//       { categoryId: 'ec-507', businessTypeId: 'bt-006', category: 'Equipment Maintenance' },
//       { categoryId: 'ec-508', businessTypeId: 'bt-006', category: 'Cleaning Supplies' },
//       { categoryId: 'ec-509', businessTypeId: 'bt-006', category: 'Licenses & Permits' },
//       { categoryId: 'ec-510', businessTypeId: 'bt-006', category: 'Insurance' }
//     ],
//     skipDuplicates: true
//   })