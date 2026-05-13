'use client';

import { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Settings, X } from 'lucide-react';
import { useStoreInfo } from '@/lib/context/StoreInfoContext';
import { hasAIPrediction } from '@/types/subscription.types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'CASHIER';

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router   = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = (session?.user?.role?.toUpperCase() ?? 'CASHIER') as UserRole;

  const { storeInfo } = useStoreInfo();
  const hasAI = hasAIPrediction(storeInfo.subscription?.aiPredictionLevel);

  const allMenuItems = useMemo(() => [
    { label: 'Dashboard',            path: '/overview',          roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Staff Management',     path: '/staffmanagement',   roles: ['OWNER', 'ADMIN'] as UserRole[] },
    { label: 'Customers Management', path: '/customermanagement',roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Products Management',  path: '/productmanagement', roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Order Management',     path: '/ordermanagement',   roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Cashier Management',   path: '/cashiermanagement', roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Expenses Management',  path: '/expensesmanagement',roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Profit Calculation',   path: '/profitcalculation', roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Supplier Management',  path: '/suppliermanagement',roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    { label: 'Reports',              path: '/reports',           roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[] },
    // ── AI Prediction — only shown when the plan includes AI access ──
    { label: 'Ai Prediction',        path: '/aiprediction',      roles: ['OWNER', 'ADMIN', 'MANAGER'] as UserRole[], planRequired: true },
    { label: 'Branches',             path: '/branchmanagement',  roles: ['OWNER', 'ADMIN'] as UserRole[] },
    { label: 'POS Dashboard',        path: '/posdashboard',      roles: ['CASHIER'] as UserRole[] },
  ], []);

  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      if (item.roles && !item.roles.includes(userRole)) return false;
      if (item.planRequired && !hasAI) return false;
      return true;
    });
  }, [userRole, allMenuItems, hasAI]);

  const activeItem = useMemo(() => {
    if (pathname.startsWith('/settings')) return 'Settings';
    const active = menuItems.find(item =>
      pathname === item.path || pathname.startsWith(item.path + '/')
    );
    return active ? active.label : '';
  }, [pathname, menuItems]);

  const handleNavigation = (item: { label: string; path: string }) => {
    router.push(item.path);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

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

        {/* Settings — hidden for CASHIER */}
        {userRole !== 'CASHIER' && (
          <div className="p-5">
            <div
              onClick={() => { router.push('/settings'); onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded cursor-pointer
                ${activeItem === 'Settings'
                  ? 'bg-orange-50 text-orange-500 border-r-orange-500'
                  : 'text-gray-400 hover:bg-gray-50 border-r-4 border-r-transparent'
                }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;