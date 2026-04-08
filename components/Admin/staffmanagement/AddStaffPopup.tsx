"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import { staffService } from "@/lib/services/staff-service";
import type { StaffCreateOptions, StaffRole } from "@/types/staff.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  options: StaffCreateOptions;
  optionsLoading?: boolean;
};

type FormValues = {
  role: StaffRole;
  scopeId: string;
  name: string;
  staffNo: string;
  email: string;
  phone: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function AddStaffPopup({
  isOpen,
  onClose,
  onSuccess,
  options,
  optionsLoading = false,
}: Props) {
  const { data: session } = useSession();
  const userRole = String(session?.user?.role ?? "").toUpperCase();
  const canCreateAdmin = userRole === "OWNER";

  const emptyForm = React.useCallback(
    (): FormValues => ({
      role: canCreateAdmin ? "MANAGER" : "MANAGER",
      scopeId: "",
      name: "",
      staffNo: "",
      email: "",
      phone: "",
      password: "",
    }),
    [canCreateAdmin]
  );

  const [formValues, setFormValues] = React.useState<FormValues>(emptyForm);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setFormValues(emptyForm());
    setErrors({});
    setSaveError("");
  }, [isOpen, emptyForm]);

  React.useEffect(() => {
    if (!canCreateAdmin && formValues.role === "ADMIN") {
      setFormValues((prev) => ({ ...prev, role: "MANAGER", scopeId: "" }));
      return;
    }

    const validScopeIds =
      formValues.role === "ADMIN"
        ? options.adminCompanies.map((item) => item.id)
        : options.managerBranches.map((item) => item.id);

    if (formValues.scopeId && !validScopeIds.includes(formValues.scopeId)) {
      setFormValues((prev) => ({ ...prev, scopeId: "" }));
    }
  }, [canCreateAdmin, formValues.role, formValues.scopeId, options]);

  const setField = (name: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (saveError) {
      setSaveError("");
    }
  };

  const setNumericField = (name: "staffNo" | "phone", value: string) => {
    setField(name, value.replace(/\D/g, ""));
  };

  const scopeOptions =
    formValues.role === "ADMIN"
      ? options.adminCompanies.map((item) => ({ value: item.id, label: item.name }))
      : options.managerBranches.map((item) => ({ value: item.id, label: item.name }));

  const scopeLabel = formValues.role === "ADMIN" ? "Company" : "Branch";
  const scopePlaceholder =
    formValues.role === "ADMIN"
      ? optionsLoading
        ? "Loading companies..."
        : options.adminCompanies.length === 0
          ? "No available companies"
          : "Select Company"
      : optionsLoading
        ? "Loading branches..."
        : options.managerBranches.length === 0
          ? "No available branches"
          : "Select Branch";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.role) {
      newErrors.role = "Role is required";
    }

    if (!formValues.scopeId) {
      newErrors.scopeId =
        formValues.role === "ADMIN"
          ? "Please select a company"
          : "Please select a branch";
    }

    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formValues.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formValues.staffNo.trim()) {
      newErrors.staffNo = "Staff number is required";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formValues.phone.length < 10) {
      newErrors.phone = "Phone number must have at least 10 digits";
    }

    if (!formValues.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setSaveError("");

    try {
      await staffService.create({
        role: formValues.role,
        name: formValues.name.trim(),
        staffNo: formValues.staffNo.trim(),
        email: formValues.email.trim().toLowerCase(),
        phone: formValues.phone.trim(),
        password: formValues.password,
        ...(formValues.role === "ADMIN"
          ? { companyId: formValues.scopeId }
          : { branchId: formValues.scopeId }),
      });

      await onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to create staff member. Please try again.";

      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const helperText =
    formValues.role === "ADMIN"
      ? "Only companies without an assigned admin are shown. Using an existing admin email will link that same admin account to the selected company."
      : "Only branches without a manager are shown.";

  if (!isOpen) return null;

  return (
    <ModalShell
      open={isOpen}
      title="Add New Staff"
      onClose={onClose}
      widthClassName="w-[760px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-3">
        {saveError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
            {saveError}
            <button
              className="ml-3 underline text-red-400 hover:text-red-300"
              onClick={() => setSaveError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        <FormField
          label="Role"
          placeholder="Select Role"
          value={formValues.role}
          onChange={(value) => {
            const nextRole = value as StaffRole;
            if (nextRole === "ADMIN" && !canCreateAdmin) return;
            setFormValues((prev) => ({ ...prev, role: nextRole, scopeId: "" }));
            if (errors.role || errors.scopeId) {
              setErrors((prev) => ({ ...prev, role: "", scopeId: "" }));
            }
          }}
          type="dropdown"
          options={[
            ...(canCreateAdmin ? [{ value: "ADMIN", label: "Admin" }] : []),
            { value: "MANAGER", label: "Manager" },
          ]}
        />
        {errors.role && <p className="text-xs text-red-500 px-3">{errors.role}</p>}

        <FormField
          label={scopeLabel}
          placeholder={scopePlaceholder}
          value={formValues.scopeId}
          onChange={(value) => setField("scopeId", value)}
          type="dropdown"
          options={scopeOptions}
          disabled={optionsLoading || scopeOptions.length === 0}
        />
        {errors.scopeId && <p className="text-xs text-red-500 px-3">{errors.scopeId}</p>}
        <p className="text-xs text-gray-400 px-3 -mt-1">{helperText}</p>

        <FormField
          label="Name"
          placeholder="Enter name"
          value={formValues.name}
          onChange={(value) => setField("name", value)}
          type="text"
        />
        {errors.name && <p className="text-xs text-red-500 px-3">{errors.name}</p>}

        <FormField
          label="Staff No"
          placeholder="Enter staff number"
          value={formValues.staffNo}
          onChange={(value) => setNumericField("staffNo", value)}
          type="text"
        />
        {errors.staffNo && <p className="text-xs text-red-500 px-3">{errors.staffNo}</p>}

        <FormField
          label="Email"
          placeholder="Enter email"
          value={formValues.email}
          onChange={(value) => setField("email", value)}
          type="email"
        />
        {errors.email && <p className="text-xs text-red-500 px-3">{errors.email}</p>}

        <FormField
          label="Phone"
          placeholder="Enter phone number"
          value={formValues.phone}
          onChange={(value) => setNumericField("phone", value)}
          type="tel"
        />
        {errors.phone && <p className="text-xs text-red-500 px-3">{errors.phone}</p>}

        <FormField
          label="Password"
          placeholder="Enter password"
          value={formValues.password}
          onChange={(value) => setField("password", value)}
          type="password"
        />
        {errors.password && <p className="text-xs text-red-500 px-3">{errors.password}</p>}

        <PopupActions
          actions={[
            {
              label: "Cancel",
              onClick: onClose,
              variant: "secondary",
            },
            {
              label: saving ? "Saving..." : "Save",
              onClick: handleSave,
              variant: "primary",
            },
          ]}
        />
      </div>
    </ModalShell>
  );
}