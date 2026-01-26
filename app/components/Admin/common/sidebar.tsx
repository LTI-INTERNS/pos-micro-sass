'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { label: 'Dashboard', path: '/overview' },
    { label: 'Staff Management', path: '/staffmanagement' },
    { label: 'Customers Management', path: '/customermanagement' },
    { label: 'Products Management', path: '/productmanagement' },
    { label: 'Cashier Management', path: '/cashiermanagement' },
    { label: 'Expenses Management', path: '/expensesmanagement' },
    { label: 'Profit Calculation', path: '/profitcalculation' },
    { label: 'Recurring Expenses Management', path: '/recexpenses' },
    { label: 'Supplier Management', path: '/suppliermanagement' },
    { label: 'Reports', path: '/reports' },
    { label: 'Ai Prediction', path: '/aiprediction' },
    { label: 'Branches', path: '/branchmanagement' },
  ];


  // Auto detect active item based on URL
  useEffect(() => {
    const active = menuItems.find(item =>
      pathname === item.path || pathname.startsWith(item.path + '/')
    );

    if (active) {
      setActiveItem(active.label);
    } else if (pathname.startsWith('/settings')) {
      setActiveItem('Settings');
    }
  },[pathname]);


  const handleNavigation = (item: { label: string; path: string }) => {
    setActiveItem(item.label);
    router.push(item.path);
    onClose(); // close sidebar on mobile
  };


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

        <div className="flex justify-end sm:hidden p-4 text-gray-400">
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleNavigation(item)}
              className={`px-8 py-3 mb-2 text-[11px] cursor-pointer font-bold border-r-4
                ${
                  activeItem === item.label
                    ? 'bg-orange-50 text-orange-500 border-r-orange-500'
                    : 'text-gray-400 hover:bg-gray-50 border-r-transparent'
                }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="p-5">
          <div
            onClick={() => {
              setActiveItem('Settings');
              router.push('/Settings');
              onClose();
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer
              ${activeItem === 'Settings' 
                ? "bg-orange-50 text-orange-500 border-r-orange-500" 
                : "text-gray-400 hover:bg-gray-50 border-r-4 border-r-transparent"
              }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;