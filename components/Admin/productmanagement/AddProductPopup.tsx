"use client";

import * as React from "react";
import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { BusinessTypeId, getCategoriesByBusinessType } from "@/components/Admin/productmanagement/Productcategorydata";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductOption = {
  id: number;
  name: string;
  values: string[];
};

type ProductVariant = {
  id: number;
  sku: string;
  barcode: string;
  imageUrl: string;
  basePrice: string;
  sellingPrice: string;
  sellUnit: string;
  optionValues: { optionName: string; value: string }[];
};

type ProductState = {
  name: string;
  categoryId: string;
  brand: string;
  description: string;
  options: ProductOption[];
  variants: ProductVariant[];
};

export type ExistingProduct = {
  id: number | string;
  name: string;
  category: string;
  brand?: string;
  description?: string;
  options?: ProductOption[];
  variants?: ProductVariant[];
};

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ProductState) => void;
  initialData?: ProductState | null;
  userRole?: "owner" | "admin" | "manager";
  businessTypeId?: BusinessTypeId;
  branchId?: number;
  branchName?: string;
  branchManager?: string;
  isAddVariantMode?: boolean;
  existingProducts?: ExistingProduct[];
  companyProduct?: ExistingProduct | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ["Product info", "Options", "Variants"];
const OPTION_NAMES = ["Weight", "Size", "Volume", "Colour", "Flavour", "Pack Size"];
const SELL_UNITS = ["Each", "kg", "g", "mg", "l", "ml", "m", "inch", "Cube"];
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const emptyState = (): ProductState => ({
  name: "",
  categoryId: "",
  brand: "",
  description: "",
  options: [],
  variants: [],
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NEW_ID_PREFIX = 9_000_000;

function isNewId(id: number) {
  return id >= NEW_ID_PREFIX;
}

// ─── Small reusable UI pieces ─────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] text-gray-500 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-4xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${props.className ?? ""}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-4xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full text-sm px-3 py-2 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-y min-h-[80px] transition ${props.className ?? ""}`}
    />
  );
}

function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>;
}

function SectionTitle({ title, tooltip }: { title: string; tooltip?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-1">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
      {tooltip}
    </div>
  );
}

function Tooltip({ text, position = "top" }: { text: string; position?: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <span className="relative group inline-flex items-center ml-1 cursor-default">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">i</span>
      <span className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isTop ? "bottom-full mb-2" : "top-full mt-2"}`}>
        {text}
        <span className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${isTop ? "top-full border-t-gray-800" : "bottom-full border-b-gray-800"}`} />
      </span>
    </span>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <p className="text-[12px] text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-700 px-3 py-2 bg-gray-50 border border-gray-200 rounded-4xl min-h-[38px]">{value || "—"}</p>
    </div>
  );
}

function ManagerInfoBanner({ step }: { step: "options" | "variants" }) {
  return (
    <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
      <p className="text-[12px] text-orange-700 leading-relaxed">
        The {step === "options" ? "options" : "variants"} below are commonly used across your company.{" "}
        <strong>Click to select the {step === "options" ? "options" : "variants"} you'd like to add to your branch</strong> — anything left unselected will be excluded from your request.
      </p>
    </div>
  );
}

