"use client";

import { useState, useEffect, useMemo } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";
import { apiClient } from "@/lib/api-client";
import { branchService } from "@/lib/services/branch-service";
import type { Branch } from "@/lib/services/branch-service";

const UNITS = ["Each", "kg", "g", "mg", "l", "ml", "m", "inch", "Cube"];

type BranchVariantData = {
  stockQty:             string;
  stockUnit:            string;
  basePriceOverride:    string;
  sellingPriceOverride: string;
  discount:             string;
  taxRate:              string;
  lowStock:             string;
};

type VariantState = {
  id:        number;
  variantId: string;   // real UUID from DB
  sku:       string;
  variantLabel: string;
  price:     number;
};

// Shape of raw variant data coming from the backend (product.variants may carry
// extra fields not declared in the Product type).
type RawVariant = {
  variantId?:           string;
  sku:                  string;
  price:                number;
  stockQty?:            number | string | null;
  sellUnit?:            string;
  stockUnit?:           string;
  priceOverride?:       number | string | null;
  sellingPriceOverride?: number | string | null;
  discount?:            number | string | null;
  taxRate?:             number | string | null;
  lowStock?:            number | string | null;
  optionValues?:        Array<{ optionName?: string; value?: string } | string>;
  imageUrl?:            string;
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

// Shape of rows returned by /branch-variants/existing
type ExistingBranchVariantRow = {
  variantId:            string;
  stockQty?:            number | string | null;
  stockUnit?:           string;
  priceOverride?:       number | string | null;
  sellingPriceOverride?: number | string | null;
  discount?:            number | string | null;
  taxRate?:             number | string | null;
  lowStock?:            number | string | null;
};

type Props = {
  product:    Product;
  isOpen:     boolean;
  onClose:    () => void;
  userRole?:  "owner" | "admin" | "manager";
  branchName?: string;
  onSave?:    (data: { branch: string; supplierId: string | null; variants: Record<string, BranchVariantData> }) => void;
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
  stockQty:             "",
  stockUnit:            "Each",
  basePriceOverride:    "",
  sellingPriceOverride: "",
  discount:             "",
  taxRate:              "",
  lowStock:             "",
});


// ─── Main component ───────────────────────────────────────────────────────────

