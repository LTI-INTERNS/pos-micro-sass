"use client";

import { useState } from "react";
import AddCustomerForm from "@/app/components/POSCustomer/AddCustomerForm";
import { CustomerFormValues } from "@/app/components/Dashboard/common/AddCustomerModal";

export default function POSDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerFormValues | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customers
          </h1>
          <p className="text-gray-600">Manage your customers</p>
        </div>

        <button
          onClick={() => setModalOpen(true)} // ✅ fixed setter
          className="inline-flex items-center px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
        >
          Add New Customer
        </button>
      </div>

      <AddCustomerForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectCustomer={(customer) => setSelectedCustomer(customer)}
      />

      {/* Commented out view logic for later implementation */}
      {/*
      {selectedCustomer && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>
            <strong>Selected Customer:</strong> {selectedCustomer.name}
          </p>
          <p>
            <strong>Phone:</strong> {selectedCustomer.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {selectedCustomer.email}
          </p>
        </div>
      )}
      */}
    </div>
  );
}
