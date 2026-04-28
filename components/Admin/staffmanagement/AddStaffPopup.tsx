"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
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
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
  options: StaffCreateOptions;
  optionsLoading?: boolean;
};

type AdminMode = "" | "NEW" | "EXISTING";
type FormErrors = Record<string, string>;

function ChoiceButton({
  label,
  active,
  disabled,
  onClick,
  isLast = false,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full px-4 py-3 text-center text-sm font-semibold transition ${
        !isLast ? "border-r border-gray-200" : ""
      } ${
        active
          ? "bg-orange-50 text-orange-500"
          : "bg-white text-[#98A2B3]"
      } ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:bg-orange-50/40"
      }`}
    >
      {label}
    </button>
  );
}

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
        disabled ? "border-gray-200 bg-gray-100 text-gray-400" : "border-gray-200 text-gray-700"
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
  onClose,
  onSuccess,
  options,
  optionsLoading = false,
}: Props) {
  const { data: session } = useSession();
  const isOwner = String(session?.user?.role ?? "").toUpperCase() === "OWNER";

  const canAddAdmin = isOwner && options.adminCompanies.length > 0;
  const canAddManager = options.managerBranches.length > 0;

  const [role, setRole] = React.useState<StaffRole>("MANAGER");
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
  const [saveError, setSaveError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    if (canAddManager) {
      setRole("MANAGER");
    } else if (canAddAdmin) {
      setRole("ADMIN");
    }

    setAdminMode("");
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
    setSaveError("");
  }, [isOpen, canAddAdmin, canAddManager]);

  React.useEffect(() => {
    if (!canAddManager && role === "MANAGER" && canAddAdmin) {
      setRole("ADMIN");
      setAdminMode("");
    }

    if (!canAddAdmin && role === "ADMIN") {
      setRole("MANAGER");
      setAdminMode("");
    }
  }, [role, canAddAdmin, canAddManager]);

  const existingAdmin: ExistingAdminOption | undefined = React.useMemo(
    () => options.existingAdmins.find((item) => item.id === existingAdminId),
    [existingAdminId, options.existingAdmins]
  );

  const assignedTags: CompanyTag[] = existingAdmin?.assignedCompanies ?? [];

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
    setSaveError("");
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
      if (!staffNo.trim()) nextErrors.staffNo = "Staff number is required";
      if (!email.trim()) nextErrors.email = "Email is required";
      if (!phone.trim()) nextErrors.phone = "Phone is required";
      if (!password.trim()) nextErrors.password = "Password is required";
    }

    if (role === "ADMIN" && adminMode === "NEW") {
      if (!scopeId) nextErrors.companyId = "Please select a company";
      if (!name.trim()) nextErrors.name = "Name is required";
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

    if (phone.trim() && phone.trim().length < 10) {
      nextErrors.phone = "Phone number must have at least 10 digits";
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
    setSaveError("");

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

      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalShell
      open={isOpen}
      title="Add New Staff"
      onClose={onClose}
      widthClassName="w-[820px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden"
    >
      <div className="px-6 py-5">
        <div className="flex min-h-0 flex-col gap-4">
          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {saveError}
            </div>
          )}

          <div
            className={`grid overflow-hidden rounded border border-gray-200 ${
              isOwner ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {isOwner && (
              <ChoiceButton
                label="Admin"
                active={role === "ADMIN"}
                disabled={!canAddAdmin || optionsLoading}
                isLast={false}
                onClick={() => {
                  setRole("ADMIN");
                  setAdminMode("");
                  resetAdminSelectionState();
                }}
              />
            )}

            <ChoiceButton
              label="Manager"
              active={role === "MANAGER"}
              disabled={!canAddManager || optionsLoading}
              isLast={true}
              onClick={() => {
                setRole("MANAGER");
                setAdminMode("");
                setScopeId("");
                setName("");
                setStaffNo("");
                setEmail("");
                setPhone("");
                setPassword("");
                setErrors({});
                setSaveError("");
              }}
            />
          </div>

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