export default function AddStockPopup({
  product,
  isOpen,
  onClose,
  userRole = "admin",
  branchName: managerBranchName = "",
  onSave,
}: Props) {
  const isManager = userRole === "manager";

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(
    null  // always start null; manager branch resolved via session on the backend
  );

  const [branches, setBranches]               = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError]     = useState<string | null>(null);
  const [prefilling, setPrefilling]           = useState(false);

  const [saving, setSaving]                   = useState(false);
  const [saveError, setSaveError]             = useState<string | null>(null);
  const [branchVariants, setBranchVariants]   = useState<Record<string, BranchVariantData>>({});
  // currentStock: variantId → existing stockQty in the selected branch
  const [currentStock, setCurrentStock]       = useState<Record<string, number>>({});

  // Map DB StockUnit enum values back to display strings
  // Defined here (before useEffects) so both effects can call it.
  const mapStockUnitDisplay = (unit: string): string => {
    const map: Record<string, string> = {
      EA: "Each", KG: "kg", G: "g", MG: "mg",
      L: "l", ML: "ml", M: "m", INCH: "inch", CUBE: "Cube",
    };
    return map[unit?.toUpperCase()] ?? unit ?? "Each";
  };

  useEffect(() => {
    if (!isOpen) return;
    setSelectedBranch(null);
    setSaveError(null);
    setBranchesError(null);
    setBranchVariants({});
    setCurrentStock({});

    if (isManager) {
      // Manager: product variants already carry branch stock fields from
      // extractBranchStock (product-service.ts). Pre-fill from them directly.
      const stockMap: Record<string, number> = {};
      const prefilled: Record<string, BranchVariantData> = {};

      product.variants.forEach((v, i) => {
        const raw = v as unknown as RawVariant;
        const variantId = raw.variantId ?? v.sku;
        const id = i + 1;
        const key = `${id}_manager`;

        stockMap[variantId] = Number(raw.stockQty ?? 0);
        prefilled[key] = {
          stockQty:             "",             // blank — user types amount to ADD
          stockUnit:            mapStockUnitDisplay(raw.sellUnit ?? raw.stockUnit ?? "EA"),
          basePriceOverride:    raw.priceOverride        != null ? String(raw.priceOverride)        : "",
          sellingPriceOverride: raw.sellingPriceOverride != null ? String(raw.sellingPriceOverride) : "",
          discount:             raw.discount   != null ? String(raw.discount)   : "",
          taxRate:              raw.taxRate     != null ? String(raw.taxRate)    : "",
          lowStock:             raw.lowStock    != null ? String(raw.lowStock)   : "",
        };
      });
      setCurrentStock(stockMap);
      setBranchVariants(prefilled);
    } else {
      // Admin/Owner: fetch real branches to pick from
      setBranchesLoading(true);
      branchService.getAll()
        .then((data) => { setBranches(data); })
        .catch(() => { setBranchesError("Failed to load branches."); })
        .finally(() => setBranchesLoading(false));
    }
  }, [isOpen, isManager, product.variants]);

  // Stable variant list derived from product — useMemo prevents stale
  // closure in the pre-fill useEffect below.
  const variants: VariantState[] = useMemo(
    () =>
      product.variants.map((v, i) => {
        const raw = v as unknown as RawVariant;
        return {
          id:        i + 1,
          variantId: raw.variantId ?? v.sku,
          sku:       v.sku,
          variantLabel: getVariantLabel(raw),
          price:     v.price,
        };
      }),
    [product.variants]
  );


  // When a branch is selected, pre-fill existing BranchVariant values.
  // stockQty is intentionally left blank — the user types the AMOUNT TO ADD
  // (backend increments it onto the existing total).
  useEffect(() => {
    if (!selectedBranch) return;
    const variantIds = variants.map(v => v.variantId).filter(Boolean).join(',');
    if (!variantIds) return;

    setPrefilling(true);
    apiClient
      .get<{ success: boolean; data: ExistingBranchVariantRow[] }>(
        `/branch-variants/existing?branchId=${selectedBranch.id}&variantIds=${encodeURIComponent(variantIds)}`
      )
      .then((res) => {
        const existingRows: ExistingBranchVariantRow[] = res.data?.data ?? [];
        console.log('[AddStock] pre-fill rows:', existingRows);

        // Build currentStock map: variantId → stockQty
        const stockMap: Record<string, number> = {};
        for (const row of existingRows) {
          stockMap[row.variantId] = Number(row.stockQty ?? 0);
        }
        setCurrentStock(stockMap);

        setBranchVariants((prev) => {
          const next = { ...prev };
          for (const row of existingRows) {
            const match = variants.find(v => v.variantId === row.variantId);
            if (!match) continue;
            const key = `${match.id}_${selectedBranch.id}`;
            next[key] = {
              stockQty:             "",  // intentionally blank — user types amount to ADD
              stockUnit:            mapStockUnitDisplay(row.stockUnit ?? ""),
              basePriceOverride:    row.priceOverride        != null ? String(row.priceOverride)        : "",
              sellingPriceOverride: row.sellingPriceOverride != null ? String(row.sellingPriceOverride) : "",
              discount:             row.discount    != null ? String(row.discount)    : "",
              taxRate:              row.taxRate      != null ? String(row.taxRate)     : "",
              lowStock:             row.lowStock     != null ? String(row.lowStock)    : "",
            };
          }
          return next;
        });
      })
      .catch((err: unknown) => {
        console.error('[AddStock] Failed to pre-fill existing values:', err);
        setSaveError('Could not load existing branch stock values.');
      })
      .finally(() => setPrefilling(false));
  }, [selectedBranch, variants]);

  const getBS  = (key: string): BranchVariantData => branchVariants[key] ?? defaultBS();
  const updateBS = (key: string, field: keyof BranchVariantData, value: string) => {
    setBranchVariants((prev) => ({
      ...prev,
      [key]: { ...getBS(key), [field]: value },
    }));
  };

  if (!isOpen) return null;

  // For managers, the branch is determined server-side from their session
  const showBranchSelection = !isManager && !selectedBranch;

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);

    try {
      // Build payload
      const variantPayload = variants
        .map((v) => {
          const key = `${v.id}_${selectedBranch?.id ?? "manager"}`;
          const bs  = getBS(key);
          return {
            variantId:             v.variantId,
            stockQty:              parseFloat(bs.stockQty)             || 0,
            stockUnit:             bs.stockUnit,
            lowStock:              parseFloat(bs.lowStock)              || 0,
            priceOverride:         bs.basePriceOverride    ? parseFloat(bs.basePriceOverride)    : null,
            sellingPriceOverride:  bs.sellingPriceOverride ? parseFloat(bs.sellingPriceOverride) : null,
            discount:              bs.discount             ? parseFloat(bs.discount)             : null,
            taxRate:               bs.taxRate              ? parseFloat(bs.taxRate)              : null,
          };
        })
        .filter((v) => branchVariants[`${variants.find(vv => vv.variantId === v.variantId)?.id}_${selectedBranch?.id ?? "manager"}`]);

      // supplierId is always null until supplier management API is integrated
      const supplierId = null;

      await apiClient.post('/branch-variants/stock', {
        branchId:  selectedBranch?.id ?? undefined,   // undefined = manager uses session branch
        supplierId,
        variants: variantPayload,
      });

      onSave?.({
        branch:     selectedBranch?.name ?? managerBranchName,
        supplierId,
        variants:   branchVariants,
      });

      onClose();
    } catch (err: unknown) {
      console.error("Failed to save stock:", err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || "Failed to save stock.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} title="Add Stock" widthClassName="w-[700px] max-w-[95vw]">
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
          {!branchesLoading && !branchesError && (
            branches.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No branches found.</p>
            ) : (
              <div className="space-y-2">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranch(b)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-orange-50 hover:border-orange-200 transition-all duration-150 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-gray-800">{b.name}</span>
                    {b.city && <span className="ml-2 text-[11px] text-gray-400">{b.city}</span>}
                  </button>
                ))}
              </div>
            )
          )}
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

          {/* Supplier — coming soon */}
          <div className="mb-5 p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center gap-2">
            <span className="text-[11px] text-gray-400">🔗</span>
            <p className="text-[12px] text-gray-400">
              <span className="font-medium text-gray-500">Supplier selection</span> will be available once the supplier management module is set up.
            </p>
          </div>

          {/* Variant list */}
          <div className="overflow-y-auto max-h-[44vh] pr-1 space-y-3">
            {variants.map((v) => {
              const branchKey = selectedBranch?.id ?? "manager";
              const key = `${v.id}_${branchKey}`;
              const bs  = getBS(key);
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
                      {/* Current stock badge — shown after branch is selected or for managers */}
                      {(selectedBranch || isManager) && (
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-full border ${
                          (currentStock[v.variantId] ?? 0) === 0
                            ? "bg-red-50 border-red-200 text-red-500"
                            : (currentStock[v.variantId] ?? 0) <= 10
                            ? "bg-orange-50 border-orange-200 text-orange-600"
                            : "bg-blue-50 border-blue-200 text-blue-600"
                        }`}>
                          Current: {currentStock[v.variantId] ?? 0} {bs.stockUnit}
                        </span>
                      )}
                      {/* Will-be-available indicator */}
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

          {/* Error message */}
          {saveError && (
            <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-[12px] text-red-600">{saveError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
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
              disabled={saving}
              className="px-6 py-2 text-sm bg-orange-500 text-white rounded-4xl hover:bg-orange-600 transition font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Add Stock"}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}