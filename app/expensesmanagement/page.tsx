"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import TabSelector from "@/components/Admin/common/TabSelector";
import ExpensesContent from "@/components/Admin/expensesmanagement/ExpensesContent";
import RecurringExpensesContent from "@/components/Admin/recexpenses/RecExpensesContent";

const TABS = [
  { id: "expenses", label: "Expenses" },
  { id: "recurring", label: "Recurring Expenses" },
];

export default function ExpensesManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("expenses");

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <TabSelector
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "expenses" ? (
          <ExpensesContent />
        ) : (
          <RecurringExpensesContent />
        )}
      </div>
    </DashboardLayout>
  );
}