"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";
import { apiClient } from "@/lib/api-client";
import { branchService } from "@/lib/services/branch-service";
import type { Branch } from "@/lib/services/branch-service";
import { supplierService } from "@/lib/services/supplier-service";
import type { Supplier } from "@/lib/services/supplier-service";

const UNITS = ["Each", "kg", "g", "mg", "l", "ml", "m", "inch", "Cube"];

type BranchVariantData = {
  stockQty: string;
  stockUnit: string;
  basePriceOverride: string;
  sellingPriceOverride: string;
  discount: string;
  taxRate: string;
  lowStock: string;
};

type VariantState = {
  id: number;
  variantId: string;
  sku: string;
  variantLabel: string;
  price: number;
};

type RawVariant = {
  variantId?: string;
  sku: string;
  price: number;
  stockQty?: number | string | null;
  sellUnit?: string;
  stockUnit?: string;
  priceOverride?: number | string | null;
  sellingPriceOverride?: number | string | null;
  discount?: number | string | null;
  taxRate?: number | string | null;
  lowStock?: number | string | null;
  optionValues?: Array<{ optionName?: string; value?: string } | string>;
  imageUrl?: string;
  branchVariants?: Array<{ branchId: string }>;
};

function getVariantLabel(raw: RawVariant): string {
  const values = (raw.optionValues ?? [])
    .map((entry) => {
      if (typeof entry === "string") return entry;
      return entry?.value ?? "";
    })
    .map((value) => value.trim())
    .filter(Boolean);

  return values.length > 0 ? values.join(" · ") : raw.sku;
}

type ExistingBranchVariantRow = {
  variantId: string;
  stockQty?: number | string | null;
  stockUnit?: string;
  priceOverride?: number | string | null;
  sellingPriceOverride?: number | string | null;
  discount?: number | string | null;
  taxRate?: number | string | null;
  lowStock?: number | string | null;
  supplierId?: string | null;
};

