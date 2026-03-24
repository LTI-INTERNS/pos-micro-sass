"use client";

import Image from "next/image";
import Clock from '@/components/Landing/clock';
import { Menu, History, Lock } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

interface NavbarProps {
  toggleSidebar: () => void;
  onOpenOrders: () => void; 
}

const PosNavbar = ({ toggleSidebar, onOpenOrders }: NavbarProps) => {
  const { storeInfo } = useStoreInfo();

  /**
   * Lock — keeps the branch session alive so the switch-user screen
   * can still show cashier avatars, but clears the cashier's personal
   * session by signing out and redirecting to /switchuser.
   */
  const handleLock = async () => {
    localStorage.setItem('isLocked', 'true');
    sessionStorage.removeItem('cashier');
    // Sign out clears the NextAuth cookie (cashier JWT).
    // callbackUrl sends them to /switchuser after the sign-out completes.
    await signOut({ callbackUrl: '/switchuser' });
  };

  /**
   * Log Out — full sign-out. Clears NextAuth session, sessionStorage,
   * and the lock flag, then sends to /login.
   */
  const handleLogout = async () => {
    localStorage.removeItem('isLocked');
    sessionStorage.removeItem('cashier');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <button
          className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-5">
          <div className="relative w-6 h-6">
            <Image
              src="/ArrowButton.png"
              alt="Arrow button"
              fill
              className="object-contain"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-4">
            {storeInfo.logoUrl && (
              <div className="relative w-8 h-8">
                <Image
                  src={storeInfo.logoUrl}
                  alt={`${storeInfo.storeName} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
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

        <button
          onClick={onOpenOrders}
          className="p-2 rounded-full hover:bg-orange-100 text-orange-500 cursor-pointer"
          title="Previous Orders"
          aria-label="Previous Orders"
        >
          <History size={20} />
        </button>

        {/* Lock — clears cashier session, keeps branch session */}
        <button
          onClick={handleLock}
          title="Lock POS"
          className="flex items-center gap-2 bg-gray-100 hover:bg-orange-500 hover:text-white cursor-pointer
                     text-orange-500 px-3 py-1 rounded-full text-[13px] font-semibold transition-all active:scale-90"
        >
          <Lock size={14} />
          Lock
        </button>

        {/* Log Out — full sign-out */}
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