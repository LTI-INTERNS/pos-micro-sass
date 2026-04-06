// ─── Shared Types for AddProductPopup ────────────────────────────────────────

import { BusinessTypeId } from "@/components/Admin/productmanagement/Productcategorydata";

export type ProductOption = {
  id: number;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: number;
  sku: string;
  barcode: string;
  imageUrl: string;
  basePrice: string;
  sellingPrice: string;
  sellUnit: string;
  optionValues: { optionName: string; value: string }[];
};

export type ProductState = {
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
  categoryId?: string;
  brand?: string;
  description?: string;
  options?: ProductOption[];
  variants?: ProductVariant[];
};

export type AddProductPopupProps = {
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

export const STEPS = ["Product info", "Options", "Variants"];
export const OPTION_NAMES = ["Weight", "Size", "Volume", "Colour", "Flavour", "Pack Size"];
export const SELL_UNITS = ["Each", "kg", "g", "mg", "l", "ml", "m", "inch", "Cube"];
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const NEW_ID_PREFIX = 9_000_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isNewId(id: number) {
  return id >= NEW_ID_PREFIX;
}

export const emptyState = (): ProductState => ({
  name: "",
  categoryId: "",
  brand: "",
  description: "",
  options: [],
  variants: [],
});