type Props = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  userRole?: "owner" | "admin" | "manager";
  branchName?: string;
  branchId?: string;
  onSave?: (data: { branch: string; supplierId: string | null; variants: Record<string, BranchVariantData> }) => Promise<void> | void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
};

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
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold">i</span>
      <span className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-52 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 text-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isTop ? "bottom-full mb-2" : "top-full mt-2"}`}>
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
});

export default function AddStockPopup({
  product,
  isOpen,
  onClose,
  userRole = "admin",
  branchName: managerBranchName = "",
  branchId: managerBranchId = "",
  onSave,
  showToast,
}: Props) {
  const isManager = userRole === "manager";

  // THE FIX: Declare the missing refs here!
  const hasInitializedRef = useRef(false);
  const lastPrefilledBranchIdRef = useRef<string | null>(null);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [prefilling, setPrefilling] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [branchVariants, setBranchVariants] = useState<Record<string, BranchVariantData>>({});
  const [currentStock, setCurrentStock] = useState<Record<string, number>>({});

  const mapStockUnitDisplay = (unit: string): string => {
    const map: Record<string, string> = {
      EA: "Each", KG: "kg", G: "g", MG: "mg",
      L: "l", ML: "ml", M: "m", INCH: "inch", CUBE: "Cube",
    };
    return map[unit?.toUpperCase()] ?? unit ?? "Each";
  };

  useEffect(() => {
    if (!isOpen) {
      hasInitializedRef.current = false;
      lastPrefilledBranchIdRef.current = null;
      return;
    }
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    setSelectedBranch(null);
    setBranchesError(null);
    setBranchVariants({});
    setCurrentStock({});
    setSelectedSupplierId("");
    setSuppliers([]);

    if (isManager) {
      const stockMap: Record<string, number> = {};
      const prefilled: Record<string, BranchVariantData> = {};

      product.variants.forEach((v, i) => {
        const raw = v as unknown as RawVariant;
        const variantId = raw.variantId ?? v.sku;
        const id = i + 1;
        const key = `${id}_manager`;

        stockMap[variantId] = Number(raw.stockQty ?? 0);
        prefilled[key] = {
          stockQty: "", 
          stockUnit: mapStockUnitDisplay(raw.sellUnit ?? raw.stockUnit ?? "EA"),
          basePriceOverride: raw.priceOverride != null ? String(raw.priceOverride) : "",
          sellingPriceOverride: raw.sellingPriceOverride != null ? String(raw.sellingPriceOverride) : "",
          discount: raw.discount != null ? String(raw.discount) : "",
          taxRate: raw.taxRate != null ? String(raw.taxRate) : "",
          lowStock: raw.lowStock != null ? String(raw.lowStock) : "",
        };
      });
      setCurrentStock(stockMap);
      setBranchVariants(prefilled);

      setSuppliersLoading(true);
      const fetchFn = managerBranchId
        ? supplierService.getByBranchId(managerBranchId)
        : supplierService.getAll();
      fetchFn
        .then(setSuppliers)
        .catch(() => setSuppliers([]))
        .finally(() => setSuppliersLoading(false));
    } else {
      setBranchesLoading(true);
      branchService.getAll()
        .then((data) => { setBranches(data); })
        .catch(() => { setBranchesError("Failed to load branches."); })
        .finally(() => setBranchesLoading(false));
    }
  }, [isOpen, isManager, product.variants, managerBranchId]);

  const variants: VariantState[] = useMemo(
    () =>
      product.variants.map((v, i) => {
        const raw = v as unknown as RawVariant;
        return {
          id: i + 1,
          variantId: raw.variantId ?? v.sku,
          sku: v.sku,
          variantLabel: getVariantLabel(raw),
          price: v.price,
        };
      }),
    [product.variants]
  );

  useEffect(() => {
    if (!selectedBranch) {
      lastPrefilledBranchIdRef.current = null;
      return;
    }
    if (selectedBranch.id === lastPrefilledBranchIdRef.current) return;
    lastPrefilledBranchIdRef.current = selectedBranch.id;

    const variantIds = variants.map(v => v.variantId).filter(Boolean).join(',');
    if (!variantIds) return;

    setSelectedSupplierId("");

    setSuppliersLoading(true);
    supplierService
      .getByBranchId(selectedBranch.id)
      .then(setSuppliers)
      .catch(() => setSuppliers([]))
      .finally(() => setSuppliersLoading(false));

    setPrefilling(true);
    apiClient
      .get<{ success: boolean; data: ExistingBranchVariantRow[] }>(
        `/branch-variants/existing?branchId=${selectedBranch.id}&variantIds=${encodeURIComponent(variantIds)}`
      )
      .then((res) => {
        const existingRows: ExistingBranchVariantRow[] = res.data?.data ?? [];

        const stockMap: Record<string, number> = {};
        for (const row of existingRows) {
          stockMap[row.variantId] = Number(row.stockQty ?? 0);
        }
        setCurrentStock(stockMap);

        const existingSupplierId = existingRows.find(r => r.supplierId)?.supplierId ?? null;
        if (existingSupplierId) {
          setSelectedSupplierId(existingSupplierId);
        }

        setBranchVariants((prev) => {
          const next = { ...prev };
          for (const row of existingRows) {
            const match = variants.find(v => v.variantId === row.variantId);
            if (!match) continue;
            const key = `${match.id}_${selectedBranch.id}`;
            next[key] = {
              stockQty: "", 
              stockUnit: mapStockUnitDisplay(row.stockUnit ?? ""),
              basePriceOverride: row.priceOverride != null ? String(row.priceOverride) : "",
              sellingPriceOverride: row.sellingPriceOverride != null ? String(row.sellingPriceOverride) : "",
              discount: row.discount != null ? String(row.discount) : "",
              taxRate: row.taxRate != null ? String(row.taxRate) : "",
              lowStock: row.lowStock != null ? String(row.lowStock) : "",
            };
          }
          return next;
        });
      })
      .catch((err: unknown) => {
        console.error('[AddStock] Failed to pre-fill existing values:', err);
        showToast("Could not load existing branch stock values.", "error");
      })
      .finally(() => setPrefilling(false));
  }, [selectedBranch, variants, showToast]);

  const getBS = (key: string): BranchVariantData => branchVariants[key] ?? defaultBS();
  const updateBS = (key: string, field: keyof BranchVariantData, value: string) => {
    setBranchVariants((prev) => ({
      ...prev,
      [key]: { ...getBS(key), [field]: value },
    }));
  };

  if (!isOpen) return null;

  const showBranchSelection = !isManager && !selectedBranch;

  const hasAnyQty = variants.some((v) => {
    const key = `${v.id}_${selectedBranch?.id ?? "manager"}`;
    const qty = parseFloat(branchVariants[key]?.stockQty ?? "");
    return qty > 0;
  });

  const handleSave = async () => {
    setSaving(true);

    try {
      const variantPayload = variants
        .map((v) => {
          const key = `${v.id}_${selectedBranch?.id ?? "manager"}`;
          const bs = getBS(key);
          return {
            variantId: v.variantId,
            stockQty: parseFloat(bs.stockQty) || 0,
            stockUnit: bs.stockUnit,
            lowStock: parseFloat(bs.lowStock) || 0,
            priceOverride: bs.basePriceOverride ? parseFloat(bs.basePriceOverride) : null,
            sellingPriceOverride: bs.sellingPriceOverride ? parseFloat(bs.sellingPriceOverride) : null,
            discount: bs.discount ? parseFloat(bs.discount) : null,
            taxRate: bs.taxRate ? parseFloat(bs.taxRate) : null,
          };
        })
        .filter((v) => branchVariants[`${variants.find(vv => vv.variantId === v.variantId)?.id}_${selectedBranch?.id ?? "manager"}`]);

      const supplierId = selectedSupplierId || null;

      await apiClient.post('/branch-variants/stock', {
        branchId: selectedBranch?.id ?? undefined,
        supplierId,
        variants: variantPayload,
      });

      await onSave?.({
        branch: selectedBranch?.name ?? managerBranchName,
        supplierId,
        variants: branchVariants,
      });

      showToast("Stock added successfully!", "success");
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save stock:", err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || "Failed to save stock.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} title="Add Stock" widthClassName="w-[700px] max-w-[95vw]">
      <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden pr-1">
      {showBranchSelection ? (
        <div>
          <SectionTitle
            title="Select Branch"
            tooltip={<Tooltip text="Choose the branch where you want to add stock" position="bottom" />}
          />
          {branchesLoading && (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              <svg className="animate-spin w-4 h-4 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading branches…
            </div>
          )}
          {branchesError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-600">
              {branchesError}
            </div>
          )}
          {!branchesLoading && !branchesError && (() => {
            if (branches.length === 0) {
              return <p className="text-center text-sm text-gray-400 py-8">No branches found.</p>;
            }

            const assignedBranchIds = new Set<string>(
              (product.variants as unknown as RawVariant[]).flatMap(
                (v) => (v.branchVariants ?? []).map((bv) => bv.branchId)
              )
            );

            const assignedBranches = branches.filter(b => assignedBranchIds.has(b.id));
            const unassignedBranches = branches.filter(b => !assignedBranchIds.has(b.id));

            return (
              <div className="overflow-y-auto max-h-[52vh] pr-1 space-y-5">
                {/* ── Already stocked branches ── */}
                {assignedBranches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wide">
                        Already Stocked
                      </span>
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        {assignedBranches.length}
                      </span>
                      <div className="flex-1 h-px bg-orange-100" />
                    </div>
                    <div className="space-y-2">
                      {assignedBranches.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBranch(b)}
                          className="w-full text-left px-4 py-3 border border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all duration-150 cursor-pointer flex items-center justify-between"
                        >
                          <span>
                            <span className="text-sm font-medium text-gray-800">{b.name}</span>
                            {b.city && <span className="ml-2 text-[11px] text-gray-400">{b.city}</span>}
                          </span>
                          <span className="text-[10px] text-orange-600 font-medium bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Not yet assigned branches ── */}
                {unassignedBranches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Not Yet Assigned
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                        {unassignedBranches.length}
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      {unassignedBranches.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBranch(b)}
                          className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-orange-50 hover:border-orange-200 transition-all duration-150 cursor-pointer flex items-center justify-between"
                        >
                          <span>
                            <span className="text-sm font-medium text-gray-800">{b.name}</span>
                            {b.city && <span className="ml-2 text-[11px] text-gray-400">{b.city}</span>}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : (
        <div>
          {/* Branch header */}
          {!isManager && (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Branch:</span>
                <span className="text-sm font-medium text-gray-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  {selectedBranch?.name}
                  {selectedBranch?.city && <span className="ml-1.5 text-[11px] text-gray-400">{selectedBranch.city}</span>}
                </span>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-[12px] text-gray-500 hover:text-orange-500 transition px-3 py-1 rounded-lg hover:bg-orange-50"
              >
                ← Change branch
              </button>
            </div>
          )}

          {/* Auto-availability info banner */}
          <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-[12px] text-blue-700">
              <strong>Stock is incremental:</strong> the quantity you enter will be{" "}
              <span className="font-medium">added to the existing stock</span>. Other fields
              (price overrides, discount, tax, low stock) are pre-filled from the current branch values — edit only what needs changing.
            </p>
          </div>

          {prefilling && (
            <div className="mb-4 px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2">
              <svg className="animate-spin w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-[12px] text-orange-600">Loading existing branch values…</p>
            </div>
          )}

          {/* Supplier selection */}
          <div className="mb-5">
            <label className="block text-[12px] text-gray-500 mb-1 flex items-center gap-1">
              Supplier{" "}
              <span className="text-[11px] text-gray-400 font-normal">(optional)</span>
              <Tooltip
                position="bottom"
                text="Selecting a supplier here applies it to all variants of this product in the selected branch. All variants will share the same supplier."
              />
            </label>
            {suppliersLoading ? (
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-4xl bg-white text-[12px] text-gray-400">
                <svg className="animate-spin w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading suppliers…
              </div>
            ) : suppliers.length === 0 ? (
              <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-200 rounded-4xl bg-gray-50 text-[12px] text-gray-400">
                <span>🔗</span>
                <span>No suppliers assigned to this branch yet.</span>
                <Tooltip
                  position="bottom"
                  text="To assign a supplier here, go to Supplier Management → select a supplier → edit and add this branch to their assigned branches."
                />
              </div>
            ) : (
              <Select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
              >
                <option value="">— No supplier —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.type === "Company" ? (s.companyName || s.name) : s.name}
                    {s.phone ? ` · ${s.phone}` : ""}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {/* Variant list */}
          <div className="space-y-3">
            {variants.map((v) => {
              const branchKey = selectedBranch?.id ?? "manager";
              const key = `${v.id}_${branchKey}`;
              const bs = getBS(key);
              const qty = parseFloat(bs.stockQty) || 0;

              return (
                <div key={v.id} className="bg-orange-50 border border-orange-300 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-orange-300">
                    <div>
                      <p className="text-[13px] font-medium text-gray-700">SKU: {v.sku}</p>
                      {v.variantLabel !== v.sku && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{v.variantLabel}</p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-0.5">Base price: {v.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {(selectedBranch || isManager) && (
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-full border ${(currentStock[v.variantId] ?? 0) === 0
                          ? "bg-red-50 border-red-200 text-red-500"
                          : (currentStock[v.variantId] ?? 0) <= 10
                            ? "bg-orange-50 border-orange-200 text-orange-600"
                            : "bg-blue-50 border-blue-200 text-blue-600"
                          }`}>
                          Current: {currentStock[v.variantId] ?? 0} {bs.stockUnit}
                        </span>
                      )}
                      {qty > 0 && (
                        <span className="text-[11px] font-medium px-2 py-1 rounded-full border bg-green-50 border-green-200 text-green-600">
                          → {(currentStock[v.variantId] ?? 0) + qty} after add
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label>Stock Information</Label>
                    <Grid2>
                      <FieldWrap>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Qty to add (increments existing)"
                          value={bs.stockQty}
                          onChange={(e) => updateBS(key, "stockQty", e.target.value)}
                        />
                      </FieldWrap>
                      <FieldWrap>
                        <Select
                          value={bs.stockUnit}
                          onChange={(e) => updateBS(key, "stockUnit", e.target.value)}
                        >
                          {UNITS.map((u) => <option key={u}>{u}</option>)}
                        </Select>
                      </FieldWrap>
                    </Grid2>
                  </div>

                  <div className="mb-4">
                    <Label>Price Overrides</Label>
                    <Grid2>
                      <FieldWrap>
                        <Input
                          type="number"
                          placeholder="Base price override"
                          value={bs.basePriceOverride}
                          onChange={(e) => updateBS(key, "basePriceOverride", e.target.value)}
                        />
                      </FieldWrap>
                      <FieldWrap>
                        <Input
                          type="number"
                          placeholder="Selling price override"
                          value={bs.sellingPriceOverride}
                          onChange={(e) => updateBS(key, "sellingPriceOverride", e.target.value)}
                        />
                      </FieldWrap>
                    </Grid2>
                  </div>

                  <div>
                    <Label>Additional Settings</Label>
                    <Grid3>
                      <FieldWrap>
                        <Input
                          type="number"
                          placeholder="Discount %"
                          value={bs.discount}
                          onChange={(e) => updateBS(key, "discount", e.target.value)}
                        />
                      </FieldWrap>
                      <FieldWrap>
                        <Input
                          type="number"
                          placeholder="Tax %"
                          value={bs.taxRate}
                          onChange={(e) => updateBS(key, "taxRate", e.target.value)}
                        />
                      </FieldWrap>
                      <FieldWrap>
                        <Input
                          type="number"
                          placeholder="Low stock alert"
                          value={bs.lowStock}
                          onChange={(e) => updateBS(key, "lowStock", e.target.value)}
                        />
                      </FieldWrap>
                    </Grid3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center justify-end gap-3">
              {!isManager && (
                <button
                  onClick={() => setSelectedBranch(null)}
                  disabled={saving}
                  className="px-6 py-2 text-sm border border-gray-200 rounded-4xl text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasAnyQty}
                title={!hasAnyQty ? "Enter a stock quantity for at least one variant" : undefined}
                className="px-6 py-2 text-sm bg-orange-500 text-white rounded-4xl hover:bg-orange-600 transition font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Add Stock"}
              </button>
            </div>
            {!hasAnyQty && !saving && (
              <p className="text-[11px] text-gray-400 text-right">
                Enter a stock quantity for at least one variant to save.
              </p>
            )}
          </div>
        </div>
      )}
      </div>
    </ModalShell>
  );
}