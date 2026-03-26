"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";

const BRANCHES = ["Colombo", "Kandy", "Galle"];
const UNITS = ["Each", "kg", "g", "mg", "l", "ml", "m", "inch", "Cube"];

type BranchVariantData = {
  stockQty: string;
  stockUnit: string;
  basePriceOverride: string;
  sellingPriceOverride: string;
  discount: string;
  taxRate: string;
  lowStock: string;
  available: boolean;
};

type VariantState = {
  id: number;
  sku: string;
  price: number;
};

type Props = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    branch: string;
    supplier: string | null;
    variants: Record<string, BranchVariantData>;
  }) => void;
};


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
    <div className="mb-4 flex items-center gap-1">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
      {tooltip}
    </div>
  );
}

function Tooltip({ text, position = "top" }: { text: string; position?: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <span className="relative group inline-flex items-center ml-1 cursor-default">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">
        i
      </span>
      <span
        className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isTop ? "bottom-full mb-2" : "top-full mt-2"}`}
      >
        {text}
        <span className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${isTop ? "top-full border-t-gray-800" : "bottom-full border-b-gray-800"}`} />
      </span>
    </span>
  );
}

const defaultBS = (): BranchVariantData => ({
  stockQty: "",
  stockUnit: "Each",
  basePriceOverride: "",
  sellingPriceOverride: "",
  discount: "",
  taxRate: "",
  lowStock: "",
  available: true,
});

// Sentinel values
const NO_SUPPLIER = "__none__";
const ADD_NEW_SUPPLIER = "__add_new__";

