"use client";

import { useEffect, useState } from "react";
import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import ReusableForm, {
  FieldConfig,
} from "@/app/components/Dashboard/common/ReusableForm";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

type Expense = {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: string;
  payment: string;
  addedBy: string;
};

export default function ExpensePopupPreview() {
  const [open, setOpen] = useState(true);
  const [nextId, setNextId] = useState(1);

  // today date
  const today = new Date().toISOString().split("T")[0];

  //  get next ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (!stored) {
      setNextId(1);
      return;
    }

    const expenses: Expense[] = JSON.parse(stored);
    const lastId =
      expenses.length > 0
        ? Math.max(...expenses.map((e) => e.id))
        : 0;

    setNextId(lastId + 1);
  }, []);

  const fields: FieldConfig[] = [
    { name: "id", label: "ID", disabled: true, },
    { name: "date", label: "Date", type: "date" },
    {
      name: "category",
      label: "Category",
      type: "dropdown",
      options: [
        { value: "Inventory", label: "Inventory" },
        { value: "Recruitment Fees", label: "Recruitment Fees" },
        { value: "Interview Costs", label: "Interview Costs" },
        { value: "Candidate Travel", label: "Candidate Travel" },
        { value: "Hiring Tools", label: "Hiring Tools" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter description",
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "Enter amount",
    },
    {
      name: "payment",
      label: "Payment",
      type: "dropdown",
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
      ],
    },
    {
      name: "addedBy",
      label: "Added By",
      placeholder: "Enter name",
    },
  ];

  const handleSave = (values: Record<string, string>) => {
    const stored = localStorage.getItem("expenses");
    const expenses: Expense[] = stored ? JSON.parse(stored) : [];

    const newExpense: Expense = {
      id: Number(values.id),
      date: values.date,
      category: values.category,
      description: values.description,
      amount: values.amount,
      payment: values.payment,
      addedBy: values.addedBy,
    };

    localStorage.setItem(
      "expenses",
      JSON.stringify([...expenses, newExpense])
    );

    setOpen(false);
  };

  return (
    <ModalShell
      open={open}
      title="Add new expense"
      onClose={() => setOpen(false)}
    >
      <ReusableForm
        fields={fields}
        initialValues={{
          id: String(nextId),
          date: today,
          category: "",
          description: "",
          amount: "",
          payment: "",
          addedBy: "",
        }}
        onSubmit={handleSave}
      />

      <PopupActions
        actions={[
          {
            label: "Cancel",
            onClick: () => setOpen(false),
            variant: "secondary",
          },
          {
            label: "Save",
            onClick: () => {},
            variant: "primary",
          },
        ]}
      />
    </ModalShell>
  );
}
