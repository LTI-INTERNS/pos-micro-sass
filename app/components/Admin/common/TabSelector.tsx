"use client";

import React from "react";

type Tab = {
  id: string;
  label: string;
};

type TabSelectorProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string; // let page control positioning
};

export default function TabSelector({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabSelectorProps) {
  // Safety check for undefined tabs
  if (!tabs || tabs.length === 0) {
    return null;
  }
  
  // Map tab count to Tailwind grid classes
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };
  
  const gridCols = gridColsMap[tabs.length] || "grid-cols-2";
  
  return (
    <div
      className={`grid ${gridCols} bg-white border border-gray-200 rounded-lg overflow-hidden w-full ${className}`}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;

        return (
          <React.Fragment key={tab.id}>
            <button
              onClick={() => onChange(tab.id)}
              className={`
                relative flex items-center justify-center
                px-6 py-2.5 text-sm font-medium transition-all
                ${index < tabs.length - 1 ? "border-r border-gray-200" : ""}
                ${
                  isActive
                    ? "bg-orange-50 text-orange-500 font-semibold"
                    : "text-gray-400 hover:text-gray-700 cursor-pointer"
                }
              `}
            >
              {tab.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}