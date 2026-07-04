"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import FormField from "@/components/Admin/common/FormField";
import PopupActions from "@/components/Admin/common/PopupActions";
import ImageUploader from "@/components/Admin/common/ImageUploader";
import { cashierService } from "@/lib/services/cashier-service";
import { branchService } from "@/lib/services/branch-service";
import { uploadService } from "@/lib/services/upload-service";
import type { Branch } from "@/types/branch.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type FormValues = {
  name:     string;
  number:   string;
  branchId: string;
  email:    string;
  phone:    string;
  pin:      string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AddCashierFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX
};

export function AddCashierForm({ isOpen, onClose, onSaved, showToast }: AddCashierFormProps) {
  const { data: session } = useSession();
  const role       = session?.user?.role       ?? "";
  const branchId   = session?.user?.branchId   ?? "";
  const branchName = session?.user?.branchName ?? "";

  const canSelectBranch = role === "OWNER" || role === "ADMIN";

  const [branches, setBranches]               = React.useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = React.useState(false);
  const [branchError, setBranchError]         = React.useState("");
  const [branchRetry, setBranchRetry]         = React.useState(0);

  React.useEffect(() => {
    if (!isOpen || !canSelectBranch) return;
    setBranchesLoading(true);
    setBranchError("");
    branchService
      .getAll()
      .then((data) => { setBranches(data); setBranchError(""); })
      .catch(() => {
        setBranches([]);
        setBranchError("Failed to load branches.");
      })
      .finally(() => setBranchesLoading(false));
  }, [isOpen, canSelectBranch, branchRetry]);

  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }));

  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);
  const [imageUploading, setImageUploading]   = React.useState(false);

  const emptyForm = (): FormValues => ({
    name:     "",
    number:   "",
    branchId: canSelectBranch ? "" : branchId,
    email:    "",
    phone:    "",
    pin:      "",
  });

  const [formValues, setFormValues] = React.useState<FormValues>(emptyForm);
  const [errors, setErrors]         = React.useState<FormErrors>({});
  const [saving, setSaving]         = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    setFormValues(emptyForm());
    setProfileImageUrl(null);
    setImageUploading(false);
    setErrors({});
    setBranchRetry(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const setField = (name: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const setNumericField = (
    name: "number" | "pin",
    value: string,
    maxLength?: number
  ) => {
    let digitsOnly = value.replace(/\D/g, "");

    if (maxLength) {
      digitsOnly = digitsOnly.slice(0, maxLength);
    }

    setField(name, digitsOnly);
  };

  const setPhoneField = (value: string) => {
    const startsWithPlus = value.trim().startsWith("+");
    const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
    const next = startsWithPlus ? `+${digitsOnly}`.slice(0, 16) : digitsOnly;
    setField("phone", next);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formValues.name.trim().length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    if (!formValues.number.trim()) {
      newErrors.number = "Cashier number is required";
    }

    if (!formValues.branchId) {
      newErrors.branchId = "Please select a branch";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formValues.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{7,15}$/.test(formValues.phone.trim())) {
      newErrors.phone = "Enter a valid phone number using 7–15 digits";
    }

    if (!formValues.pin) {
      newErrors.pin = "PIN is required";
    } else if (!/^\d{4}$/.test(formValues.pin)) {
      newErrors.pin = "PIN must be exactly 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormValues(emptyForm());
    setProfileImageUrl(null);
    setImageUploading(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      await cashierService.create({
        branchId:  formValues.branchId,
        cashierNo: formValues.number,
        name:      formValues.name,
        email:     formValues.email,
        phone:     formValues.phone,
        pin:       formValues.pin,
        ...(profileImageUrl ? { imgUrl: profileImageUrl } : {}),
      });
      resetForm();
      showToast("Cashier added successfully!", "success"); // THE FIX: Show toast
      onSaved?.();
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err, "Failed to create cashier. Please try again."), "error"); // THE FIX: Show toast
      // We do NOT throw here so the popup stays open for corrections
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const branchPlaceholder = canSelectBranch
    ? branchError
      ? "Branch load failed"
      : branchesLoading
        ? "Loading branches…"
        : "Select Branch"
    : branchName;

  return (
    <ModalShell open={isOpen} title="Add New Cashier" onClose={handleCancel}>
      <div className="space-y-2 mt-[-4px]">

        {/* Profile Image */}
        <ImageUploader
          shape="circle"
          label={imageUploading ? "Uploading…" : "Avatar"}
          hint="Cashier profile image"
          value={profileImageUrl}
          disabled={imageUploading}
          onChange={async (previewUrl, file) => {
            setProfileImageUrl(previewUrl);
            setImageUploading(true);
            try {
              const { url } = await uploadService.upload(file, "cashiers");
              setProfileImageUrl(url);
            } catch {
              showToast("Image upload failed. Please try again.", "error"); // THE FIX
              setProfileImageUrl(null);
            } finally {
              setImageUploading(false);
            }
          }}
        />

        <FormField
          label="Name"
          placeholder="Enter name"
          value={formValues.name}
          onChange={(val) => setField("name", val)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 px-3">{errors.name}</p>
        )}

        <FormField
          label="Cashier No"
          placeholder="Enter Number"
          value={formValues.number}
          onChange={(val) => setNumericField("number", val)}
        />
        {errors.number && (
          <p className="text-xs text-red-500 px-3">{errors.number}</p>
        )}

        {/* Branch: selectable for OWNER / ADMIN; locked for MANAGER */}
        <div>
          <FormField
            label="Branch Name"
            placeholder={branchPlaceholder}
            value={formValues.branchId}
            onChange={(val) => canSelectBranch && setField("branchId", val)}
            type="dropdown"
            disabled={!canSelectBranch || branchesLoading || !!branchError}
            options={canSelectBranch ? branchOptions : []}
          />
          {!canSelectBranch && (
            <p className="text-xs text-gray-400 px-3 mt-1">
              Cashiers are added to your branch only.
            </p>
          )}
          {branchError && (
            <div className="flex items-center gap-2 px-3 mt-1">
              <p className="text-xs text-red-500">{branchError}</p>
              <button
                className="text-xs text-orange-400 hover:text-orange-300 underline shrink-0"
                onClick={() => setBranchRetry((n) => n + 1)}
                disabled={branchesLoading}
              >
                {branchesLoading ? "Retrying…" : "Retry"}
              </button>
            </div>
          )}
          {errors.branchId && (
            <p className="text-xs text-red-500 px-3">{errors.branchId}</p>
          )}
        </div>

        <FormField
          label="Email"
          placeholder="Enter Email"
          value={formValues.email}
          onChange={(val) => setField("email", val)}
        />
        {errors.email && (
          <p className="text-xs text-red-500 px-3">{errors.email}</p>
        )}

        <FormField
          label="Phone"
          placeholder="Enter Phone Number"
          value={formValues.phone}
          onChange={(val) => setPhoneField(val)}
          type="tel"
          inputMode="tel"
          maxLength={16}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 px-3">{errors.phone}</p>
        )}

        <FormField
          label="PIN"
          placeholder="Enter PIN"
          value={formValues.pin}
          onChange={(val) => setNumericField("pin", val, 4)}
          type="password"
          inputMode="numeric"
          maxLength={4}
        />
        {errors.pin && (
          <p className="text-xs text-red-500 px-3">{errors.pin}</p>
        )}

        <div className="flex justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                {
                  label: "Cancel",
                  onClick: handleCancel,
                  variant: "secondary",
                },
                {
                  label: saving ? "Saving…" : "Save",
                  onClick: handleSave,
                  variant: "primary",
                  disabled: saving || imageUploading,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}