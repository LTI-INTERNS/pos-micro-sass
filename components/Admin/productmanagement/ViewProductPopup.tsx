"use client";

import Image from "next/image";
import ModalShell from "@/components/Admin/common/ModalShell";
import { Product } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  userRole?: "owner" | "admin" | "manager";
};

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
  highlight?: "danger" | "normal";
}) {
  const valueColor = highlight === "danger" ? "text-red-500" : "text-gray-800";
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className={`text-[13px] font-semibold ${valueColor}`}>{value}</p>
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

  if (!product) return null;

  const selectedVariantSku: string | undefined = (product as any)._selectedVariantSku;

  const focusedVariant =
    isManager && selectedVariantSku
      ? product.variants?.find((v) => v.sku === selectedVariantSku)
      : null;

  const stockQty: number = (focusedVariant as any)?.stockQty ?? 0;
  const basePriceOverride: number | undefined = (focusedVariant as any)?.basePriceOverride;
  const sellingPriceOverride: number | undefined = (focusedVariant as any)?.sellingPriceOverride;
  const barcode: string | undefined = (focusedVariant as any)?.barcode;

  const variantLabel = focusedVariant?.optionValues?.length
    ? focusedVariant.optionValues.map((o: { value: string }) => o.value).join(" · ")
    : focusedVariant?.sku ?? "";

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Product Details"
      widthClassName="w-[700px] max-w-[95vw]"
    >
      <div className="space-y-5">
        {/* Product name */}
        <div className="border-b border-gray-100 pb-3">
          <p className="text-lg font-semibold text-gray-800">{product.name}</p>
          {isManager && variantLabel && (
            <p className="text-sm text-gray-500 mt-0.5">{variantLabel}</p>
          )}
        </div>

        {/* Category + Supplier — always visible above scroll */}
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

        {/* ── Scrollable area — fixed h-[52vh] for both roles ── */}
        <div className="overflow-y-auto h-[52vh] pr-1 space-y-5">

          {/* Manager-only: Branch Info (stock, pricing, barcode) — inside scroll */}
          {isManager && focusedVariant && (
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-4">
              <p className="text-[13px] font-semibold text-orange-700">Branch Info</p>

              {/* Stock */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Stock
                </p>
                <StatTile
                  label="Stock Quantity"
                  value={stockQty}
                  highlight={stockQty === 0 ? "danger" : "normal"}
                />
                {stockQty === 0 && (
                  <p className="mt-1.5 text-[11px] text-red-500 font-medium">⚠ Out of stock</p>
                )}
              </div>

              {/* Pricing */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Pricing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatTile
                    label="Base Price"
                    value={
                      basePriceOverride != null
                        ? formatCurrency(basePriceOverride, currency, useCents)
                        : formatCurrency(focusedVariant.price, currency, useCents)
                    }
                  />
                  <StatTile
                    label="Selling Price"
                    value={
                      sellingPriceOverride != null
                        ? formatCurrency(sellingPriceOverride, currency, useCents)
                        : formatCurrency(focusedVariant.price, currency, useCents)
                    }
                  />
                </div>
                {(basePriceOverride != null || sellingPriceOverride != null) && (
                  <p className="mt-1.5 text-[11px] text-orange-600">* Branch price override applied</p>
                )}
              </div>

              {/* Barcode */}
              {barcode && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Barcode
                  </p>
                  <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">Barcode</p>
                    <p className="text-[13px] font-mono font-semibold text-gray-800">{barcode}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <InfoRow label="Description" value={product.description} />
          )}

          {/* Options */}
          {product.options?.length > 0 && (
            <div>
              <SectionTitle title="Product options" />
              <div className="space-y-3">
                {product.options.map(
                  (opt: { name: string; values: string[] }, i: number) => (
                    <div
                      key={i}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-3"
                    >
                      <p className="text-[13px] font-medium text-gray-700 mb-2">{opt.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {opt.values.map((value) => (
                          <OptionTag key={value}>{value}</OptionTag>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Variants — manager sees only the focused variant; owner/admin see all */}
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
                        <p className="text-[11px] text-gray-400">Price</p>
                        <p className="text-sm font-medium text-orange-600">
                          {formatCurrency(focusedVariant.price, currency, useCents)}
                        </p>
                      </div>
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
                  {product.variants.map(
                    (
                      v: {
                        sku: string;
                        price: number;
                        imageUrl?: string;
                        optionValues?: { optionName: string; value: string }[];
                      },
                      idx: number
                    ) => {
                      const label = v.optionValues?.length
                        ? v.optionValues.map((o) => o.value).join(" · ")
                        : v.sku || `Variant ${idx + 1}`;
                      return (
                        <div
                          key={v.sku || idx}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-gray-700 mb-2">{label}</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-[11px] text-gray-400">SKU</p>
                                  <p className="text-sm text-gray-800">{v.sku}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-gray-400">Price</p>
                                  <p className="text-sm font-medium text-orange-600">
                                    {formatCurrency(v.price, currency, useCents)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {v.imageUrl && (
                              <div className="relative w-16 h-16 ml-3 flex-shrink-0">
                                <Image
                                  src={v.imageUrl}
                                  alt={v.sku}
                                  fill
                                  className="object-cover rounded-lg border border-gray-200"
                                  sizes="64px"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
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
      </div>
    </ModalShell>
  );
}