export default function AddStockPopup({ product, isOpen, onClose }: Props) {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branchSuppliers, setBranchSuppliers] = useState<Record<string, string>>({});

  // Fetched suppliers — replace [] with your API call
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  // Fetch suppliers from backend when the popup opens
  useEffect(() => {
    if (!isOpen) return;
    setSuppliersLoading(true);

    // TODO: replace with real API call e.g. fetch("/api/suppliers")
    // Simulating async fetch for now
    Promise.resolve(["Unilever Lanka", "MAS Holdings", "Ceylon Biscuits Ltd"]).then((data) => {
      setSuppliers(data);
      setSuppliersLoading(false);
    });
  }, [isOpen]);

  const variants: VariantState[] = product.variants.map((v, i) => ({
    id: i + 1,
    sku: v.sku,
    price: v.price,
  }));

  const [branchVariants, setBranchVariants] = useState<Record<string, BranchVariantData>>({});

  const getBS = (key: string): BranchVariantData => branchVariants[key] ?? defaultBS();

  const updateBS = (key: string, field: keyof BranchVariantData, value: string | boolean) => {
    setBranchVariants((prev) => ({
      ...prev,
      [key]: { ...getBS(key), [field]: value },
    }));
  };

  // Handle supplier dropdown change
  const handleSupplierChange = (branch: string, value: string) => {
    if (value === ADD_NEW_SUPPLIER) {
      // Navigate to supplier management and signal to open Add New Supplier modal
      router.push("/suppliermanagement?action=add");
      return;
    }
    setBranchSuppliers((prev) => ({ ...prev, [branch]: value }));
  };

  if (!isOpen) return null;

  return (
    <ModalShell open={isOpen} onClose={onClose} title="Add Stock" widthClassName="w-[700px] max-w-[95vw]">
      {!selectedBranch ? (
        // STEP 1: SELECT BRANCH
        <div>
          <SectionTitle
            title="Select Branch"
            tooltip={<Tooltip text="Choose the branch where you want to add stock for this product" position="bottom" />}
          />
          <div className="space-y-2">
            {BRANCHES.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 hover:bg-gray-50 hover:border-orange-200 transition-all duration-150 cursor-pointer"
              >
                <span className="text-sm font-medium">{b}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // STEP 2: VARIANT STOCK CONFIG
        <div>
          {/* Branch header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Branch:</span>
              <span className="text-sm font-medium text-gray-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {selectedBranch}
              </span>
            </div>
            <button
              onClick={() => setSelectedBranch(null)}
              className="text-[12px] text-gray-500 hover:text-orange-500 transition px-3 py-1 rounded-lg hover:bg-orange-50"
            >
              ← Change branch
            </button>
          </div>

          {/* Supplier selector */}
          <div className="mb-5 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <Label>
                Supplier
                <Tooltip text="Applies to all variants for this branch. Select 'No Supplier' for self-products." position="bottom" />
              </Label>

              <button
                onClick={() => router.push("/suppliermanagement?action=add")}
                className="text-[12px] px-3 py-1 rounded-full text-orange-500 hover:font-medium transition cursor-pointer"
              >
                + Add New Supplier
                <Tooltip text="Navigate to supplier management to add a new supplier" position="bottom" />
              </button>
            
            </div>

            {suppliersLoading ? (
              <div className="w-full text-sm px-3 py-2 border border-gray-200 rounded-4xl bg-white text-gray-400">
                Loading suppliers…
              </div>
            ) : (
              <Select
                value={branchSuppliers[selectedBranch] ?? ""}
                onChange={(e) => handleSupplierChange(selectedBranch, e.target.value)}
              >
                {/* Default prompt */}
                <option value="" disabled>Select a supplier…</option>

                {/* Self-product option */}
                <option value={NO_SUPPLIER}>No Supplier (Self Product) </option>

                {/* Fetched suppliers */}
                {suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            )}

            {/* Visual confirmation of selection */}
            {branchSuppliers[selectedBranch] === NO_SUPPLIER && (
              <p className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                This product will be recorded without a supplier.
              </p>
            )}
          </div>

          {/* Variant list */}
          <div className="overflow-y-auto max-h-[44vh] pr-1 space-y-3">
            {variants.map((v) => {
              const key = `${v.id}_${selectedBranch}`;
              const bs = getBS(key);

              return (
                <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <div>
                      <p className="text-[13px] font-medium text-gray-700">SKU: {v.sku}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Base price: {v.price.toFixed(2)}</p>
                    </div>
                    <label className="flex items-center gap-2 text-[12px] text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bs.available}
                        onChange={(e) => updateBS(key, "available", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-200 focus:ring-offset-0 cursor-pointer"
                      />
                      Available
                    </label>
                  </div>

                  <div className="mb-4">
                    <Label>Stock Information</Label>
                    <Grid2>
                      <FieldWrap>
                        <Input type="number" placeholder="Stock quantity" value={bs.stockQty} onChange={(e) => updateBS(key, "stockQty", e.target.value)} />
                      </FieldWrap>
                      <FieldWrap>
                        <Select value={bs.stockUnit} onChange={(e) => updateBS(key, "stockUnit", e.target.value)}>
                          {UNITS.map((u) => <option key={u}>{u}</option>)}
                        </Select>
                      </FieldWrap>
                    </Grid2>
                  </div>

                  <div className="mb-4">
                    <Label>Price Overrides</Label>
                    <Grid2>
                      <FieldWrap>
                        <Input type="number" placeholder="Base price override" value={bs.basePriceOverride} onChange={(e) => updateBS(key, "basePriceOverride", e.target.value)} />
                      </FieldWrap>
                      <FieldWrap>
                        <Input type="number" placeholder="Selling price override" value={bs.sellingPriceOverride} onChange={(e) => updateBS(key, "sellingPriceOverride", e.target.value)} />
                      </FieldWrap>
                    </Grid2>
                  </div>

                  <div>
                    <Label>Additional Settings</Label>
                    <Grid3>
                      <FieldWrap>
                        <Input type="number" placeholder="Discount %" value={bs.discount} onChange={(e) => updateBS(key, "discount", e.target.value)} />
                      </FieldWrap>
                      <FieldWrap>
                        <Input type="number" placeholder="Tax %" value={bs.taxRate} onChange={(e) => updateBS(key, "taxRate", e.target.value)} />
                      </FieldWrap>
                      <FieldWrap>
                        <Input type="number" placeholder="Low stock alert" value={bs.lowStock} onChange={(e) => updateBS(key, "lowStock", e.target.value)} />
                      </FieldWrap>
                    </Grid3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={() => setSelectedBranch(null)}
              className="px-6 py-2 text-sm border border-gray-200 rounded-4xl text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                console.log("SAVE STOCK:", {
                  branch: selectedBranch,
                  supplier: branchSuppliers[selectedBranch] ?? null,
                  variants: branchVariants,
                });
                onClose();
              }}
              className="px-6 py-2 text-sm bg-orange-500 text-white rounded-4xl hover:bg-orange-600 transition font-medium cursor-pointer"
            >
              Add Stock
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}