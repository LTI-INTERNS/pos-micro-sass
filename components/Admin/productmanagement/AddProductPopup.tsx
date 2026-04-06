"use client";

import * as React from "react";
import ModalShell from "@/components/Admin/common/ModalShell";
import { useNotifications } from "@/lib/context/NotificationsContext";
import { getCategoriesByBusinessType } from "@/components/Admin/productmanagement/Productcategorydata";
import {
  ProductState,
  AddProductPopupProps,
  ExistingProduct,
  STEPS,
  isNewId,
  emptyState,
} from "./types";
import { StepBar } from "./ui-components";
import { Step1, Step1VariantSelect, Step2, Step3 } from "./step-components";

export type { ExistingProduct } from "./types";

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

  const [selectedProductIds, setSelectedProductIds] = React.useState<Set<number | string>>(new Set());
  const [selectedOptionIds, setSelectedOptionIds] = React.useState<Set<number>>(new Set());
  const [selectedVariantIds, setSelectedVariantIds] = React.useState<Set<number>>(new Set());

  const isManagerVariantMode = userRole === "manager" && isAddVariantMode;
  const isManagerEditMode = userRole === "manager" && !!initialData && !isAddVariantMode;

  const modalTitle = isManagerVariantMode ? "Add Product from Company Catalog" : initialData ? "Edit Product" : "Add New Product";

  React.useEffect(() => {
    if (!open) return;
    setStep(0);
    setSelectedProductIds(new Set());
    setSelectedOptionIds(new Set());
    setSelectedVariantIds(new Set());

    if (initialData) {
      if (isManagerEditMode && companyProduct) {
        // companyProduct supplied: diff against initialData to show only items not yet in branch
        const branchOptionNames = new Set(initialData.options.map((o) => o.name));
        const branchVariantSkus = new Set(initialData.variants.map((v) => v.sku));
        const availableOptions = (companyProduct.options ?? []).filter((o) => !branchOptionNames.has(o.name));
        const availableVariants = (companyProduct.variants ?? []).filter((v) => !branchVariantSkus.has(v.sku));
        setState({ ...initialData, options: availableOptions, variants: availableVariants });
        setSelectedOptionIds(new Set(availableOptions.map((o) => o.id)));
        setSelectedVariantIds(new Set(availableVariants.map((v) => v.id)));
      } else if (isManagerEditMode && !companyProduct) {
        // No companyProduct: load all options/variants from initialData and pre-select all
        setState(initialData);
        setSelectedOptionIds(new Set(initialData.options.map((o) => o.id)));
        setSelectedVariantIds(new Set(initialData.variants.map((v) => v.id)));
      } else {
        setState(initialData);
      }
    } else {
      setState(emptyState());
    }
  }, [open, initialData, isManagerEditMode, companyProduct]);

  const patch = (p: Partial<ProductState>) => setState((prev) => ({ ...prev, ...p }));

  const handleToggleProduct = (p: ExistingProduct) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(p.id)) { next.delete(p.id); } else { next.add(p.id); }
      return next;
    });
  };

  const handleSelectAll = (filtered: ExistingProduct[], checked: boolean) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (checked) { filtered.forEach((p) => next.add(p.id)); }
      else { filtered.forEach((p) => next.delete(p.id)); }
      return next;
    });
  };

  const handleLoadProduct = (p: ExistingProduct) => {
    const opts = (p.options ?? []).map((o) => ({ ...o, id: o.id ?? Math.floor(Date.now() * Math.random()) }));
    const vars = (p.variants ?? []).map((v, i) => ({ ...v, id: v.id ?? i + 1 }));
    setState({ name: p.name, categoryId: p.categoryId || p.category, brand: p.brand ?? "", description: p.description ?? "", options: opts, variants: vars });
    setSelectedOptionIds(new Set(opts.map((o) => o.id)));
    setSelectedVariantIds(new Set(vars.map((v) => v.id)));
  };

  const toggleOption = (id: number) =>
    setSelectedOptionIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });

  const toggleVariant = (id: number) =>
    setSelectedVariantIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });

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
    if (step === 1 && isManagerVariantMode && selectedProductIds.size === 1 && selectedOptionIds.size === 0)
      return "Please select at least one option.";
    if (step === 2) {
      if (isManagerVariantMode && selectedProductIds.size === 1 && selectedVariantIds.size === 0)
        return "Please select at least one variant.";
      if (!isManagerVariantMode && !isManagerEditMode) {
        if (state.variants.length === 0) return "Please add at least one product variant.";
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
    ? "Add Products to Branch"
    : isManagerEditMode
      ? managerAddedNewItems ? "Submit for Approval" : "Update Product"
      : initialData
        ? "Update Product"
        : userRole === "manager"
          ? "Submit for Approval"
          : "Add Product";

  return (
    <ModalShell open={open} title={modalTitle} onClose={onClose} widthClassName="w-[860px] max-w-[95vw]">
      <form onSubmit={(e) => { e.preventDefault(); if (step === STEPS.length - 1) { handleSave(); } else { handleNext(); } }}>
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
              selectedProductCount={selectedProductIds.size}
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
              selectedProductCount={selectedProductIds.size}
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