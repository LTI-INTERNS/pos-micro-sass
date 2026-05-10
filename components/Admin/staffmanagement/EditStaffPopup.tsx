"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import { staffService } from "@/lib/services/staff-service";
import type {
  AdminStaff,
  CompanyOption,
  CompanyTag,
  ManagerStaff,
  StaffCreateOptions,
} from "@/types/staff.types";

type Props = {
  isOpen: boolean;
  staff: AdminStaff | ManagerStaff | null;
  options: StaffCreateOptions;
  currentUserRole: string;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
};

type FormErrors = Record<string, string>;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[12px] text-gray-500">{children}</label>;
}

function RoundedInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-full border px-4 py-2 outline-none placeholder:text-gray-300 ${
        disabled ? "bg-gray-100 text-gray-400 border-gray-200" : "border-gray-200 text-gray-700"
      } focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
    />
  );
}

function RoundedSelect({
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-full border px-4 py-2 outline-none ${
        disabled ? "bg-gray-100 text-gray-400 border-gray-200" : "border-gray-200 text-gray-700"
      } focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function StaticTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
      {children}
    </span>
  );
}

function RemovableTag({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
      {children}
      <button type="button" onClick={onRemove} className="font-semibold">
        ×
      </button>
    </span>
  );
}

export default function EditStaffPopup({
  isOpen,
  staff,
  options,
  currentUserRole,
  onClose,
  onSuccess,
}: Props) {
  const isOwner = currentUserRole.toUpperCase() === "OWNER";
  const isAdminStaff = staff?.role === "ADMIN";
  const adminEditLocked = !!staff && staff.role === "ADMIN" && !isOwner;

  const [name, setName] = React.useState("");
  const [staffNo, setStaffNo] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [companyPicker, setCompanyPicker] = React.useState("");
  const [addedCompanyIds, setAddedCompanyIds] = React.useState<string[]>([]);
  const [removedCompanyIds, setRemovedCompanyIds] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saveError, setSaveError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen || !staff) return;

    setName(staff.name);
    setStaffNo(staff.staffNo);
    setEmail(staff.email);
    setPhone(staff.phone);
    setPassword("");
    setCompanyPicker("");
    setAddedCompanyIds([]);
    setRemovedCompanyIds([]);
    setErrors({});
    setSaveError("");
  }, [isOpen, staff]);

  const originalAssignedCompanies: CompanyTag[] =
    staff?.role === "ADMIN" ? staff.assignedCompanies : [];

  const activeAssignedCompanies = React.useMemo(() => {
    if (!isAdminStaff || !staff) return [];
    return originalAssignedCompanies.filter(
      (company) => !removedCompanyIds.includes(company.companyId)
    );
  }, [isAdminStaff, staff, originalAssignedCompanies, removedCompanyIds]);

  const removedAssignedCompanies = React.useMemo(() => {
    if (!isAdminStaff || !staff) return [];
    return originalAssignedCompanies.filter((company) =>
      removedCompanyIds.includes(company.companyId)
    );
  }, [isAdminStaff, staff, originalAssignedCompanies, removedCompanyIds]);

  const addedCompanies: CompanyOption[] = React.useMemo(
    () => options.adminCompanies.filter((company) => addedCompanyIds.includes(company.id)),
    [options.adminCompanies, addedCompanyIds]
  );

  const availableCompanyOptions = React.useMemo(() => {
    if (!isAdminStaff || !staff) return [];

    const baseOptions = options.adminCompanies.map((company) => ({
      id: company.id,
      name: company.name,
    }));

    const undoOptions = removedAssignedCompanies.map((company) => ({
      id: company.companyId,
      name: company.name,
    }));

    const merged = [...baseOptions, ...undoOptions];
    const seen = new Set<string>();

    return merged.filter((company) => {
      if (seen.has(company.id)) return false;
      if (addedCompanyIds.includes(company.id)) return false;
      if (activeAssignedCompanies.some((item) => item.companyId === company.id)) return false;

      seen.add(company.id);
      return true;
    });
  }, [
    isAdminStaff,
    staff,
    options.adminCompanies,
    removedAssignedCompanies,
    addedCompanyIds,
    activeAssignedCompanies,
  ]);

  const addCompany = () => {
    if (!companyPicker) return;

    const isRemovedExisting = removedAssignedCompanies.some(
      (company) => company.companyId === companyPicker
    );

    if (isRemovedExisting) {
      setRemovedCompanyIds((prev) => prev.filter((id) => id !== companyPicker));
    } else {
      setAddedCompanyIds((prev) => (prev.includes(companyPicker) ? prev : [...prev, companyPicker]));
    }

    setCompanyPicker("");
    if (errors.companyIds) {
      setErrors((prev) => ({ ...prev, companyIds: "" }));
    }
  };

  const removeCompany = (companyId: string) => {
    const isOriginallyAssigned = originalAssignedCompanies.some(
      (company) => company.companyId === companyId
    );

    if (isOriginallyAssigned) {
      setRemovedCompanyIds((prev) =>
        prev.includes(companyId) ? prev : [...prev, companyId]
      );
      return;
    }

    setAddedCompanyIds((prev) => prev.filter((id) => id !== companyId));
  };

  const validate = (): boolean => {
    if (!staff) return false;

    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = "Name is required";
    if (!staffNo.trim()) nextErrors.staffNo = "Staff number is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    if (!phone.trim()) nextErrors.phone = "Phone is required";

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (phone.trim() && phone.trim().length < 10) {
      nextErrors.phone = "Phone number must have at least 10 digits";
    }

    if (password.trim() && password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (staff.role === "ADMIN") {
      const finalCompanyCount = activeAssignedCompanies.length + addedCompanies.length;
      if (finalCompanyCount === 0) {
        nextErrors.companyIds =
          "An admin must remain assigned to at least one company. Use delete if you want to remove the admin completely.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).every((key) => !nextErrors[key]);
  };

  const handleSave = async () => {
    if (!staff || !validate()) return;

    setSaving(true);
    setSaveError("");

    try {
      await staffService.update(staff.id, {
        name: name.trim(),
        staffNo: staffNo.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        ...(password.trim() ? { password: password.trim() } : {}),
        ...(staff.role === "ADMIN" && addedCompanyIds.length > 0
          ? { addCompanyIds: addedCompanyIds }
          : {}),
        ...(staff.role === "ADMIN" && removedCompanyIds.length > 0
          ? { removeCompanyIds: removedCompanyIds }
          : {}),
      });

      await onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to update staff member.";

      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !staff) return null;

  return (
    <ModalShell
      open={isOpen}
      title="Edit Staff"
      onClose={onClose}
      widthClassName="w-[820px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden"
    >
      <div className="space-y-4">
        {adminEditLocked && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Admin accounts can only be edited by the owner.
          </div>
        )}

        {saveError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {saveError}
          </div>
        )}

        <div className="space-y-2">
          <FieldLabel>Name</FieldLabel>
          <RoundedInput
            value={name}
            onChange={setName}
            placeholder="Enter name"
            disabled={adminEditLocked}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <FieldLabel>Staff No</FieldLabel>
          <RoundedInput
            value={staffNo}
            onChange={(value) => setStaffNo(value.replace(/\D/g, ""))}
            placeholder="Enter staff number"
            disabled={adminEditLocked}
          />
          {errors.staffNo && <p className="text-xs text-red-500">{errors.staffNo}</p>}
        </div>

        {staff.role === "ADMIN" ? (
          <>
            <div className="space-y-2">
              <FieldLabel>Assigned Companies</FieldLabel>
              <div className="min-h-[48px] rounded-2xl border border-gray-200 px-3 py-3">
                <div className="flex flex-wrap gap-2">
                  {activeAssignedCompanies.map((company) =>
                    adminEditLocked ? (
                      <StaticTag key={company.companyId}>{company.name}</StaticTag>
                    ) : (
                      <RemovableTag
                        key={company.companyId}
                        onRemove={() => removeCompany(company.companyId)}
                      >
                        {company.name}
                      </RemovableTag>
                    )
                  )}

                  {addedCompanies.map((company) => (
                    <RemovableTag key={company.id} onRemove={() => removeCompany(company.id)}>
                      {company.name}
                    </RemovableTag>
                  ))}

                  {activeAssignedCompanies.length === 0 && addedCompanies.length === 0 && (
                    <span className="text-xs text-gray-300">No companies selected</span>
                  )}
                </div>
              </div>
              {errors.companyIds && <p className="text-xs text-red-500">{errors.companyIds}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel>Company</FieldLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <RoundedSelect
                    value={companyPicker}
                    onChange={setCompanyPicker}
                    placeholder="Select company to add"
                    options={availableCompanyOptions.map((company) => ({
                      value: company.id,
                      label: company.name,
                    }))}
                    disabled={adminEditLocked || availableCompanyOptions.length === 0}
                  />
                </div>
                <button
                  type="button"
                  onClick={addCompany}
                  disabled={adminEditLocked || !companyPicker}
                  className="rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <FieldLabel>Branch</FieldLabel>
            <RoundedInput
              value={staff.branchName}
              onChange={() => undefined}
              placeholder="Branch"
              disabled={true}
            />
          </div>
        )}

        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <RoundedInput
            value={email}
            onChange={setEmail}
            placeholder="Enter email"
            type="email"
            disabled={adminEditLocked}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <FieldLabel>Phone</FieldLabel>
          <RoundedInput
            value={phone}
            onChange={(value) => setPhone(value.replace(/\D/g, ""))}
            placeholder="Enter phone number"
            disabled={adminEditLocked}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <FieldLabel>Password</FieldLabel>
          <RoundedInput
            value={password}
            onChange={setPassword}
            placeholder="Leave blank to keep the current password"
            type="password"
            disabled={adminEditLocked}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        <PopupActions
          actions={[
            { label: "Cancel", onClick: onClose, variant: "secondary" },
            {
              label: saving ? "Saving..." : "Save Changes",
              onClick: handleSave,
              variant: "primary",
            },
          ]}
        />
      </div>
    </ModalShell>
  );
}