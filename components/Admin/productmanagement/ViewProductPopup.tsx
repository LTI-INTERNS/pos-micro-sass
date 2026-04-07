"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";
import { ProductVariant } from "@/types/product.types";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { BranchVariantDetail } from "@/lib/mocks/productmanagement";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  userRole?: "owner" | "admin" | "manager";
};

type TaggedProduct = Product & { _selectedVariantSku?: string };

type ExtendedVariant = ProductVariant & {
  stockQty?: number;
  stockUnit?: string;
  basePriceOverride?: number;
  sellingPriceOverride?: number;
  discount?: number;
  taxRate?: number;
  lowStock?: number;
  available?: boolean;
  sellUnit?: string;
  basePrice?: number | string;
  sellingPrice?: number | string;
};

// Shape of raw branch stock data attached to the product at runtime
type BranchStockMap = Record<string, Record<string, BranchVariantDetail>>;

// Shape of the per-branch variant data used for stock pill calculations
type BranchVariantRaw = {
  stockQty?: number;
  available?: boolean;
};

// ─── Helper: convert DB enum string to a readable label ───────────────────────

function formatOptionName(name: string): string {
  if (!name) return "";
  // e.g. "PACK_SIZE" → "Pack Size", "COLOUR" → "Colour"
  return name
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Reusable styled components ───────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-gray-500 mb-1">{children}</p>;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <p className="text-[15px] font-medium text-gray-800">{title}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
      {children}
    </span>
  );
}

function OptionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] bg-orange-50 border border-orange-200 text-orange-700">
      {children}
    </span>
  );
}

function StatTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: "danger" | "warning" | "normal";
}) {
  const valueColor =
    highlight === "danger"
      ? "text-red-500"
      : highlight === "warning"
      ? "text-orange-500"
      : "text-gray-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className={`text-[13px] font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

function BarcodeTile({ barcode }: { barcode: string }) {
  return (
    <div className="col-span-2 mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2">
      <p className="text-[10px] text-gray-400 mb-0.5">Barcode</p>
      <p className="text-[13px] font-mono font-semibold text-gray-800">{barcode}</p>
    </div>
  );
}

// ─── Branch detail panel (owner / admin) ─────────────────────────────────────

function BranchDetailPanel({
  branchName,
  variants,
  branchVariants,
  currency,
  useCents,
  onBack,
}: {
  branchName: string;
  variants: ProductVariant[];
  branchVariants: Record<string, BranchVariantDetail>;
  currency: string;
  useCents: boolean;
  onBack: () => void;
}) {
  const suppliers = Array.from(
    new Set(
      Object.values(branchVariants)
        .map((bv) => bv.supplier)
        .filter(Boolean) as string[]
    )
  );

  const supplierDisplay =
    suppliers.length === 0
      ? "No Supplier"
      : suppliers.length === 1
      ? suppliers[0]
      : "Multiple Suppliers";

  return (
    <div>
      {/* Branch header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Branch:</span>
          <span className="text-sm font-semibold text-gray-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            {branchName}
          </span>
        </div>
        <button
          onClick={onBack}
          className="text-[12px] text-gray-500 hover:text-orange-500 transition px-3 py-1 rounded-lg hover:bg-orange-50 cursor-pointer"
        >
          ← Back to branches
        </button>
      </div>

      {/* Supplier summary */}
      <div className="mb-5 p-3 bg-orange-50 border border-orange-200 rounded-xl">
        <p className="text-[11px] text-gray-400 mb-1">Supplier</p>
        <p className="text-sm font-semibold text-gray-800">{supplierDisplay}</p>
        {suppliers.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suppliers.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-white border border-orange-200 text-orange-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Variant cards */}
      <div className="space-y-3 overflow-y-auto max-h-[44vh] pr-1">
        {variants.map((v, idx) => {
          const bv: BranchVariantDetail | undefined = branchVariants[v.sku];
          const variantLabel = v.optionValues?.length
            ? v.optionValues.map((o) => o.value).join(" · ")
            : v.sku || `Variant ${idx + 1}`;

          if (!bv) {
            return (
              <div
                key={v.sku || idx}
                className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4"
              >
                <p className="text-[13px] font-medium text-gray-700 mb-1">{variantLabel}</p>
                <p className="text-[12px] text-gray-400">Not stocked at this branch</p>
              </div>
            );
          }

          const basePrice = bv.basePriceOverride != null ? bv.basePriceOverride : v.price;
          const sellingPrice = bv.sellingPriceOverride != null ? bv.sellingPriceOverride : v.price;

          return (
            <div
              key={v.sku || idx}
              className="bg-orange-50 border border-orange-200 rounded-xl p-4"
            >
              {/* Variant header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-200">
                <div>
                  <p className="text-[13px] font-semibold text-gray-700">{variantLabel}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">SKU: {v.sku}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    bv.available
                      ? "bg-green-50 border border-green-200 text-green-600"
                      : "bg-red-50 border border-red-200 text-red-500"
                  }`}
                >
                  {bv.available ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Supplier per variant — only show when variants have different suppliers */}
              {suppliers.length > 1 && bv.supplier && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Supplier
                  </p>
                  <p className="text-[12px] text-gray-700">{bv.supplier}</p>
                </div>
              )}

              {/* Stock */}
              <div className="mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Stock
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatTile
                    label="Quantity"
                    value={`${bv.stockQty} ${bv.stockUnit}`}
                    highlight={
                      bv.stockQty === 0
                        ? "danger"
                        : bv.lowStock != null && bv.stockQty <= bv.lowStock
                        ? "warning"
                        : "normal"
                    }
                  />
                  {bv.lowStock != null && (
                    <StatTile label="Low Stock Alert" value={bv.lowStock} />
                  )}
                </div>
                {bv.stockQty === 0 && (
                  <p className="mt-1.5 text-[11px] text-red-500 font-medium">⚠ Out of stock</p>
                )}
                {bv.stockQty > 0 && bv.lowStock != null && bv.stockQty <= bv.lowStock && (
                  <p className="mt-1.5 text-[11px] text-orange-500 font-medium">⚠ Low stock</p>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Pricing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatTile
                    label="Base Price"
                    value={formatCurrency(basePrice, currency, useCents)}
                  />
                  <StatTile
                    label="Selling Price"
                    value={formatCurrency(sellingPrice, currency, useCents)}
                  />
                </div>
                {(bv.basePriceOverride != null || bv.sellingPriceOverride != null) && (
                  <p className="mt-1.5 text-[11px] text-orange-600">* Branch price override applied</p>
                )}
              </div>

              {/* Tax & Discount */}
              {(bv.taxRate != null || bv.discount != null) && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Tax & Discount
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {bv.discount != null && (
                      <StatTile label="Discount" value={`${bv.discount}%`} />
                    )}
                    {bv.taxRate != null && (
                      <StatTile label="Tax Rate" value={`${bv.taxRate}%`} />
                    )}
                  </div>
                </div>
              )}

              {/* Barcode */}
              {v.barcode && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Barcode
                  </p>
                  <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">Barcode</p>
                    <p className="text-[13px] font-mono font-semibold text-gray-800">{v.barcode}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ViewProductPopup({
  open,
  onClose,
  product,
  userRole = "admin",
}: Props) {
  const { currency, useCents } = useCurrency();
  const isManager = userRole === "manager";

  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Close lightbox with Escape key
  useEffect(() => {
    if (!imagePreviewUrl) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setImagePreviewUrl(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imagePreviewUrl]);

  if (!product) return null;

  const selectedVariantSku: string | undefined = (product as TaggedProduct)._selectedVariantSku;

  const focusedVariant =
    isManager && selectedVariantSku
      ? (product.variants?.find((v) => v.sku === selectedVariantSku) as ExtendedVariant | undefined)
      : null;

  const branchesStock: BranchStockMap | undefined =
    (product as Product & { branchesStock?: BranchStockMap }).branchesStock;
  const branchNames = branchesStock ? Object.keys(branchesStock) : [];

  // Resolve branch detail — prefer fields on focusedVariant, fall back to branchesStock lookup
  const branchVariantDetail =
    isManager && selectedVariantSku && branchesStock
      ? Object.values(branchesStock)
          .flatMap((b) => Object.entries(b))
          .find(([sku]) => sku === selectedVariantSku)?.[1]
      : undefined;

  const stockQty: number        = focusedVariant?.stockQty        ?? branchVariantDetail?.stockQty        ?? 0;
  const stockUnit: string       = focusedVariant?.stockUnit        ?? branchVariantDetail?.stockUnit        ?? "Each";
  const lowStock: number | undefined =
                                   focusedVariant?.lowStock        ?? branchVariantDetail?.lowStock;
  const available: boolean      = focusedVariant?.available        ?? branchVariantDetail?.available        ?? true;
  const basePriceOverride       = focusedVariant?.basePriceOverride  ?? branchVariantDetail?.basePriceOverride;
  const sellingPriceOverride    = focusedVariant?.sellingPriceOverride ?? branchVariantDetail?.sellingPriceOverride;
  const discount: number | undefined =
                                   focusedVariant?.discount        ?? branchVariantDetail?.discount;
  const taxRate: number | undefined =
                                   focusedVariant?.taxRate         ?? branchVariantDetail?.taxRate;

  const variantLabel = focusedVariant?.optionValues?.length
    ? focusedVariant.optionValues.map((o) => o.value).join(" · ")
    : focusedVariant?.sku ?? "";

  const handleClose = () => {
    setActiveBranch(null);
    setImagePreviewUrl(null);
    onClose();
  };

  return (
    <>
    <ModalShell
      open={open}
      onClose={handleClose}
      title={activeBranch ? `Branch Details — ${activeBranch}` : "Product Details"}
      widthClassName="w-[700px] max-w-[95vw]"
    >
      <div className="space-y-5">

        {/* ── Branch detail view (owner/admin) ─────────────────────────────── */}
        {!isManager && activeBranch && branchesStock?.[activeBranch] && (
          <BranchDetailPanel
            branchName={activeBranch}
            variants={product.variants ?? []}
            branchVariants={branchesStock[activeBranch]}
            currency={currency}
            useCents={useCents}
            onBack={() => setActiveBranch(null)}
          />
        )}

        {/* ── Main product view ─────────────────────────────────────────────── */}
        {(isManager || !activeBranch) && (
          <>
            {/* Product name */}
            <div className="border-b border-gray-100 pb-3">
              <p className="text-lg font-semibold text-gray-800">{product.name}</p>
              {isManager && variantLabel && (
                <p className="text-sm text-gray-500 mt-0.5">{variantLabel}</p>
              )}
            </div>

            {/* Category + Supplier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <div className="mt-1">
                  {product.category ? (
                    <Tag>{product.category}</Tag>
                  ) : (
                    <span className="text-sm text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <Label>Supplier</Label>
                <div className="mt-1">
                  {product.supplier ? (
                    <Tag>{product.supplier}</Tag>
                  ) : (
                    <span className="text-sm text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Owner/Admin: Branch pills ──────────────────────────────────── */}
            {!isManager && branchNames.length > 0 && (
              <div>
                <Label>Stocked Branches</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {branchNames.map((branch) => {
                    const bvMap = branchesStock![branch];
                    const bvList = Object.values(bvMap) as BranchVariantRaw[];
                    const totalStock = bvList.reduce(
                      (sum, bv) => sum + (bv.stockQty ?? 0),
                      0
                    );
                    const hasOutOfStock = bvList.some((bv) => bv.stockQty === 0);
                    const allUnavailable = bvList.every((bv) => !bv.available);

                    return (
                      <button
                        key={branch}
                        onClick={() => setActiveBranch(branch)}
                        className={`
                          group flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-medium
                          transition-all duration-150 cursor-pointer
                          ${allUnavailable
                            ? "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                            : hasOutOfStock
                            ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300"
                            : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            allUnavailable
                              ? "bg-gray-300"
                              : hasOutOfStock
                              ? "bg-orange-400"
                              : "bg-green-400"
                          }`}
                        />
                        {branch}
                        <span className="text-[10px] opacity-60">{totalStock} units</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">→</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Click a branch to view stock, pricing and supplier details
                </p>
              </div>
            )}

            {/* ── Scrollable area ── */}
            <div className="overflow-y-auto h-[40vh] pr-1 space-y-5">

              {/* Manager-only: Branch Info tile */}
              {isManager && focusedVariant && (
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-4">

                  {/* Header row with availability badge */}
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-orange-700">Branch Info</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        available
                          ? "bg-green-50 border border-green-200 text-green-600"
                          : "bg-red-50 border border-red-200 text-red-500"
                      }`}
                    >
                      {available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Stock */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Stock
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <StatTile
                        label="Stock Quantity"
                        value={`${stockQty} ${stockUnit}`}
                        highlight={
                          stockQty === 0
                            ? "danger"
                            : lowStock != null && stockQty <= lowStock
                            ? "warning"
                            : "normal"
                        }
                      />
                      {lowStock != null && (
                        <StatTile label="Low Stock Alert" value={lowStock} />
                      )}
                    </div>
                    {stockQty === 0 && (
                      <p className="mt-1.5 text-[11px] text-red-500 font-medium">⚠ Out of stock</p>
                    )}
                    {stockQty > 0 && lowStock != null && stockQty <= lowStock && (
                      <p className="mt-1.5 text-[11px] text-orange-500 font-medium">⚠ Low stock</p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Pricing
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <StatTile
                        label={basePriceOverride != null ? "Base Price (Override)" : "Base Price"}
                        value={formatCurrency(
                          basePriceOverride ?? focusedVariant.price,
                          currency,
                          useCents
                        )}
                      />
                      <StatTile
                        label={sellingPriceOverride != null ? "Selling Price (Override)" : "Selling Price"}
                        value={formatCurrency(
                          sellingPriceOverride ?? focusedVariant.price,
                          currency,
                          useCents
                        )}
                      />
                    </div>
                    {(basePriceOverride != null || sellingPriceOverride != null) && (
                      <p className="mt-1.5 text-[11px] text-orange-600">
                        * Branch price override applied
                      </p>
                    )}
                  </div>

                  {/* Discount & Tax */}
                  {(discount != null || taxRate != null) && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Tax & Discount
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {discount != null && (
                          <StatTile label="Discount" value={`${discount}%`} />
                        )}
                        {taxRate != null && (
                          <StatTile label="Tax Rate" value={`${taxRate}%`} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Barcode */}
                  {focusedVariant.barcode && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Barcode
                      </p>
                      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                        <p className="text-[10px] text-gray-400 mb-0.5">Barcode</p>
                        <p className="text-[13px] font-mono font-semibold text-gray-800">
                          {focusedVariant.barcode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <InfoRow label="Description" value={product.description} />
              )}

              {/* Options — grouped by type so duplicates merge into one card */}
              {product.options?.length > 0 && (() => {
                // Merge options with the same name into one entry
                const grouped = new Map<string, string[]>();
                for (const opt of product.options as { name: string; values: string[] }[]) {
                  const existing = grouped.get(opt.name) ?? [];
                  grouped.set(opt.name, Array.from(new Set([...existing, ...opt.values])));
                }
                return (
                  <div>
                    <SectionTitle title="Product options" />
                    <div className="space-y-3">
                      {Array.from(grouped.entries()).map(([name, values]) => (
                        <div
                          key={name}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-3"
                        >
                          {/* Option type row */}
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                              Option Type
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                              {formatOptionName(name)}
                            </span>
                          </div>
                          {/* Values row */}
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Values
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {values.map((value) => (
                              <OptionTag key={value}>{value}</OptionTag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Variants */}
              {isManager && focusedVariant ? (
                <div>
                  <SectionTitle title="Variant details" />
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] text-gray-400">SKU</p>
                            <p className="text-sm text-gray-800">{focusedVariant.sku}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Sell Unit</p>
                            <p className="text-sm text-gray-700">{focusedVariant.sellUnit ?? "—"}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Base Price</p>
                            <p className="text-sm text-gray-700">
                              {formatCurrency(
                                Number(focusedVariant.basePrice ?? focusedVariant.price ?? 0),
                                currency, useCents
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400">Selling Price</p>
                            <p className="text-sm font-semibold text-orange-600">
                              {formatCurrency(
                                Number(focusedVariant.sellingPrice ?? focusedVariant.price ?? 0),
                                currency, useCents
                              )}
                            </p>
                          </div>
                          {focusedVariant.barcode && (
                            <BarcodeTile barcode={focusedVariant.barcode} />
                          )}
                        </div>
                      </div>
                      {focusedVariant.imageUrl && (
                        <div className="relative w-16 h-16 ml-3 flex-shrink-0">
                          <Image
                            src={focusedVariant.imageUrl}
                            alt={focusedVariant.sku}
                            fill
                            className="object-cover rounded-lg border border-gray-200"
                            sizes="64px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                product.variants?.length > 0 && (
                  <div>
                    <SectionTitle title="Product variants" />
                    <div className="space-y-3 pb-2">
                      {product.variants.map((v: ProductVariant, idx: number) => {
                        const label = v.optionValues?.length
                          ? v.optionValues.map((o) => o.value).join(" · ")
                          : v.sku || `Variant ${idx + 1}`;
                        // Resolve prices — prefer raw basePrice/sellingPrice strings, fall back to mapped price
                        const baseP  = v.basePrice    ? Number(v.basePrice)    : v.price;
                        const sellP  = v.sellingPrice ? Number(v.sellingPrice) : v.price;
                        const unit   = v.sellUnit ?? "";
                        return (
                          <div
                            key={v.sku || idx}
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                          >
                            {/* Header row: label + thumbnail */}
                            <div className="flex items-start justify-between mb-3">
                              <p className="text-[13px] font-semibold text-gray-700">{label}</p>
                              {v.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setImagePreviewUrl(v.imageUrl!)}
                                  className="relative w-14 h-14 ml-3 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-orange-400 transition cursor-zoom-in"
                                  title="Click to enlarge"
                                >
                                  <Image
                                    src={v.imageUrl}
                                    alt={v.sku}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                  {/* Zoom hint overlay */}
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-6-3v6m-3-3h6" />
                                    </svg>
                                  </span>
                                </button>
                              )}
                            </div>

                            {/* Fields grid */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">SKU</p>
                                <p className="text-sm text-gray-800 font-mono">{v.sku}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Sell Unit</p>
                                <p className="text-sm text-gray-700">{unit || "—"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Base Price</p>
                                <p className="text-sm text-gray-700">{formatCurrency(baseP, currency, useCents)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Selling Price</p>
                                <p className="text-sm font-semibold text-orange-600">{formatCurrency(sellP, currency, useCents)}</p>
                              </div>
                              {v.barcode && <BarcodeTile barcode={v.barcode} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {(!product.variants || product.variants.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-[13px] text-gray-400">No variants available</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ModalShell>

    {/* ── Image lightbox overlay ── */}
    {imagePreviewUrl && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={() => setImagePreviewUrl(null)}
      >
        <button
          type="button"
          onClick={() => setImagePreviewUrl(null)}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-xl leading-none z-10"
          aria-label="Close preview"
        >
          ×
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreviewUrl}
            alt="Variant preview"
            className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl border border-white/10"
          />
        </div>
      </div>
    )}
    </>
  );
}