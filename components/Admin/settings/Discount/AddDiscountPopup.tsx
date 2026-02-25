"use client";

import React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";

type DiscountValues = {
  title: string;
  percentage: string;
  createdDate: string;
  endDate: string;
  branch: string;
};

type FormErrors = Partial<Record<keyof DiscountValues, string>>;

type AddDiscountPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: DiscountValues) => void;
};

const AddDiscountPopup = ({
  open,
  onClose,
  onSave,
}: AddDiscountPopupProps) => {
  const [values, setValues] = React.useState<DiscountValues>({
    title: "",
    percentage: "",
    createdDate: "",
    endDate: "",
    branch: "All",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  // reset form when popup opens
  React.useEffect(() => {
    if (!open) return;
    setValues({
      title: "",
      percentage: "",
      createdDate: "",
      endDate: "",
      branch: "All",
    });
    setErrors({});
  }, [open]);

  const setField = (name: keyof DiscountValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    } else if (values.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!values.percentage.trim()) {
      newErrors.percentage = "Percentage is required";
    } else if (Number.isNaN(Number(values.percentage))) {
      newErrors.percentage = "Percentage must be a number";
    } else if (
      Number(values.percentage) <= 0 ||
      Number(values.percentage) > 100
    ) {
      newErrors.percentage = "Percentage must be between 1 and 100";
    }

    if (!values.createdDate) {
      newErrors.createdDate = "Created date is required";
    }

    if (!values.endDate) {
      newErrors.endDate = "End date is required";
    } else if (
      values.createdDate &&
      new Date(values.endDate) < new Date(values.createdDate)
    ) {
      newErrors.endDate = "End date cannot be before created date";
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
    setErrors({});
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
        <FormField
          label="Title"
          placeholder="Enter discount title"
          value={values.title}
          onChange={(v) => setField("title", v)}
          type="text"
        />
        {errors.title && (
          <p className="text-xs text-red-500 px-3">{errors.title}</p>
        )}

        <FormField
          label="Discount Percentage"
          placeholder="Enter percentage"
          value={values.percentage}
          onChange={(v) => setField("percentage", v)}
          type="number"
        />
        {errors.percentage && (
          <p className="text-xs text-red-500 px-3">{errors.percentage}</p>
        )}

        <FormField
          label="Created Date"
          value={values.createdDate}
          onChange={(v) => setField("createdDate", v)}
          type="date"
        />
        {errors.createdDate && (
          <p className="text-xs text-red-500 px-3">
            {errors.createdDate}
          </p>
        )}

        <FormField
          label="End Date"
          value={values.endDate}
          onChange={(v) => setField("endDate", v)}
          type="date"
        />
        {errors.endDate && (
          <p className="text-xs text-red-500 px-3">{errors.endDate}</p>
        )}

        <FormField
          label="Branch"
          placeholder="Select branch"
          value={values.branch}
          onChange={(v) => setField("branch", v)}
          type="dropdown"
        />
        {errors.branch && (
          <p className="text-xs text-red-500 px-3">{errors.branch}</p>
        )}

        <div className="flex items-center justify-center mt-10">
          <div className="w-105">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  onClick: handleCancel,
                  variant: "secondary",
                },
                {
                  label: "Save Discount",
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

export default AddDiscountPopup;
