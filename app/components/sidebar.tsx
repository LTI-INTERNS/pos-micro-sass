'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';

const Sidebar = () => {
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
    'Ai Prediction'
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="py-5 flex-1 overflow-y-auto"   >
        {menuItems.map((item) => (
          <div
            key={item}
            onClick={() => setActiveItem(item)}
            className={`px-8 py-3 mb-2 text-[11px] cursor-pointer font-bold border-r-4 ${
              activeItem === item
                ? 'bg-orange-50 text-orange-500 border-r-orange-500b bg-ml-5'
                : 'text-gray-400 hover:bg-gray-50 border-r-transparent'
            }`}
          >
            {item}
          </div>
        ))}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-3 px-4 py-3 text-gray-600  cursor-pointer hover:bg-gray-50 rounded">
            <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;