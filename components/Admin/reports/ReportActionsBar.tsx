"use client";

import ActionButton from "@/components/Admin/common/ActionButton";
import TabSelector from "@/components/Admin/common/TabSelector";

const TABLE_TABS = [
  { id: "sales",    label: "Sales"    },
  { id: "expenses", label: "Expenses" },
  { id: "products", label: "Products" },
];


type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasSelection: boolean;
  onViewDetails: () => void;
};

export default function ReportActionsBar({
  activeTab,
  onTabChange,
  hasSelection,
  onViewDetails,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <TabSelector
          tabs={TABLE_TABS}
          activeTab={activeTab}
          onChange={onTabChange}
        />
      </div>

      {hasSelection && (
        <ActionButton
          label="View Details"
          variant="outline"
          fullWidth={false}
          onClick={onViewDetails}
          className="px-5 whitespace-nowrap"
        />
      )}
    </div>
  );
}
