"use client";

import ModalShell from "../common/ModalShell";
import ReusableForm, { FieldConfig } from "../common/ReusableForm";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";
import * as React from "react";

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: {
    id: string;
    name: string;
    supplier: string;
     category: string;
    price: number;
    discount: number;
    tax: number;
    stock: number;
    lowstock: number;
    imageUrl?: string;
  }) => void;
};

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg","image/jpg", "image/png"];

const addProductFields: FieldConfig[] = [
  { name: "id", label: "ID", placeholder: "Enter ID", type: "text" },
  { name: "name", label: "Name", placeholder: "Enter name", type: "text" },
  { name: "supplier", label: "Supplier", placeholder: "Enter supplier", type: "text" },
  { name: "category", label: "Category", placeholder: "Enter category", type: "text" },
  { name: "price", label: "Price", placeholder: "Enter price", type: "number" },
  { name: "discount", label: "Discount", placeholder: "Enter discount", type: "number" },
  { name: "tax", label: "Tax", placeholder: "Enter tax", type: "number" },
  { name: "stock", label: "Stock", placeholder: "Enter stock count / In Stock", type: "number" },
  { name: "lowstock", label: "lowStock", placeholder: "Enter lowstock count / Available", type: "number" },
];

export default function AddProductPopup({ open, onClose, onSave }: AddProductPopupProps) {
  const [latestValues, setLatestValues] = React.useState<Record<string, string>>({});
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);


  const handleImageChange = (file: File | null) => {
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    //Type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPG, JPEG, or PNG images are allowed");
      return;
    }

    //Size validation
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

     if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    /** 
     * Api logic for image upload can be added here
     * For now, we just pass the image file name as imageUrl
    */
   const payload = {
      ...latestValues,

      // TEMP: image URL placeholder
      imageUrl : imagePreview || "",
  };

    /** 
     * Save `payload` to database
     */

    onSave(payload as any);
  }

  return (
    <ModalShell open={open} title="Add New Product" onClose={onClose} widthClassName="w-[980px] max-w-[92vw]">
      <div className="space-y-1 mt-[-4px]">
        
        <ReusableForm
          fields={addProductFields.filter(
            (f) => !["tax", "discount", "stock", "lowstock", "category", "price"].includes(f.name)
          )}
          onSubmit={(values) => {
            setLatestValues(values);
            onSave(values as any);
          }}
        />

        <div className="flex gap-4">
          {addProductFields
            .filter((f) => ["category", "price"].includes(f.name))
            .map((f) => (
              <div className="flex-1" key={f.name}>
                <FormField
                  label={f.label}
                  placeholder={f.placeholder}
                  type={f.type}
                  value={latestValues[f.name] ?? ""}
                  onChange={(next) =>
                    setLatestValues((prev) => ({ ...prev, [f.name]: next }))
                  }
                />
              </div>
            ))}
        </div>
        
        {/* Discount & Tax inline */}
        <div className="flex gap-4">
          {addProductFields
            .filter((f) => ["discount", "tax"].includes(f.name))
            .map((f) => (
              <div className="flex-1" key={f.name}>
                <FormField
                  label={f.label}
                  placeholder={f.placeholder}
                  type={f.type}
                  value={latestValues[f.name] ?? ""}
                  onChange={(next) =>
                    setLatestValues((prev) => ({ ...prev, [f.name]: next }))
                  }
                />
              </div>
            ))}
        </div>

        {/* Stock & LowStock inline */}
        <div className="flex gap-4">
          {addProductFields
            .filter((f) => ["stock", "lowstock"].includes(f.name))
            .map((f) => (
              <div className="flex-1" key={f.name}>
                <FormField
                  label={f.label}
                  placeholder={f.placeholder}
                  type={f.type}
                  value={latestValues[f.name] ?? ""}
                  onChange={(next) =>
                    setLatestValues((prev) => ({ ...prev, [f.name]: next }))
                  }
                />
              </div>
            ))}
        </div>

        {/* Product Image */}
        <div className="space-y-2">
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

        {/* Actions */}
        <div className="flex items-center justify-center">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                { label: "Save", onClick: handleSave, variant: "primary" },
              ]}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
