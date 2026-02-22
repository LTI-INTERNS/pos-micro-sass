'use client';

import Clock from '../../Landing/clock';
import { Menu, History, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStoreInfo } from "@/app/context/StoreInfoContext";

interface NavbarProps {
  toggleSidebar: () => void;
  onOpenOrders: () => void; 
}

const PosNavbar = ({ toggleSidebar, onOpenOrders }: NavbarProps) => {
  const router = useRouter();
  const { storeInfo } = useStoreInfo();

  const handleLock = () => {
    // mark POS as locked
    localStorage.setItem('isLocked', 'true');
    router.push('/switchuser');
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <button
          className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-5">
          <img src="/ArrowButton.png" className="w-6 h-6" />
            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-4">
              {storeInfo.logoUrl && (
                <img
                  src={storeInfo.logoUrl}
                  alt="Store Logo"
                  className="w-8 h-8 object-contain"
                />
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-gray-900">
                  {storeInfo?.storeName || "Store Name"}
                </span>

                <span className="text-xs text-gray-400 font-medium">
                  {storeInfo?.branchName || "Main Branch"}
                </span>
              </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Clock variant="navbar" />
        {/* Previous Orders */}
        <button
          onClick={onOpenOrders}
          className="p-2 rounded-full hover:bg-orange-100 text-orange-500 cursor-pointer"
          title="Previous Orders"
        >
          <History size={20} />
        </button>
        <button
          onClick={handleLock}
          title="Lock POS"
          className="flex items-center gap-2 bg-gray-100 hover:bg-orange-500 hover:text-white cursor-pointer
                     text-orange-500 px-3 py-1 rounded-full text-[13px] font-semibold transition-all active:scale-90"
        >
          <Lock size={14} />
          Lock
        </button>
        <button
          onClick={handleLogout}
          className="bg-orange-100 text-primary px-4 py-1 hover:bg-orange-500 hover:text-white cursor-pointer
                     rounded-full text-orange-500 text-[13px] font-semibold transition-all active:scale-90"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default PosNavbar;
