"use client";

import * as React from "react";

import ModalShell from "@/app/components/Admin/common/ModalShell";
import FormField from "@/app/components/Admin/common/FormField";
import PopupActions from "@/app/components/Admin/common/PopupActions";

import { staffData } from "../../../staffmanagement/mock/mockStaffData";

type Props = {
  onClose: () => void;
};

type StaffValues = {
  id: string;
  name: string;
  staffNo: string;
  position: string;
  email: string;
  phone: string;
  password: string;
  pin: string;
};

type FormErrors = Partial<Record<keyof StaffValues, string>>;

export default function AddStaffPopup({ onClose }: Props) {
  const [open, setOpen] = React.useState(true);

  // Generate next ID dynamically whenever staffData changes
  const nextId = React.useMemo(() => (staffData.length + 1).toString(), []);

  const [values, setValues] = React.useState<StaffValues>({
    id: nextId,
    name: "",
    staffNo: "",
    position: "",
    email: "",
    phone: "",
    password: "",
    pin: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  // Reset form when popup opens
  React.useEffect(() => {
    if (!open) return;

    setValues({
      id: nextId,
      name: "",
      staffNo: "",
      position: "",
      email: "",
      phone: "",
      password: "",
      pin: "",
    });

    setErrors({});
  }, [open, nextId]); // nextId added to dependency array to satisfy linter

  const setField = (name: keyof StaffValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) newErrors.name = "Name is required";
    else if (values.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!values.staffNo.trim()) newErrors.staffNo = "Staff No is required";
    else if (!/^\d+$/.test(values.staffNo))
      newErrors.staffNo = "Staff No must contain only numbers";

    if (!values.position.trim()) newErrors.position = "Position is required";

    if (!values.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      newErrors.email = "Please enter a valid email address";

    if (!values.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(values.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone number must be exactly 10 digits";

    if (!values.password.trim()) newErrors.password = "Password is required";
    else if (values.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!values.pin.trim()) newErrors.pin = "PIN is required";
    else if (!/^\d{4}$/.test(values.pin))
      newErrors.pin = "PIN must be exactly 4 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    console.log("Staff form values:", values);

    // Close popup
    setOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Add New Staff"
      onClose={handleCancel}
      widthClassName="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <FormField
          label="ID"
          value={values.id}
          onChange={(v) => setField("id", v)}
          type="text"
          disabled
        />

        <FormField
          label="Name"
          placeholder="Enter name"
          value={values.name}
          onChange={(v) => setField("name", v)}
          type="text"
        />
        {errors.name && <p className="text-xs text-red-500 px-3">{errors.name}</p>}

        <FormField
          label="Staff No"
          placeholder="Enter staff number"
          value={values.staffNo}
          onChange={(v) => setField("staffNo", v.replace(/\D/g, ""))}
          type="text"
        />
        {errors.staffNo && <p className="text-xs text-red-500 px-3">{errors.staffNo}</p>}

        <FormField
          label="Position"
          placeholder="Enter position"
          value={values.position}
          onChange={(v) => setField("position", v)}
          type="text"
        />
        {errors.position && <p className="text-xs text-red-500 px-3">{errors.position}</p>}

        <FormField
          label="Email"
          placeholder="Enter email"
          value={values.email}
          onChange={(v) => setField("email", v)}
          type="text"
        />
        {errors.email && <p className="text-xs text-red-500 px-3">{errors.email}</p>}

        <FormField
          label="Phone"
          placeholder="Enter Phone number"
          value={values.phone}
          onChange={(v) => setField("phone", v.replace(/\D/g, ""))}
          type="text"
        />
        {errors.phone && <p className="text-xs text-red-500 px-3">{errors.phone}</p>}

        <FormField
          label="Password"
          placeholder="Enter password"
          value={values.password}
          onChange={(v) => setField("password", v)}
          type="password"
        />
        {errors.password && <p className="text-xs text-red-500 px-3">{errors.password}</p>}

        <FormField
          label="Pin"
          placeholder="Enter PIN"
          value={values.pin}
          onChange={(v) => setField("pin", v.replace(/\D/g, "").slice(0, 4))}
          type="password"
        />
        {errors.pin && <p className="text-xs text-red-500 px-3">{errors.pin}</p>}

        <PopupActions
          actions={[
            {
              label: "Cancel",
              onClick: handleCancel,
              variant: "secondary",
            },
            {
              label: "Save",
              onClick: handleSave,
              variant: "primary",
            },
          ]}
        />
      </form>
    </ModalShell>
  );
}