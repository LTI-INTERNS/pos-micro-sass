"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import type {
  CompanyTag,
  ExistingAdminOption,
  StaffCreateOptions,
  StaffRole,
} from "@/types/staff.types";
import { staffService } from "@/lib/services/staff-service";

type Props = {
  isOpen: boolean;
  role: StaffRole;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  options: StaffCreateOptions;
  optionsLoading?: boolean;
  existingPhones?: string[];
  showToast: (message: string, type: "success" | "error" | "info") => void;
};

type AdminMode = "" | "NEW" | "EXISTING";
type FormErrors = Record<string, string>;

function ActionButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium ${
        active ? "text-orange-600" : "text-gray-500"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          active ? "border-orange-500" : "border-gray-300"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${active ? "bg-orange-500" : "bg-transparent"}`} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[12px] text-gray-500">{children}</label>;
}

function RoundedInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  autoComplete,
  name,
  suppressAutoFill = false,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
  suppressAutoFill?: boolean;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-1p-ignore={suppressAutoFill ? "true" : undefined}
        data-lpignore={suppressAutoFill ? "true" : undefined}
        className={`w-full rounded-full border px-4 py-2 outline-none placeholder:text-gray-300 ${
          disabled ? "border-gray-200 bg-gray-100 text-gray-400" : "border-gray-200 text-gray-700"
        } ${isPassword ? "pr-10" : ""} focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
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
        disabled ? "border-gray-200 bg-gray-100 text-gray-400" : "border-gray-200 text-gray-700"
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

export default function AddStaffPopup({
  isOpen,
  role,
  onClose,
  onSuccess,
  options,
  optionsLoading = false,
  existingPhones = [],
  showToast,
}: Props) {
  const [adminMode, setAdminMode] = React.useState<AdminMode>("");
  const [scopeId, setScopeId] = React.useState("");
  const [existingAdminId, setExistingAdminId] = React.useState("");
  const [selectedCompanyIds, setSelectedCompanyIds] = React.useState<string[]>([]);
  const [companyPicker, setCompanyPicker] = React.useState("");
  const [name, setName] = React.useState("");
  const [staffNo, setStaffNo] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    setAdminMode(role === "ADMIN" ? "NEW" : "");
    setScopeId("");
    setExistingAdminId("");
    setSelectedCompanyIds([]);
    setCompanyPicker("");
    setName("");
    setStaffNo("");
    setEmail("");
    setPhone("");
    setPassword("");
    setErrors({});
  }, [isOpen, role]);

  const existingAdmin: ExistingAdminOption | undefined = React.useMemo(
    () => options.existingAdmins.find((item) => item.id === existingAdminId),
    [existingAdminId, options.existingAdmins]
  );

  const assignedTags: CompanyTag[] = React.useMemo(
    () => existingAdmin?.assignedCompanies ?? [],
    [existingAdmin]
  );

  const existingAssignedCompanyIds = React.useMemo(
    () => assignedTags.map((company) => company.companyId),
    [assignedTags]
  );

  const availableCompanyOptions = React.useMemo(
    () =>
      options.adminCompanies.filter(
        (company) =>
          !selectedCompanyIds.includes(company.id) &&
          !existingAssignedCompanyIds.includes(company.id)
      ),
    [options.adminCompanies, selectedCompanyIds, existingAssignedCompanyIds]
  );

  const selectedNewCompanies = React.useMemo(
    () => options.adminCompanies.filter((company) => selectedCompanyIds.includes(company.id)),
    [options.adminCompanies, selectedCompanyIds]
  );

  const managerBranchOptions = React.useMemo(
    () =>
      options.managerBranches.map((branch) => ({
        value: branch.id,
        label: branch.name,
      })),
    [options.managerBranches]
  );

  const adminCompanyOptions = React.useMemo(
    () =>
      options.adminCompanies.map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [options.adminCompanies]
  );

  const existingAdminOptions = React.useMemo(
    () =>
      options.existingAdmins.map((admin) => ({
        value: admin.id,
        label: `${admin.email} — ${admin.name}`,
      })),
    [options.existingAdmins]
  );

  const resetAdminSelectionState = () => {
    setScopeId("");
    setExistingAdminId("");
    setSelectedCompanyIds([]);
    setCompanyPicker("");
    setName("");
    setStaffNo("");
    setEmail("");
    setPhone("");
    setPassword("");
    setErrors({});
  };

  const addSelectedCompany = () => {
    if (!companyPicker) return;

    setSelectedCompanyIds((prev) => (prev.includes(companyPicker) ? prev : [...prev, companyPicker]));
    setCompanyPicker("");

    if (errors.companyIds) {
      setErrors((prev) => ({ ...prev, companyIds: "" }));
    }
  };

  const removeSelectedCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => prev.filter((item) => item !== companyId));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (role === "MANAGER") {
      if (!scopeId) nextErrors.branchId = "Please select a branch";
      if (!name.trim()) nextErrors.name = "Name is required";
      else if (!/[a-zA-Z]/.test(name)) nextErrors.name = "Name must contain at least one letter (only numbers not allowed)";
      if (!staffNo.trim()) nextErrors.staffNo = "Staff number is required";
      if (!email.trim()) nextErrors.email = "Email is required";
      if (!phone.trim()) nextErrors.phone = "Phone is required";
      if (!password.trim()) nextErrors.password = "Password is required";
    }

    if (role === "ADMIN" && adminMode === "NEW") {
      if (!scopeId) nextErrors.companyId = "Please select a company";
      if (!name.trim()) nextErrors.name = "Name is required";
      else if (!/[a-zA-Z]/.test(name)) nextErrors.name = "Name must contain at least one letter (only numbers not allowed)";
      if (!staffNo.trim()) nextErrors.staffNo = "Staff number is required";
      if (!email.trim()) nextErrors.email = "Email is required";
      if (!phone.trim()) nextErrors.phone = "Phone is required";
      if (!password.trim()) nextErrors.password = "Password is required";
    }

    if (role === "ADMIN" && adminMode === "EXISTING") {
      if (!existingAdminId) nextErrors.existingAdminId = "Please select an admin email";
      if (existingAdminId && selectedCompanyIds.length === 0) {
        nextErrors.companyIds = "Add at least one company";
      }
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (phone.trim() && !/^0\d{9}$/.test(phone.trim())) {
      nextErrors.phone = "Phone must be exactly 10 digits and start with 0 (e.g. 0771234567)";
    } else if (phone.trim() && existingPhones.includes(phone.trim())) {
      showToast("Phone number is already registered to another staff member.", "error");
      nextErrors.phone = "Phone number already in use";
    }

    if (password.trim() && password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      if (role === "MANAGER") {
        await staffService.create({
          role: "MANAGER",
          branchId: scopeId,
          name: name.trim(),
          staffNo: staffNo.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
        });
      } else if (role === "ADMIN" && adminMode === "NEW") {
        await staffService.create({
          role: "ADMIN",
          adminMode: "NEW",
          companyId: scopeId,
          name: name.trim(),
          staffNo: staffNo.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
        });
      } else if (role === "ADMIN" && adminMode === "EXISTING") {
        await staffService.create({
          role: "ADMIN",
          adminMode: "EXISTING",
          existingAdminId,
          companyIds: selectedCompanyIds,
        });
      }

      await onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to save staff member.";

      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      open={isOpen}
      title={role === "ADMIN" ? "Add Admin" : "Add Manager"}
      onClose={onClose}
      widthClassName="w-[820px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden"
    >
      <div className="px-6 py-5">
        <div className="flex min-h-0 flex-col gap-4">
          {role === "ADMIN" && (
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                label="Add New"
                active={adminMode === "NEW"}
                onClick={() => {
                  setAdminMode("NEW");
                  resetAdminSelectionState();
                }}
              />

              <ActionButton
                label="Existing"
                active={adminMode === "EXISTING"}
                disabled={options.existingAdmins.length === 0}
                onClick={() => {
                  setAdminMode("EXISTING");
                  resetAdminSelectionState();
                }}
              />
            </div>
          )}

          <div className="flex-1 space-y-4">
            {role === "MANAGER" && (
              <>
                <div className="space-y-2">
                  <FieldLabel>Branch</FieldLabel>
                  <RoundedSelect
                    value={scopeId}
                    onChange={setScopeId}
                    placeholder={optionsLoading ? "Loading branches..." : "Select branch"}
                    options={managerBranchOptions}
                    disabled={optionsLoading || managerBranchOptions.length === 0}
                  />
                  {errors.branchId && <p className="text-xs text-red-500">{errors.branchId}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Name</FieldLabel>
                  <RoundedInput value={name} onChange={setName} placeholder="Enter name" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Staff No</FieldLabel>
                  <RoundedInput
                    value={staffNo}
                    onChange={(value) => setStaffNo(value.replace(/\D/g, ""))}
                    placeholder="Enter staff number"
                  />
                  {errors.staffNo && <p className="text-xs text-red-500">{errors.staffNo}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Email</FieldLabel>
                  <RoundedInput
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter email"
                    type="email"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Phone</FieldLabel>
                  <RoundedInput
                    value={phone}
                    onChange={(value) => setPhone(value.replace(/\D/g, ""))}
                    placeholder="Enter phone number"
                    name="new-staff-phone"
                    autoComplete="off"
                    suppressAutoFill
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Password</FieldLabel>
                  <RoundedInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter password"
                    type="password"
                    name="new-staff-password"
                    autoComplete="new-password"
                    suppressAutoFill
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
              </>
            )}

            {role === "ADMIN" && adminMode === "NEW" && (
              <>
                <div className="space-y-2">
                  <FieldLabel>Company</FieldLabel>
                  <RoundedSelect
                    value={scopeId}
                    onChange={setScopeId}
                    placeholder={optionsLoading ? "Loading companies..." : "Select company"}
                    options={adminCompanyOptions}
                    disabled={optionsLoading || adminCompanyOptions.length === 0}
                  />
                  {errors.companyId && <p className="text-xs text-red-500">{errors.companyId}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Name</FieldLabel>
                  <RoundedInput value={name} onChange={setName} placeholder="Enter name" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Staff No</FieldLabel>
                  <RoundedInput
                    value={staffNo}
                    onChange={(value) => setStaffNo(value.replace(/\D/g, ""))}
                    placeholder="Enter staff number"
                  />
                  {errors.staffNo && <p className="text-xs text-red-500">{errors.staffNo}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Email</FieldLabel>
                  <RoundedInput
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter email"
                    type="email"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Phone</FieldLabel>
                  <RoundedInput
                    value={phone}
                    onChange={(value) => setPhone(value.replace(/\D/g, ""))}
                    placeholder="Enter phone number"
                    name="new-admin-phone"
                    autoComplete="off"
                    suppressAutoFill
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <FieldLabel>Password</FieldLabel>
                  <RoundedInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter password"
                    type="password"
                    name="new-admin-password"
                    autoComplete="new-password"
                    suppressAutoFill
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>
              </>
            )}

            {role === "ADMIN" && adminMode === "EXISTING" && (
              <>
                <div className="space-y-2">
                  <FieldLabel>Email</FieldLabel>
                  <RoundedSelect
                    value={existingAdminId}
                    onChange={(value) => {
                      setExistingAdminId(value);
                      setSelectedCompanyIds([]);
                      setCompanyPicker("");
                      setErrors((prev) => ({
                        ...prev,
                        existingAdminId: "",
                        companyIds: "",
                      }));
                    }}
                    placeholder="Select existing admin email"
                    options={existingAdminOptions}
                    disabled={optionsLoading || existingAdminOptions.length === 0}
                  />
                  {errors.existingAdminId && (
                    <p className="text-xs text-red-500">{errors.existingAdminId}</p>
                  )}
                </div>

                {existingAdminId && (
                  <>
                    <div className="space-y-2">
                      <FieldLabel>Assigned Companies</FieldLabel>
                      <div className="min-h-[48px] rounded-2xl border border-gray-200 px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          {assignedTags.map((company) => (
                            <StaticTag key={company.companyId}>{company.name}</StaticTag>
                          ))}

                          {selectedNewCompanies.map((company) => (
                            <RemovableTag
                              key={company.id}
                              onRemove={() => removeSelectedCompany(company.id)}
                            >
                              {company.name}
                            </RemovableTag>
                          ))}

                          {assignedTags.length === 0 && selectedNewCompanies.length === 0 && (
                            <span className="text-xs text-gray-300">No companies selected yet</span>
                          )}
                        </div>
                      </div>
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
                            disabled={availableCompanyOptions.length === 0}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={addSelectedCompany}
                          disabled={!companyPicker}
                          className="rounded-full border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                      {errors.companyIds && <p className="text-xs text-red-500">{errors.companyIds}</p>}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <PopupActions
            actions={[
              { label: "Cancel", onClick: onClose, variant: "secondary" },
              { label: saving ? "Saving..." : "Save", onClick: handleSave, variant: "primary" },
            ]}
          />
        </div>
      </div>
    </ModalShell>
  );
}
