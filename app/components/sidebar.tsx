'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    'Dashboard',
    'Customers Management',
    'Products Management',
    'Cashier Management',
    'Expenses Management',
    'Profit Calculation',
    'Recurring Expenses Management',
    'Supplier Management',
    'Reports',
    'Ai Prediction',
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed z-50 top-0 left-0 min-h-full w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:relative sm:top-0 sm:left-0`}
      >

        <div className="flex justify-end sm:hidden p-4">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          {menuItems.map((item) => (
            <div
              key={item}
              onClick={() => setActiveItem(item)}
              className={`px-8 py-3 mb-2 text-[11px] cursor-pointer font-bold border-r-4 ${
                activeItem === item
                  ? 'bg-orange-50 text-orange-500 border-r-orange-500'
                  : 'text-gray-400 hover:bg-gray-50 border-r-transparent'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-600 cursor-pointer hover:bg-gray-50 rounded">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;