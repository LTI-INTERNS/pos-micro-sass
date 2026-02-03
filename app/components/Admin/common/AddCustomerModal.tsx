"use client";

import { useState } from "react";
import ActionButton from "./ActionButton";

export type CustomerFormValues = {
  name: string;
  phoneNumber: string;
  phoneNumber2?: string;
  email?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
};

export default function AddCustomerModal({ open, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<CustomerFormValues>({
    name: "",
    phoneNumber: "",
    phoneNumber2: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<CustomerFormValues>>({});

  if (!open) return null;

  const handleChange = (field: keyof CustomerFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<CustomerFormValues> = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (values.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email && !emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      phoneNumber2: values.phoneNumber2?.trim(),
      email: values.email?.trim(),
    });

    setValues({
      name: "",
      phoneNumber: "",
      phoneNumber2: "",
      email: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-center text-black">
          Add New Customer
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Name *
          </label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-lg px-3 py-2 outline-none
              border border-gray-300
              text-gray-500 placeholder:text-gray-400
              focus:border-orange-400
              focus:ring-2 focus:ring-orange-400"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone number 1 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Phone number 1 *
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter customer phone number1"
            value={values.phoneNumber}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              if (onlyNumbers.length <= 10) {
                handleChange("phoneNumber", onlyNumbers);
              }
            }}
            className="w-full rounded-lg px-3 py-2 outline-none
              border border-gray-300
              text-gray-500 placeholder:text-gray-400
              focus:border-orange-400
              focus:ring-2 focus:ring-orange-400"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Phone number 2 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">
            Phone number 2 (optional)
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter customer phone number2"
            value={values.phoneNumber2}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              if (onlyNumbers.length <= 10) {
                handleChange("phoneNumber2", onlyNumbers);
              }
            }}
            className="w-full rounded-lg px-3 py-2 outline-none
              border border-gray-300
              text-gray-500 placeholder:text-gray-400
              focus:border-orange-400
              focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-black">
            Email (optional)
          </label>
          <input
            type="email"
            placeholder="Enter customer e-mail"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg px-3 py-2 outline-none
              border border-gray-300
              text-gray-500 placeholder:text-gray-400
              focus:border-orange-400
              focus:ring-2 focus:ring-orange-400"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <ActionButton
            label="Cancel"
            onClick={onClose}
            className="flex-1 border border-orange-400 text-orange-500 rounded-full"
          />
          <ActionButton
            label="Add Customer"
            onClick={handleSubmit}
            variant="primary"
            className="flex-1 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
