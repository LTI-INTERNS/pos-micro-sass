"use client";

import * as React from "react";
import ModalShell from "../common/ModalShell";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";
import { useNotifications } from "../notifications/NotificationsContext";


type SoldBy = "each" | "volume_weight";

type ProductValues = {
  name: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
  soldBy: SoldBy;
  unit: string;
  imageUrl?: string;
};

type FormErrors = Partial<Record<keyof ProductValues, string>> & {
  image?: string;
};

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: ProductValues) => void;

  // Pass role + branch info from your auth/session
  userRole?: "admin" | "branch_manager" | string;
  branchName?: string;
  branchManager?: string;
};

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const VOLUME_WEIGHT_UNITS = [
  "kg", "g", "lb", "oz",
  "L", "mL", "fl oz", "gal",
  "m", "cm", "ft", "in",
];

export default function AddProductPopup({
  open,
  onClose,
  onSave,
  userRole = "branch_manager",
  branchName = "Unknown Branch",
  branchManager = "Unknown Manager",
}: AddProductPopupProps) {
  const { addNotification } = useNotifications();

  const [values, setValues] = React.useState<ProductValues>({
    name: "",
    price: "",
    discount: "",
    tax: "",
    stock: "",
    soldBy: "each",
    unit: "",
    imageUrl: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setValues({ name: "", price: "", discount: "", tax: "", stock: "", soldBy: "each", unit: "", imageUrl: "" });
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open]);

  const setField = (name: keyof ProductValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setSoldBy = (soldBy: SoldBy) => {
    setValues((prev) => ({ ...prev, soldBy, unit: "" }));
    setErrors((prev) => ({ ...prev, unit: "" }));
  };

  const isValidNumber = (v: string) =>
    v.trim() !== "" && !Number.isNaN(Number(v));

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    } else if (values.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!values.price.trim()) {
      newErrors.price = "Price is required";
    } else if (!isValidNumber(values.price)) {
      newErrors.price = "Price must be a valid number";
    } else if (Number(values.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!values.discount.trim()) {
      newErrors.discount = "Discount is required";
    } else if (!isValidNumber(values.discount)) {
      newErrors.discount = "Discount must be a valid number";
    } else if (Number(values.discount) < 0) {
      newErrors.discount = "Discount cannot be negative";
    }

    if (!values.tax.trim()) {
      newErrors.tax = "Tax is required";
    } else if (!isValidNumber(values.tax)) {
      newErrors.tax = "Tax must be a valid number";
    } else if (Number(values.tax) < 0) {
      newErrors.tax = "Tax cannot be negative";
    }

    if (!values.stock.trim()) {
      newErrors.stock = "Stock is required";
    } else if (!isValidNumber(values.stock)) {
      newErrors.stock = "Stock must be a valid number";
    } else if (Number(values.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (values.soldBy === "volume_weight" && !values.unit.trim()) {
      newErrors.unit = "Please select a unit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file: File | null) => {
    setImageError(null);
    if (!file) { setImageFile(null); setImagePreview(null); return; }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, JPEG, or PNG images are allowed");
      return;
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_IMAGE_SIZE_MB) {
      setImageError(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const payload: ProductValues = { ...values, imageUrl: imagePreview || "" };

    if (userRole === "branch_manager") {
      addNotification({
        type: "approval_pending",
        message: `New product request from ${branchName} — "${values.name.trim()}" awaiting approval`,
        productApproval: {
          id: Date.now(),
          productName: values.name.trim(),
          price: values.price,
          discount: values.discount,
          tax: values.tax,
          stock: values.stock,
          unit: values.soldBy === "volume_weight" ? values.unit : "each",
          imageUrl: imagePreview || "",
          branchName,
          branchManager,
          submittedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "pending",
        },
      });
    }

    onSave(payload);
    onClose();
  };


  return (
    <ModalShell
      open={open}
      title="Add New Product"
      onClose={onClose}
      widthClassName="w-[980px] max-w-[92vw]"
    >
      <form
        className="space-y-3"
        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
      >
        <FormField
          label="Name"
          placeholder="Enter name"
          value={values.name}
          onChange={(v) => setField("name", v)}
          type="text"
        />
        {errors.name && (
          <p className="text-xs text-red-500 px-3">{errors.name}</p>
        )}

        <FormField
          label="Price"
          placeholder="Enter price"
          value={values.price}
          onChange={(v) => setField("price", v)}
          type="number"
        />
        {errors.price && (
          <p className="text-xs text-red-500 px-3">{errors.price}</p>
        )}

        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <FormField
              label="Discount"
              placeholder="Enter discount"
              value={values.discount}
              onChange={(v) => setField("discount", v)}
              type="number"
            />
            {errors.discount && (
              <p className="text-xs text-red-500 px-3">{errors.discount}</p>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <FormField
              label="Tax"
              placeholder="Enter tax"
              value={values.tax}
              onChange={(v) => setField("tax", v)}
              type="number"
            />
            {errors.tax && (
              <p className="text-xs text-red-500 px-3">{errors.tax}</p>
            )}
          </div>
        </div>

        <FormField
          label="Stock"
          placeholder="Enter stock"
          value={values.stock}
          onChange={(v) => setField("stock", v)}
          type="number"
        />
        {errors.stock && (
          <p className="text-xs text-red-500 px-3">{errors.stock}</p>
        )}

        <div className="flex gap-4 items-start pt-1">
          <div className="space-y-2">
            <label className="text-[12px] text-gray-500">Sold By</label>
            <div className="flex gap-3">
              {(
                [
                  { value: "each", label: "Each" },
                  { value: "volume_weight", label: "Volume / Weight" },
                ] as { value: SoldBy; label: string }[]
              ).map(({ value, label }) => {
                const active = values.soldBy === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSoldBy(value)}
                    className={`
                      rounded-full border px-4 py-2 text-sm font-normal transition-all outline-none
                      ${active
                        ? "border-orange-500 text-orange-600 ring-2 ring-orange-200 bg-white"
                        : "border-gray-200 text-gray-800 hover:border-orange-300"
                      }
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {values.soldBy === "volume_weight" && (
            <div className="flex-1">
              <FormField
                label="Unit"
                type="dropdown"
                placeholder="Select a unit…"
                value={values.unit}
                onChange={(v) => setField("unit", v)}
                options={VOLUME_WEIGHT_UNITS.map((u) => ({ value: u, label: u }))}
              />
              {errors.unit && (
                <p className="mt-1 text-xs text-red-500 px-3">{errors.unit}</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-[12px] text-gray-500">Product Image</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-full file:border-0
              file:bg-orange-50 file:px-4 file:py-2
              file:text-sm file:font-medium file:text-orange-600
              hover:file:bg-orange-100 hover:file:cursor-pointer"
          />

          {imageError && <p className="text-xs text-red-500">{imageError}</p>}
          {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}

          {imagePreview && (
            <div className="relative mt-2 h-28 w-28">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full
                  bg-black/70 text-white flex items-center justify-center
                  text-xs hover:bg-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {userRole === "branch_manager" && (
          <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
            <span className="text-orange-400 text-base">📋</span>
            <p className="text-xs text-orange-600 font-medium">
              This product will be sent to admin for approval before it goes live.
            </p>
          </div>
        )}

        <div className="flex items-center justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                {
                  label: userRole === "branch_manager" ? "Submit for Approval" : "Save",
                  onClick: handleSave,
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}