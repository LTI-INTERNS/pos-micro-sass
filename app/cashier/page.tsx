'use client';

import { useState } from 'react';
import DashboardLayout from '@/app/components/dashboard_layout';
import { AddCashierForm } from '@/app/components/Cashier/AddCashierForm';

export default function CashierPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Cashier Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Add Cashier
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Cashier list will be displayed here...</p>
        </div>
      </div>

      <AddCashierForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}
