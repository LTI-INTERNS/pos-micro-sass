'use client';

import Clock from '../../Landing/clock';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/app/components/Admin/notifications/NotificationBell';
import { useStoreInfo } from "@/app/context/StoreInfoContext";
import Image from 'next/image'; // <-- Import Next.js Image

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const router = useRouter();
  const { storeInfo } = useStoreInfo();

  const handleLogout = () => {
    router.push('/login'); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <button className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-4">
          {storeInfo.logoUrl && (
            <Image
              src={storeInfo.logoUrl}
              alt="Store Logo"
              width={32}        // set desired width
              height={32}       // set desired height
              className="object-contain"
            />
          )}
          <div className="leading-tight hidden sm:block">
            <p className="text-2xl font-extrabold tracking-tight text-gray-900 leading-none">
              {storeInfo.storeName}
            </p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
        <span className="font-bold text-gray-800">Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Clock variant="navbar" />
        <NotificationBell />
        <button
          onClick={handleLogout} 
          className="bg-orange-100 text-primary px-4 py-1 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full text-orange-500 text-[13px] font-semibold transition-all active:scale-90">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;