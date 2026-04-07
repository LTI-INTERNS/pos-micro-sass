"use client";

import * as React from "react";
import Image from "next/image";
import {
  ProductState,
  ProductVariant,
  ExistingProduct,
  OPTION_NAMES,
  SELL_UNITS,
  MAX_IMAGE_SIZE_MB,
  ALLOWED_IMAGE_TYPES,
  NEW_ID_PREFIX,
  isNewId,
} from "./types";
import { BusinessTypeId } from "@/components/Admin/productmanagement/Productcategorydata";
import {
  Label,
  Input,
  Select,
  Textarea,
  FieldWrap,
  Grid2,
  Grid3,
  SectionTitle,
  Tooltip,
  ReadonlyField,
  ManagerInfoBanner,
  ManagerEditInfoBanner,
  MultiSelectInfoBanner,
  CheckIcon,
  NewBadge,
  SelectAllCheckbox,
} from "./ui-components";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

// ─── Step 1 — Product Selection Table (manager add-variant flow) ──────────────

export function Step1VariantSelect({
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

  // Only selectable products can be toggled via select-all
  const selectableFiltered = filtered.filter((p) => !p.alreadyAdded);
  const allFilteredSelected = selectableFiltered.length > 0 && selectableFiltered.every((p) => selectedIds.has(p.id));
  const someFilteredSelected = selectableFiltered.some((p) => selectedIds.has(p.id)) && !allFilteredSelected;

  return (
    <>
      <SectionTitle
        title="Select a product to add for your branch"
        tooltip={
          <Tooltip
            text="You can add products, variants, and options from the company catalog to your branch by one by one or select multiple or select all at once using the checkbox."
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
                <th className="px-4 py-2.5 w-10">
                  <div className="relative group inline-flex items-center gap-1.5">
                    <SelectAllCheckbox
                      checked={allFilteredSelected}
                      indeterminate={someFilteredSelected}
                      onChange={(e) => onSelectAll(selectableFiltered, e.target.checked)}
                    />
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold cursor-default select-none">
                      i
                    </span>
                    <span className="pointer-events-none absolute z-50 left-0 top-full mt-2 w-64 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-normal leading-relaxed">
                      You can add all the products, variants, and options of the company at once by checking this checkbox.
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
                const isSel    = selectedIds.has(p.id);
                const isAdded  = !!p.alreadyAdded;
                return (
                  <tr
                    key={p.id}
                    onClick={isAdded ? undefined : () => { onToggle(p); onLoadProduct(p); }}
                    className={[
                      "border-b border-gray-100 last:border-b-0 transition-colors",
                      isAdded
                        ? "bg-gray-50 opacity-50 cursor-not-allowed select-none"
                        : isSel
                          ? "bg-orange-50 cursor-pointer"
                          : "hover:bg-gray-50 cursor-pointer",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3">
                      {isAdded ? (
                        /* Locked checkbox visual */
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded border-2 border-gray-200 bg-gray-100 flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 transition-colors flex-shrink-0 ${isSel ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}`}>
                          {isSel && <CheckIcon />}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <span>{p.name}</span>
                      {isAdded && (
                        <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500 tracking-wide">
                          Already added
                        </span>
                      )}
                    </td>
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
          {selectedIds.size === 1 ? "1 product selected" : `${selectedIds.size} products selected`}{" "}
          — click <strong>Continue</strong> to choose options and variants.
        </p>
      )}
    </>
  );
}

// ─── Step 1 — Product info (standard editable / manager read-only) ────────────

export function Step1({
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

export function Step2({
  state,
  onChange,
  isManagerVariantMode,
  isManagerEditMode,
  selectedOptionIds,
  onToggleOption,
  selectedProductCount,
}: {
  state: ProductState;
  onChange: (patch: Partial<ProductState>) => void;
  isManagerVariantMode: boolean;
  isManagerEditMode: boolean;
  selectedOptionIds: Set<number>;
  onToggleOption: (id: number) => void;
  selectedProductCount: number;
}) {
  const isMultiSelect = isManagerVariantMode && selectedProductCount > 1;

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

  // ── Multi-product selected: show info banner only ───────────────────────────
  if (isMultiSelect) {
    return (
      <>
        <SectionTitle title="Product options" />
        <MultiSelectInfoBanner step="options" count={selectedProductCount} />
      </>
    );
  }

  // ── Single product — manager variant mode ───────────────────────────────────
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

  // ── Manager edit mode ───────────────────────────────────────────────────────
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
                  <Label>Values (press Enter or Tab to add)</Label>
                  <Input
                    placeholder="e.g. 500mg"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== "Tab") return;
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) { addValue(opt.id, val); (e.target as HTMLInputElement).value = ""; }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val) { addValue(opt.id, val); e.target.value = ""; }
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

  // ── Standard admin/owner editable view ─────────────────────────────────────
  return (
    <>
      <SectionTitle title="Product options" tooltip={<Tooltip text="Options are dimensions like Size or Colour. Each option gets values (e.g. Small, Medium, Large)." position="bottom" />} />
      {state.options.map((opt, idx) => (
        <div key={opt.id} className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-3">
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
            <Label>Values (press Enter or Tab to add)</Label>
            <Input
              placeholder="e.g. 500mg"
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== "Tab") return;
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) { addValue(opt.id, val); (e.target as HTMLInputElement).value = ""; }
              }}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) { addValue(opt.id, val); e.target.value = ""; }
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
      <button type="button" onClick={addOption} className="w-full py-2.5 text-[13px] text-orange-500 border border-dashed border-orange-300 rounded-4xl hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer">
        + Add option
      </button>
    </>
  );
}

// ─── Step 3 — Variants ────────────────────────────────────────────────────────

export function Step3({
  state,
  onChange,
  businessTypeId,
  isManagerVariantMode,
  isManagerEditMode,
  selectedVariantIds,
  onToggleVariant,
  selectedProductCount,
}: {
  state: ProductState;
  onChange: (patch: Partial<ProductState>) => void;
  businessTypeId?: BusinessTypeId;
  isManagerVariantMode: boolean;
  isManagerEditMode: boolean;
  selectedVariantIds: Set<number>;
  onToggleVariant: (id: number) => void;
  selectedProductCount: number;
}) {
  const isCafe = businessTypeId === "BT001";
  const isMultiSelect = isManagerVariantMode && selectedProductCount > 1;
  const { currency } = useCurrency();
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

  // ── Render pure JSX instead of a Component to prevent input focus loss ─────
  const renderEditableVariantFields = (v: ProductVariant) => (
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
      <FieldWrap>
        <Label>Variant image</Label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleVariantImage(v.id, e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-orange-600 hover:file:bg-orange-100 hover:file:cursor-pointer"
        />
        {/* Show newly-picked image OR existing DB image */}
        {(variantImages[v.id] || v.imageUrl) && (
          <div className="relative mt-2 h-20 w-20 group">
            <Image
              src={variantImages[v.id] || v.imageUrl!}
              alt="Preview"
              fill
              className="rounded-lg object-cover border border-gray-200"
              sizes="80px"
            />
            {/* Label: "Current" when showing DB image, "New" when showing local pick */}
            <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-semibold text-white bg-black/40 rounded-b-lg py-0.5 pointer-events-none">
              {variantImages[v.id] ? "New" : "Current"}
            </span>
            <button
              type="button"
              onClick={() => {
                setVariantImages((p) => { const n = { ...p }; delete n[v.id]; return n; });
                update(v.id, "imageUrl", "");
              }}
              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-black opacity-0 group-hover:opacity-100 transition"
            >✕</button>
          </div>
        )}
      </FieldWrap>
    </>
  );

  // ── Multi-product selected: show info banner only ───────────────────────────
  if (isMultiSelect) {
    return (
      <>
        <SectionTitle title="Product variants" />
        <MultiSelectInfoBanner step="variants" count={selectedProductCount} />
      </>
    );
  }

  // ── Single product — manager variant mode ───────────────────────────────────
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
                {[["SKU", v.sku], ["Base price", v.basePrice ? formatCurrency(Number(v.basePrice), currency) : "—"], ["Selling price", v.sellingPrice ? formatCurrency(Number(v.sellingPrice), currency) : "—"]].map(([lbl, val]) => (
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

  // ── Manager edit mode ───────────────────────────────────────────────────────
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
                    {[["SKU", v.sku], ["Base price", v.basePrice ? formatCurrency(Number(v.basePrice), currency) : "—"], ["Selling price", v.sellingPrice ? formatCurrency(Number(v.sellingPrice), currency) : "—"]].map(([lbl, val]) => (
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
                {renderEditableVariantFields(v)}
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

  // ── Standard admin/owner editable view ─────────────────────────────────────
  return (
    <>
      <SectionTitle title="Product variants" tooltip={<Tooltip text="Each variant is a unique sellable combination (e.g. 500mg · Red). SKU and pricing are required." position="bottom" />} />
      {state.variants.map((v, idx) => {
        const label = v.optionValues.length ? v.optionValues.map((o) => o.value).join(" · ") : `Variant ${idx + 1}`;
        return (
          <div key={v.id} className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-medium text-gray-600">{label}</span>
              <button type="button" onClick={() => remove(v.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition cursor-pointer">Remove</button>
            </div>
            {renderEditableVariantFields(v)}
          </div>
        );
      })}
      <button type="button" onClick={addManual} className="w-full py-2.5 text-[13px] text-orange-500 border border-dashed border-orange-300 rounded-4xl hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer">
        + Add Variant
      </button>
    </>
  );
}