function ManagerEditInfoBanner({ step }: { step: "options" | "variants" }) {
  return (
    <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-300">
      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
      <p className="text-[12px] text-orange-700 leading-relaxed">
        {step === "options"
          ? "These are company-level options not yet added to your branch. Select the ones you want, or add a brand-new option — new additions will be submitted for approval."
          : "These are company-level variants not yet added to your branch. Select the ones you want, or add a brand-new variant — new additions will be submitted for approval."}
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewBadge() {
  return (
    <span className="ml-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-orange-500 text-white tracking-wide">
      New
    </span>
  );
}

// ─── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ current, onGo }: { current: number; onGo: (n: number) => void }) {
  return (
    <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onGo(i)}
            className={`flex-1 py-2.5 text-[11px] border-r border-gray-200 last:border-r-0 transition cursor-pointer
              ${active ? "bg-orange-50 text-orange-500 font-bold" : done ? "bg-gray-50 text-orange-500 font-medium" : "bg-gray-50 text-gray-400 hover:text-gray-600 font-medium"}`}
          >
            <span className={`inline-block mr-1 text-[10px] ${done ? "text-orange-400" : ""}`}>{done ? "✓" : i + 1}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Product Selection Table (manager add-variant flow) ──────────────

function Step1VariantSelect({
  products,
  selectedIds,
  onToggle,
  onSelectAll,
  onLoadProduct,
}: {
  products: ExistingProduct[];
  selectedIds: Set<number | string>;
  onToggle: (p: ExistingProduct) => void;
  onSelectAll: (filtered: ExistingProduct[], checked: boolean) => void;
  onLoadProduct: (p: ExistingProduct) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));
  const someFilteredSelected =
    filtered.some((p) => selectedIds.has(p.id)) && !allFilteredSelected;

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(filtered, e.target.checked);
  };

  return (
    <>
      <SectionTitle
        title="Select a product to add a variant to"
        tooltip={
          <Tooltip
            text="You can add products, variants and options of company by checking this checkbox."
            position="bottom"
          />
        }
      />

      <div className="mb-3 flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search by name, category or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="overflow-y-auto rounded-xl border border-gray-200" style={{ maxHeight: "38vh" }}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No products found.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">

                {/* ── Select-all checkbox ── */}
                <th className="px-4 py-2.5 w-10">
                  <div className="relative group inline-flex items-center gap-1.5">
                    {/* Native checkbox — indeterminate set via ref */}
                    <SelectAllCheckbox
                      checked={allFilteredSelected}
                      indeterminate={someFilteredSelected}
                      onChange={handleSelectAllChange}
                    />
                    {/* Info icon */}
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold cursor-default select-none">
                      i
                    </span>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute z-50 left-0 top-full mt-2 w-64 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-normal leading-relaxed">
                      You can add products, variants and options of company by checking this checkbox.
                      <span className="absolute left-4 bottom-full border-4 border-transparent border-b-gray-800" />
                    </span>
                  </div>
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Product name</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Variants</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isSel = selectedIds.has(p.id);
                return (
                  <tr
                    key={p.id}
                    onClick={() => { onToggle(p); onLoadProduct(p); }}
                    className={`border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${isSel ? "bg-orange-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 transition-colors flex-shrink-0
                          ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}
                      >
                        {isSel && <CheckIcon />}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 text-gray-500">{p.brand || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {p.variants?.length ?? 0} variant{(p.variants?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedIds.size > 0 && (
        <p className="mt-3 text-[12px] text-orange-500 font-medium flex items-center gap-1">
          <span>✓</span>{" "}
          {selectedIds.size === 1
            ? "1 product selected"
            : `${selectedIds.size} products selected`}{" "}
          — click <strong>Continue</strong> to choose options and variants.
        </p>
      )}
    </>
  );
}

// ─── Indeterminate checkbox helper ────────────────────────────────────────────

function SelectAllCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
    />
  );
}

// ─── Step 1 — Product info (standard editable / manager read-only) ────────────

function Step1({
  state,
  onChange,
  categories,
  isManagerEditMode,
}: {
  state: ProductState;
  onChange: (patch: Partial<ProductState>) => void;
  categories: { categoryId: string; categoryName: string }[];
  isManagerEditMode: boolean;
}) {
  if (isManagerEditMode) {
    const categoryName = categories.find((c) => c.categoryId === state.categoryId)?.categoryName ?? state.categoryId;
    return (
      <>
        <SectionTitle title="Product information" />
        <div className="flex items-start gap-3 mb-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-300">
          <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold">i</span>
          <p className="text-[12px] text-orange-700 leading-relaxed">
            Product information is managed by the admin and <strong>cannot be edited here</strong>. You can add new options or variants in the next steps.
          </p>
        </div>
        <ReadonlyField label="Product name" value={state.name} />
        <Grid2>
          <ReadonlyField label="Category" value={categoryName} />
          <ReadonlyField label="Brand" value={state.brand} />
        </Grid2>
        <ReadonlyField label="Description" value={state.description} />
      </>
    );
  }

  return (
    <>
      <SectionTitle title="Product information" />
      <FieldWrap>
        <Label required>Product name</Label>
        <Input placeholder="Enter Product Name" value={state.name} onChange={(e) => onChange({ name: e.target.value })} />
      </FieldWrap>
      <Grid2>
        <FieldWrap>
          <Label required>Category</Label>
          <Select value={state.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
            <option value="">Select…</option>
            {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </Select>
        </FieldWrap>
        <FieldWrap>
          <Label required>Brand</Label>
          <Input placeholder="Enter Brand Name" value={state.brand} onChange={(e) => onChange({ brand: e.target.value })} />
        </FieldWrap>
      </Grid2>
      <FieldWrap>
        <Label>Description</Label>
        <Textarea placeholder="What is this product? Include key details…" value={state.description} onChange={(e) => onChange({ description: e.target.value })} />
      </FieldWrap>
    </>
  );
}

// ─── Step 2 — Options ─────────────────────────────────────────────────────────

function Step2({
  state,
  onChange,
  isManagerVariantMode,
  isManagerEditMode,
  selectedOptionIds,
  onToggleOption,
}: {
  state: ProductState;
  onChange: (patch: Partial<ProductState>) => void;
  isManagerVariantMode: boolean;
  isManagerEditMode: boolean;
  selectedOptionIds: Set<number>;
  onToggleOption: (id: number) => void;
}) {
  const addOption = () => onChange({ options: [...state.options, { id: Date.now(), name: "", values: [] }] });
  const removeOption = (id: number) => onChange({ options: state.options.filter((o) => o.id !== id) });
  const updateName = (id: number, name: string) => onChange({ options: state.options.map((o) => (o.id === id ? { ...o, name } : o)) });
  const addValue = (id: number, val: string) =>
    onChange({ options: state.options.map((o) => (o.id === id && !o.values.includes(val) ? { ...o, values: [...o.values, val] } : o)) });
  const removeValue = (id: number, val: string) =>
    onChange({ options: state.options.map((o) => (o.id === id ? { ...o, values: o.values.filter((v) => v !== val) } : o)) });

  const addManagerOption = () =>
    onChange({ options: [...state.options, { id: NEW_ID_PREFIX + Date.now(), name: "", values: [] }] });
  const removeManagerOption = (id: number) => onChange({ options: state.options.filter((o) => o.id !== id) });

  if (isManagerVariantMode) {
    return (
      <>
        <SectionTitle title="Product options" tooltip={<Tooltip text="Select the options you want to enable for your branch." position="bottom" />} />
        <ManagerInfoBanner step="options" />
        {state.options.map((opt, idx) => {
          const isSel = selectedOptionIds.has(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => onToggleOption(opt.id)}
              className={`border rounded-xl p-4 mb-3 cursor-pointer select-none transition-all duration-150
                ${isSel ? "bg-orange-50 border-orange-400 shadow-sm" : "bg-gray-50 border-gray-200 opacity-50"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 transition-colors flex-shrink-0 ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}>
                  {isSel && <CheckIcon />}
                </span>
                <span className="text-[13px] font-medium text-gray-700">Option {idx + 1}</span>
              </div>
              <FieldWrap>
                <Label>Option type</Label>
                <p className="text-sm text-gray-700 px-3 py-2 bg-white border border-gray-200 rounded-4xl">{opt.name || "—"}</p>
              </FieldWrap>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {opt.values.map((v) => (
                  <span key={v} className="text-[12px] px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">{v}</span>
                ))}
              </div>
            </div>
          );
        })}
        {state.options.length > 0 && (
          <p className="text-[12px] text-gray-400 mt-2 text-center">
            {selectedOptionIds.size} of {state.options.length} option{state.options.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </>
    );
  }

  if (isManagerEditMode) {
    const companyOptions = state.options.filter((o) => !isNewId(o.id));
    const newOptions = state.options.filter((o) => isNewId(o.id));

    return (
      <>
        <SectionTitle title="Product options" tooltip={<Tooltip text="Select company options to add to your branch, or create brand-new ones." position="bottom" />} />
        <ManagerEditInfoBanner step="options" />

        {companyOptions.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Available from company</p>
            {companyOptions.map((opt, idx) => {
              const isSel = selectedOptionIds.has(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => onToggleOption(opt.id)}
                  className={`border rounded-xl p-4 mb-3 cursor-pointer select-none transition-all duration-150
                    ${isSel ? "bg-orange-50 border-orange-400 shadow-sm" : "bg-gray-50 border-gray-200 opacity-50"}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 transition-colors flex-shrink-0 ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}>
                      {isSel && <CheckIcon />}
                    </span>
                    <span className="text-[13px] font-medium text-gray-700">Option {idx + 1}</span>
                  </div>
                  <FieldWrap>
                    <Label>Option type</Label>
                    <p className="text-sm text-gray-700 px-3 py-2 bg-white border border-gray-200 rounded-4xl">{opt.name || "—"}</p>
                  </FieldWrap>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.values.map((v) => (
                      <span key={v} className="text-[12px] px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">{v}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            {companyOptions.length > 0 && (
              <p className="text-[12px] text-gray-400 mb-4 text-center">
                {selectedOptionIds.size} of {companyOptions.length} company option{companyOptions.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </>
        )}

        {newOptions.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-2">New options (pending approval)</p>
            {newOptions.map((opt, idx) => (
              <div key={opt.id} className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium text-gray-700">New option {idx + 1}</span>
                    <NewBadge />
                  </div>
                  <button type="button" onClick={() => removeManagerOption(opt.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition">
                    Remove
                  </button>
                </div>
                <FieldWrap>
                  <Label required>Option type</Label>
                  <Select value={opt.name} onChange={(e) => updateName(opt.id, e.target.value)}>
                    <option value="">Select type…</option>
                    {OPTION_NAMES.map((n) => <option key={n}>{n}</option>)}
                  </Select>
                </FieldWrap>
                <FieldWrap>
                  <Label>Values (press Enter to add)</Label>
                  <Input
                    placeholder="e.g. 500mg"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) { addValue(opt.id, val); (e.target as HTMLInputElement).value = ""; }
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {opt.values.map((v) => (
                      <span key={v} className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                        {v}
                        <button type="button" onClick={() => removeValue(opt.id, v)} className="text-orange-400 hover:text-red-500 leading-none">×</button>
                      </span>
                    ))}
                  </div>
                </FieldWrap>
              </div>
            ))}
          </>
        )}

        {companyOptions.length === 0 && newOptions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No company options available. Add a new one below.</p>
        )}

        <button type="button" onClick={addManagerOption} className="w-full py-2.5 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-4xl hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer">
          + Add new option
        </button>
      </>
    );
  }

  return (
    <>
      <SectionTitle title="Product options" tooltip={<Tooltip text="Options are dimensions like Size or Colour. Each option gets values (e.g. Small, Medium, Large)." position="bottom" />} />
      {state.options.map((opt, idx) => (
        <div key={opt.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-medium text-gray-700">Option {idx + 1}</span>
            <button type="button" onClick={() => removeOption(opt.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition">Remove</button>
          </div>
          <FieldWrap>
            <Label required>Option type</Label>
            <Select value={opt.name} onChange={(e) => updateName(opt.id, e.target.value)}>
              <option value="">Select type…</option>
              {OPTION_NAMES.map((n) => <option key={n}>{n}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap>
            <Label>Values (press Enter to add)</Label>
            <Input
              placeholder="e.g. 500mg"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) { addValue(opt.id, val); (e.target as HTMLInputElement).value = ""; }
              }}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {opt.values.map((v) => (
                <span key={v} className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                  {v}
                  <button type="button" onClick={() => removeValue(opt.id, v)} className="text-orange-400 hover:text-red-500 leading-none">×</button>
                </span>
              ))}
            </div>
          </FieldWrap>
        </div>
      ))}
      <button type="button" onClick={addOption} className="w-full py-2.5 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-4xl hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer">
        + Add option
      </button>
    </>
  );
}

// ─── Step 3 — Variants ────────────────────────────────────────────────────────

function Step3({
  state,
  onChange,
  businessTypeId,
  isManagerVariantMode,
  isManagerEditMode,
  selectedVariantIds,
  onToggleVariant,
}: {
  state: ProductState;
  onChange: (patch: Partial<ProductState>) => void;
  businessTypeId?: BusinessTypeId;
  isManagerVariantMode: boolean;
  isManagerEditMode: boolean;
  selectedVariantIds: Set<number>;
  onToggleVariant: (id: number) => void;
}) {
  const isCafe = businessTypeId === "bt-001";

  const addManual = () =>
    onChange({ variants: [...state.variants, { id: Date.now(), sku: "", barcode: "", imageUrl: "", basePrice: "", sellingPrice: "", sellUnit: "Each", optionValues: [] }] });

  const addManagerVariant = () =>
    onChange({ variants: [...state.variants, { id: NEW_ID_PREFIX + Date.now(), sku: "", barcode: "", imageUrl: "", basePrice: "", sellingPrice: "", sellUnit: "Each", optionValues: [] }] });

  const remove = (id: number) => onChange({ variants: state.variants.filter((v) => v.id !== id) });
  const update = (id: number, key: keyof ProductVariant, val: string) =>
    onChange({ variants: state.variants.map((v) => (v.id === id ? { ...v, [key]: val } : v)) });

  const [variantImages, setVariantImages] = React.useState<Record<number, string>>({});
  const handleVariantImage = (id: number, file: File | null) => {
    if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) return;
    const url = URL.createObjectURL(file);
    setVariantImages((prev) => ({ ...prev, [id]: url }));
    update(id, "imageUrl", url);
  };

  const EditableVariantFields = ({ v }: { v: ProductVariant }) => (
    <>
      <Grid2>
        <FieldWrap>
          <Label required>SKU</Label>
          <Input placeholder="SKU-001" value={v.sku} onChange={(e) => update(v.id, "sku", e.target.value)} />
        </FieldWrap>
        <FieldWrap>
          <Label>Barcode</Label>
          <Input placeholder="1234567890" value={v.barcode} onChange={(e) => update(v.id, "barcode", e.target.value)} />
        </FieldWrap>
      </Grid2>
      <Grid3>
        <FieldWrap>
          <Label required>Base price</Label>
          <Input type="number" placeholder="0.00" value={v.basePrice} onChange={(e) => update(v.id, "basePrice", e.target.value)} />
        </FieldWrap>
        <FieldWrap>
          <Label required>Selling price</Label>
          <Input type="number" placeholder="0.00" value={v.sellingPrice} onChange={(e) => update(v.id, "sellingPrice", e.target.value)} />
        </FieldWrap>
        <FieldWrap>
          <Label>Sell unit</Label>
          <Select value={v.sellUnit} onChange={(e) => update(v.id, "sellUnit", e.target.value)}>
            {SELL_UNITS.map((u) => <option key={u}>{u}</option>)}
          </Select>
        </FieldWrap>
      </Grid3>
      {isCafe && (
        <FieldWrap>
          <Label required>Variant image</Label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleVariantImage(v.id, e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-orange-600 hover:file:bg-orange-100 hover:file:cursor-pointer"
          />
          {variantImages[v.id] && (
            <div className="relative mt-2 h-20 w-20">
              <Image src={variantImages[v.id]} alt="Preview" fill className="rounded-lg object-cover border" sizes="80px" />
              <button
                type="button"
                onClick={() => { setVariantImages((p) => { const n = { ...p }; delete n[v.id]; return n; }); update(v.id, "imageUrl", ""); }}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-black"
              >✕</button>
            </div>
          )}
        </FieldWrap>
      )}
    </>
  );

  if (isManagerVariantMode) {
    return (
      <>
        <SectionTitle title="Product variants" tooltip={<Tooltip text="Select the variants you want to add to your branch." position="bottom" />} />
        <ManagerInfoBanner step="variants" />
        {state.variants.map((v, idx) => {
          const label = v.optionValues.length ? v.optionValues.map((o) => o.value).join(" · ") : `Variant ${idx + 1}`;
          const isSel = selectedVariantIds.has(v.id);
          return (
            <div
              key={v.id}
              onClick={() => onToggleVariant(v.id)}
              className={`border rounded-xl p-4 mb-3 cursor-pointer select-none transition-all duration-150
                ${isSel ? "bg-orange-50 border-orange-400 shadow-sm" : "bg-gray-50 border-gray-200 opacity-50"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 flex-shrink-0 ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}>
                  {isSel && <CheckIcon />}
                </span>
                <span className="text-[12px] font-medium text-gray-600">{label}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["SKU", v.sku], ["Base price", v.basePrice ? `$${v.basePrice}` : "—"], ["Selling price", v.sellingPrice ? `$${v.sellingPrice}` : "—"]].map(([lbl, val]) => (
                  <div key={lbl} className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-400 mb-0.5">{lbl}</p>
                    <p className="text-[13px] font-medium text-gray-700">{val || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {state.variants.length > 0 && (
          <p className="text-[12px] text-gray-400 mt-2 text-center">
            {selectedVariantIds.size} of {state.variants.length} variant{state.variants.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </>
    );
  }

  if (isManagerEditMode) {
    const companyVariants = state.variants.filter((v) => !isNewId(v.id));
    const newVariants = state.variants.filter((v) => isNewId(v.id));

    return (
      <>
        <SectionTitle title="Product variants" tooltip={<Tooltip text="Select company variants to add to your branch, or create brand-new ones." position="bottom" />} />
        <ManagerEditInfoBanner step="variants" />

        {companyVariants.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Available from company</p>
            {companyVariants.map((v, idx) => {
              const label = v.optionValues.length ? v.optionValues.map((o) => o.value).join(" · ") : `Variant ${idx + 1}`;
              const isSel = selectedVariantIds.has(v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => onToggleVariant(v.id)}
                  className={`border rounded-xl p-4 mb-3 cursor-pointer select-none transition-all duration-150
                    ${isSel ? "bg-orange-50 border-orange-400 shadow-sm" : "bg-gray-50 border-gray-200 opacity-50"}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 flex-shrink-0 ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}>
                      {isSel && <CheckIcon />}
                    </span>
                    <span className="text-[12px] font-medium text-gray-600">{label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[["SKU", v.sku], ["Base price", v.basePrice ? `$${v.basePrice}` : "—"], ["Selling price", v.sellingPrice ? `$${v.sellingPrice}` : "—"]].map(([lbl, val]) => (
                      <div key={lbl} className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <p className="text-[10px] text-gray-400 mb-0.5">{lbl}</p>
                        <p className="text-[13px] font-medium text-gray-700">{val || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {companyVariants.length > 0 && (
              <p className="text-[12px] text-gray-400 mb-4 text-center">
                {selectedVariantIds.size} of {companyVariants.length} company variant{companyVariants.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </>
        )}

        {newVariants.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-2">New variants (pending approval)</p>
            {newVariants.map((v, idx) => (
              <div key={v.id} className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-gray-600">New variant {idx + 1}</span>
                    <NewBadge />
                  </div>
                  <button type="button" onClick={() => remove(v.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition cursor-pointer">Remove</button>
                </div>
                <EditableVariantFields v={v} />
              </div>
            ))}
          </>
        )}

        {companyVariants.length === 0 && newVariants.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No company variants available. Add a new one below.</p>
        )}

        <button type="button" onClick={addManagerVariant} className="w-full py-2.5 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-4xl hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer">
          + Add new variant
        </button>
      </>
    );
  }

  return (
    <>
      <SectionTitle title="Product variants" tooltip={<Tooltip text="Each variant is a unique sellable combination (e.g. 500mg · Red). SKU and pricing are required." position="bottom" />} />
      {state.variants.map((v, idx) => {
        const label = v.optionValues.length ? v.optionValues.map((o) => o.value).join(" · ") : `Variant ${idx + 1}`;
        return (
          <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-medium text-gray-600">{label}</span>
              <button type="button" onClick={() => remove(v.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition cursor-pointer">Remove</button>
            </div>
            <EditableVariantFields v={v} />
          </div>
        );
      })}
      <button type="button" onClick={addManual} className="w-full py-2.5 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-4xl hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer">
        + Add Variant
      </button>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AddProductPopup({
  open,
  onClose,
  onSave,
  initialData,
  userRole,
  businessTypeId,
  branchId = 0,
  branchName = "",
  branchManager = "",
  isAddVariantMode = false,
  existingProducts = [],
  companyProduct = null,
}: AddProductPopupProps) {
  const { addNotification } = useNotifications();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<ProductState>(emptyState());
  const categories = getCategoriesByBusinessType(businessTypeId);

  // ── Multi-select for variant mode (replaces single selectedExistingId) ──
  const [selectedProductIds, setSelectedProductIds] = React.useState<Set<number | string>>(new Set());
  // Last-clicked product drives the options/variants shown in steps 2 & 3
  const [activeProduct, setActiveProduct] = React.useState<ExistingProduct | null>(null);

  const [selectedOptionIds, setSelectedOptionIds] = React.useState<Set<number>>(new Set());
  const [selectedVariantIds, setSelectedVariantIds] = React.useState<Set<number>>(new Set());

  const isManagerVariantMode = userRole === "manager" && isAddVariantMode;
  const isManagerEditMode = userRole === "manager" && !!initialData && !isAddVariantMode;

  const modalTitle = isManagerVariantMode ? "Add Product Variant" : initialData ? "Edit Product" : "Add New Product";

  React.useEffect(() => {
    if (!open) return;
    setStep(0);
    setSelectedProductIds(new Set());
    setActiveProduct(null);
    setSelectedOptionIds(new Set());
    setSelectedVariantIds(new Set());

    if (initialData) {
      if (isManagerEditMode && companyProduct) {
        const branchOptionNames = new Set(initialData.options.map((o) => o.name));
        const branchVariantSkus = new Set(initialData.variants.map((v) => v.sku));
        const availableOptions = (companyProduct.options ?? []).filter((o) => !branchOptionNames.has(o.name));
        const availableVariants = (companyProduct.variants ?? []).filter((v) => !branchVariantSkus.has(v.sku));
        setState({ ...initialData, options: availableOptions, variants: availableVariants });
        setSelectedOptionIds(new Set(availableOptions.map((o) => o.id)));
        setSelectedVariantIds(new Set(availableVariants.map((v) => v.id)));
      } else {
        setState(initialData);
      }
    } else {
      setState(emptyState());
    }
  }, [open, initialData, isManagerEditMode, companyProduct]);

  const patch = (p: Partial<ProductState>) => setState((prev) => ({ ...prev, ...p }));

  // Toggle a single product in/out of the selected set
  const handleToggleProduct = (p: ExistingProduct) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(p.id)) {
        next.delete(p.id);
      } else {
        next.add(p.id);
      }
      return next;
    });
  };

  // Select-all / deselect-all for the currently filtered list
  const handleSelectAll = (filtered: ExistingProduct[], checked: boolean) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        filtered.forEach((p) => next.add(p.id));
      } else {
        filtered.forEach((p) => next.delete(p.id));
      }
      return next;
    });
  };

  // When a row is clicked, also load that product's options/variants for steps 2 & 3
  const handleLoadProduct = (p: ExistingProduct) => {
    setActiveProduct(p);
    const opts = (p.options ?? []).map((o) => ({ ...o, id: o.id ?? Math.floor(Date.now() * Math.random()) }));
    const vars = (p.variants ?? []).map((v, i) => ({ ...v, id: v.id ?? i + 1 }));
    setState({ name: p.name, categoryId: p.category, brand: p.brand ?? "", description: p.description ?? "", options: opts, variants: vars });
    setSelectedOptionIds(new Set(opts.map((o) => o.id)));
    setSelectedVariantIds(new Set(vars.map((v) => v.id)));
  };

  const toggleOption = (id: number) =>
    setSelectedOptionIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleVariant = (id: number) =>
    setSelectedVariantIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const hasNewOptions = state.options.some((o) => isNewId(o.id));
  const hasNewVariants = state.variants.some((v) => isNewId(v.id));
  const managerAddedNewItems = isManagerEditMode && (hasNewOptions || hasNewVariants);

  const validateStep = (): string | null => {
    if (step === 0) {
      if (isManagerVariantMode) {
        if (selectedProductIds.size === 0) return "Please select at least one product to add a variant to.";
      } else if (!isManagerEditMode) {
        if (!state.name.trim()) return "Product name is required.";
        if (!state.categoryId) return "Category is required.";
      }
    }
    if (step === 1 && isManagerVariantMode && selectedOptionIds.size === 0)
      return "Please select at least one option.";
    if (step === 2) {
      if (isManagerVariantMode && selectedVariantIds.size === 0)
        return "Please select at least one variant.";
      if (!isManagerVariantMode && !isManagerEditMode) {
        for (const v of state.variants) {
          if (!v.sku.trim()) return "All variants must have a SKU.";
          if (!v.basePrice) return "All variants must have a base price.";
          if (!v.sellingPrice) return "All variants must have a selling price.";
        }
      }
      if (isManagerEditMode) {
        for (const v of state.variants.filter((v) => isNewId(v.id))) {
          if (!v.sku.trim()) return "New variants must have a SKU.";
          if (!v.basePrice) return "New variants must have a base price.";
          if (!v.sellingPrice) return "New variants must have a selling price.";
        }
      }
    }
    return null;
  };

  const goStep = (n: number) => setStep(n);
  const handleNext = () => { const err = validateStep(); if (err) { alert(err); return; } if (step < STEPS.length - 1) setStep((s) => s + 1); };
  const handleBack = () => { if (step > 0) setStep((s) => s - 1); };

  const handleSave = () => {
    let finalState: ProductState;

    if (isManagerVariantMode) {
      finalState = {
        ...state,
        options: state.options.filter((o) => selectedOptionIds.has(o.id)),
        variants: state.variants.filter((v) => selectedVariantIds.has(v.id)),
      };
    } else if (isManagerEditMode) {
      finalState = {
        ...state,
        options: state.options.filter((o) => isNewId(o.id) || selectedOptionIds.has(o.id)),
        variants: state.variants.filter((v) => isNewId(v.id) || selectedVariantIds.has(v.id)),
      };
    } else {
      finalState = state;
    }

    if (userRole === "manager" && (isManagerVariantMode || managerAddedNewItems)) {
      addNotification({
        type: "approval_pending",
        message: `${isManagerVariantMode ? "New variant" : "New items"} request from ${branchName} — "${finalState.name.trim()}" awaiting approval`,
        productApproval: {
          id: Date.now(),
          productName: finalState.name.trim(),
          price: Number(finalState.variants[0]?.sellingPrice ?? 0),
          discount: 0,
          tax: 0,
          stock: 0,
          unit: finalState.variants[0]?.sellUnit ?? "each",
          imageUrl: finalState.variants[0]?.imageUrl ?? "",
          branchId,
          branchName,
          branchManager,
          submittedBy: branchManager,
          submittedAt: new Date().toISOString(),
          status: "pending",
        },
      });
    }

    onSave(finalState);
    onClose();
  };

  const saveLabel = isManagerVariantMode
    ? "Submit Variant Request"
    : isManagerEditMode
      ? managerAddedNewItems ? "Submit for Approval" : "Update Product"
      : initialData
        ? "Update Product"
        : userRole === "manager"
          ? "Submit for Approval"
          : "Add Product";

  return (
    <ModalShell open={open} title={modalTitle} onClose={onClose} widthClassName="w-[860px] max-w-[95vw]">
      <form onSubmit={(e) => { e.preventDefault(); step === STEPS.length - 1 ? handleSave() : handleNext(); }}>
        <StepBar current={step} onGo={goStep} />

        <div className="overflow-y-auto h-[52vh] pr-1">
          {step === 0 && isManagerVariantMode ? (
            <Step1VariantSelect
              products={existingProducts}
              selectedIds={selectedProductIds}
              onToggle={handleToggleProduct}
              onSelectAll={handleSelectAll}
              onLoadProduct={handleLoadProduct}
            />
          ) : step === 0 ? (
            <Step1 state={state} onChange={patch} categories={categories} isManagerEditMode={isManagerEditMode} />
          ) : step === 1 ? (
            <Step2
              state={state}
              onChange={patch}
              isManagerVariantMode={isManagerVariantMode}
              isManagerEditMode={isManagerEditMode}
              selectedOptionIds={selectedOptionIds}
              onToggleOption={toggleOption}
            />
          ) : (
            <Step3
              state={state}
              onChange={patch}
              businessTypeId={businessTypeId}
              isManagerVariantMode={isManagerVariantMode}
              isManagerEditMode={isManagerEditMode}
              selectedVariantIds={selectedVariantIds}
              onToggleVariant={toggleVariant}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 text-sm border border-gray-200 rounded-4xl text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer ${step === 0 ? "invisible" : ""}`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={step === STEPS.length - 1 ? handleSave : handleNext}
            className="px-6 py-2 text-sm rounded-4xl transition font-medium cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
          >
            {step === STEPS.length - 1 ? saveLabel : "Continue"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}