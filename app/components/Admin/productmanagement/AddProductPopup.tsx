import * as React from "react";
import ModalShell from "../common/ModalShell";
import FormField from "../common/FormField";
import PopupActions from "../common/PopupActions";

type ProductValues = {
  name: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
  imageUrl?: string;
};

type FormErrors = Partial<Record<keyof ProductValues, string>> & {
  image?: string;
};

type AddProductPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: ProductValues) => void;
};

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function AddProductPopup({
  open,
  onClose,
  onSave,
}: AddProductPopupProps) {
  const [values, setValues] = React.useState<ProductValues>({
    name: "",
    price: "",
    discount: "",
    tax: "",
    stock: "",
    imageUrl: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  
  React.useEffect(() => {
    if (!open) return;

    setValues({
      name: "",
      price: "",
      discount: "",
      tax: "",
      stock: "",
      imageUrl: "",
    });

    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open]);

  const setField = (name: keyof ProductValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isValidNumber = (v: string) => v.trim() !== "" && !Number.isNaN(Number(v));

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

    
    // if (!imagePreview) {
    //   newErrors.image = "Product image is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file: File | null) => {
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const payload: ProductValues = {
      ...values,
      imageUrl: imagePreview || "",
    };

    onSave(payload);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Add New Product"
      onClose={handleCancel}
      widthClassName="w-[980px] max-w-[92vw]"
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <FormField
          label="Name"
          placeholder="Enter name"
          value={values.name}
          onChange={(v) => setField("name", v)}
          type="text"
        />
        {errors.name && <p className="text-xs text-red-500 px-3">{errors.name}</p>}

        <FormField
          label="Price"
          placeholder="Enter price"
          value={values.price}
          onChange={(v) => setField("price", v)}
          type="number"
        />
        {errors.price && <p className="text-xs text-red-500 px-3">{errors.price}</p>}

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

        <FormField
          label="Tax"
          placeholder="Enter tax"
          value={values.tax}
          onChange={(v) => setField("tax", v)}
          type="number"
        />
        {errors.tax && <p className="text-xs text-red-500 px-3">{errors.tax}</p>}

        <FormField
          label="Stock"
          placeholder="Enter stock"
          value={values.stock}
          onChange={(v) => setField("stock", v)}
          type="number"
        />
        {errors.stock && <p className="text-xs text-red-500 px-3">{errors.stock}</p>}

        
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

        
        <div className="flex items-center justify-center pt-4">
          <div className="w-[420px]">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: handleCancel, variant: "secondary" },
                { label: "Save", onClick: handleSave, variant: "primary" },
              ]}
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
