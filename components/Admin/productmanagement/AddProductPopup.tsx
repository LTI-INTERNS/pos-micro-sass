"use client";

import * as React from "react";
import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { BusinessTypeId, getCategoriesByBusinessType,} from "@/components/Admin/productmanagement/Productcategorydata"; 

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

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ProductState) => void;
  initialData?: ProductState | null; // ✅ ADD THIS
  userRole?: "owner" | "admin" | "manager";
  businessTypeId?: BusinessTypeId;
  branchId?: number;
  branchName?: string;
  branchManager?: string;
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

// ─── Small reusable pieces ────────────────────────────────────────────────────

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

function SectionTitle({
  title,
  tooltip,
}: {
  title: string;
  tooltip?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-1">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
      {tooltip}
    </div>
  );
}

// ─── Add this reusable component near your other small pieces ────────────────
function Tooltip({ text, position = "top" }: { text: string; position?: "top" | "bottom" }) {
  const isTop = position === "top";

  return (
    <span className="relative group inline-flex items-center ml-1 cursor-default">
      {/* icon */}
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">
        i
      </span>

      {/* tooltip */}
      <span
        className={`
          pointer-events-none absolute z-50 left-1/2 -translate-x-1/2
          w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          ${isTop ? "bottom-full mb-2" : "top-full mt-2"}
        `}
      >
        {text}

        {/* arrow */}
        <span
          className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${isTop ? "top-full border-t-gray-800" : "bottom-full border-b-gray-800"}
          `}
        />
      </span>
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
            <span className={`inline-block mr-1 text-[10px] ${done ? "text-orange-400" : ""}`}>
              {done ? "✓" : i + 1}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Product info ────────────────────────────────────────────────────

function Step1({ state, onChange, categories }: { state: ProductState; onChange: (patch: Partial<ProductState>) => void; categories: { categoryId: string; categoryName: string }[]; }) {

  return (
    <>
      <SectionTitle title="Product information" />
      <FieldWrap>
        <Label required>Product name</Label>
        <Input placeholder="Enter Product Name" value={state.name} onChange={e => onChange({ name: e.target.value })} />
      </FieldWrap>
      <Grid2>
        <FieldWrap>
          <Label required>Category</Label>
          <Select
            value={state.categoryId}
            onChange={e => onChange({ categoryId: e.target.value })}
          >
            <option value="">Select…</option>
            {/* ← now uses filtered dynamic categories */}
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </Select>
        </FieldWrap>
        <FieldWrap>
          <Label required>Brand</Label>
          <Input placeholder="Enter Brand Name" value={state.brand} onChange={e => onChange({ brand: e.target.value })} />
        </FieldWrap>
      </Grid2>
      <FieldWrap>
        <Label>Description</Label>
        <Textarea placeholder="What is this product? Include key details…" value={state.description} onChange={e => onChange({ description: e.target.value })} />
      </FieldWrap>
    </>
  );
}

// ─── Step 2 — Options ─────────────────────────────────────────────────────────

function Step2({ state, onChange }: { state: ProductState; onChange: (patch: Partial<ProductState>) => void }) {
  const addOption = () => {
    onChange({ options: [...state.options, { id: Date.now(), name: "", values: [] }] });
  };

  const removeOption = (id: number) => {
    onChange({ options: state.options.filter(o => o.id !== id) });
  };

  const updateName = (id: number, name: string) => {
    onChange({ options: state.options.map(o => o.id === id ? { ...o, name } : o) });
  };

  const addValue = (id: number, val: string) => {
    onChange({
      options: state.options.map(o =>
        o.id === id && !o.values.includes(val) ? { ...o, values: [...o.values, val] } : o
      ),
    });
  };

  const removeValue = (id: number, val: string) => {
    onChange({ options: state.options.map(o => o.id === id ? { ...o, values: o.values.filter(v => v !== val) } : o) });
  };

  return (
    <>
      <SectionTitle
        title="Product options"
        tooltip={
          <Tooltip
            text="Options are dimensions like Size or Colour. Each option gets values (e.g. Small, Medium, Large)."
            position="bottom"
          />
        }
      />
      {state.options.map((opt, idx) => (
        <div key={opt.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-medium text-gray-700">Option {idx + 1}</span>
            <button type="button" onClick={() => removeOption(opt.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition">Remove</button>
          </div>
          <FieldWrap>
            <Label required>Option type</Label>
            <Select value={opt.name} onChange={e => updateName(opt.id, e.target.value)}>
              <option value="">Select type…</option>
              {OPTION_NAMES.map(n => <option key={n}>{n}</option>)}
            </Select>
          </FieldWrap>
          <FieldWrap>
            <Label>Values (press Enter to add)</Label>
            <Input
              placeholder="e.g. 500mg"
              onKeyDown={e => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val) { addValue(opt.id, val); (e.target as HTMLInputElement).value = ""; }
              }}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {opt.values.map(v => (
                <span key={v} className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 ">
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

function Step3({ state, onChange, businessTypeId, }: { state: ProductState; onChange: (patch: Partial<ProductState>) => void; businessTypeId?: BusinessTypeId; }) {
  const isCafe = businessTypeId === "bt-001";

  const addManual = () => {
    onChange({ variants: [...state.variants, { id: Date.now(), sku: "", barcode: "", imageUrl: "", basePrice: "", sellingPrice: "", sellUnit: "EA", optionValues: [] }] });
  };

  const remove = (id: number) => onChange({ variants: state.variants.filter(v => v.id !== id) });

  const update = (id: number, key: keyof ProductVariant, val: string) => {
    onChange({ variants: state.variants.map(v => v.id === id ? { ...v, [key]: val } : v) });
  };

  // Image upload per variant
  const [variantImages, setVariantImages] = React.useState<Record<number, string>>({});

  const handleVariantImage = (id: number, file: File | null) => {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return;
    if (file.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) return;
    const url = URL.createObjectURL(file);
    setVariantImages(prev => ({ ...prev, [id]: url }));
    update(id, "imageUrl", url);
  };

  return (
    <>
      <SectionTitle 
        title="Product variants" 
        tooltip={
          <Tooltip
            text="Each variant is a unique sellable combination (e.g. 500mg · Red). SKU and pricing are required."
            position="bottom"
          />
        }
      />
      {state.variants.map((v, idx) => {
        const label = v.optionValues.length ? v.optionValues.map(o => o.value).join(" · ") : `Variant ${idx + 1}`;
        return (
          <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-medium text-gray-600">{label}</span>
              <button type="button" onClick={() => remove(v.id)} className="text-[11px] text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition cursor-pointer">Remove</button>
            </div>
            <Grid2>
              <FieldWrap>
                <Label required>SKU</Label>
                <Input placeholder="SKU-001" value={v.sku} onChange={e => update(v.id, "sku", e.target.value)} />
              </FieldWrap>
              <FieldWrap>
                <Label>Barcode</Label>
                <Input placeholder="1234567890" value={v.barcode} onChange={e => update(v.id, "barcode", e.target.value)} />
              </FieldWrap>
            </Grid2>
            <Grid3>
              <FieldWrap>
                <Label required>Base price</Label>
                <Input type="number" placeholder="0.00" value={v.basePrice} onChange={e => update(v.id, "basePrice", e.target.value)} />
              </FieldWrap>
              <FieldWrap>
                <Label required>Selling price</Label>
                <Input type="number" placeholder="0.00" value={v.sellingPrice} onChange={e => update(v.id, "sellingPrice", e.target.value)} />
              </FieldWrap>
              <FieldWrap>
                <Label>Sell unit</Label>
                <Select value={v.sellUnit} onChange={e => update(v.id, "sellUnit", e.target.value)}>
                  {SELL_UNITS.map(u => <option key={u}>{u}</option>)}
                </Select>
              </FieldWrap>
            </Grid3>
            {isCafe && (
              <FieldWrap>
                <Label required>Variant image</Label>

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={e => handleVariantImage(v.id, e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-orange-600 hover:file:bg-orange-100 hover:file:cursor-pointer"
                />

                {variantImages[v.id] && (
                  <div className="relative mt-2 h-20 w-20">
                    <Image
                      src={variantImages[v.id]}
                      alt="Preview"
                      fill
                      className="rounded-lg object-cover border"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVariantImages(p => {
                          const n = { ...p };
                          delete n[v.id];
                          return n;
                        });
                        update(v.id, "imageUrl", "");
                      }}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-black"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </FieldWrap>
            )}
          </div>
        );
      })}
      <button type="button" onClick={addManual} className="w-full py-2.5 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-4xl hover:bg-gray-50 hover:text-gray-700 transition cursor-pointer">+ Add Varient</button>
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
}: AddProductPopupProps) {
  const { addNotification } = useNotifications();
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState<ProductState>(emptyState());
  const categories = getCategoriesByBusinessType(businessTypeId);

  // Reset when modal opens
  React.useEffect(() => {
  if (!open) return;

  setStep(0);

  if (initialData) {
    setState(initialData); // ✅ EDIT MODE
  } else {
    setState(emptyState()); // ✅ ADD MODE
  }
}, [open, initialData]);

  const patch = (p: Partial<ProductState>) => setState(prev => ({ ...prev, ...p }));

  // Step-level validation
  const validateStep = (): string | null => {
    if (step === 0) {
      if (!state.name.trim()) return "Product name is required.";
      if (!state.categoryId) return "Category is required.";
    }
    if (step === 2) {
      for (const v of state.variants) {
        if (!v.sku.trim()) return "All variants must have a SKU.";
        if (!v.basePrice) return "All variants must have a base price.";
        if (!v.sellingPrice) return "All variants must have a selling price.";
      }
    }
    return null;
  };

  const goStep = (n: number) => setStep(n);

  const handleNext = () => {
    const err = validateStep();
    if (err) { alert(err); return; }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  const handleSave = () => {
    console.log("Saving product payload:", state);

    if (userRole === "manager") {
      addNotification({
        type: "approval_pending",
        message: `New product request from ${branchName} — "${state.name.trim()}" awaiting approval`,
        productApproval: {
          id: Date.now(),
          productName: state.name.trim(),
          price: Number(state.variants[0]?.sellingPrice ?? 0),
          discount: 0,
          tax: 0,
          stock: 0,
          unit: state.variants[0]?.sellUnit ?? "each",
          imageUrl: state.variants[0]?.imageUrl ?? "",
          branchId,
          branchName,
          branchManager,
          submittedBy: branchManager,
          submittedAt: new Date().toISOString(),
          status: "pending",
        },
      });
    }

    onSave(state);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title={initialData ? "Edit Product" : "Add New Product"}
      onClose={onClose}
      widthClassName="w-[860px] max-w-[95vw]"
    >
      <form onSubmit={e => { e.preventDefault(); step === STEPS.length - 1 ? handleSave() : handleNext(); }}>
        <StepBar current={step} onGo={goStep} />

        {/* Scrollable step content — fixed height so modal never resizes */}
        <div className="overflow-y-auto h-[52vh] pr-1">
          {step === 0 && <Step1 state={state} onChange={patch} categories={categories} />}
          {step === 1 && <Step2 state={state} onChange={patch} />}
          {step === 2 && <Step3 state={state} onChange={patch} businessTypeId={businessTypeId} />}
        </div>

        {/* Nav row — always same height */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-2 text-sm border border-gray-200 rounded-4xl text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer ${step === 0 ? "invisible" : ""}`}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={step === STEPS.length - 1 ? handleSave : handleNext}
              className="px-6 py-2 text-sm bg-orange-500 text-white rounded-4xl hover:bg-orange-600 transition font-medium cursor-pointer"
            >
              {step === STEPS.length - 1
                ? initialData
                  ? "Update Product"
                  : userRole === "manager"
                    ? "Submit for Approval"
                    : "Add Product"
                : "Continue"}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}