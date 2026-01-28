'use client';

import Clock from '../../Landing/clock';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    // clear auth/session data
    // localStorage.removeItem('token');
    // cookies, etc.

    router.push('/landing'); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        {/*Hamburger menu for mobile responsivenes */}
        <button className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400"  onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Coca Logo" className="w-8 h-8 rounded-full" />
          <img src="/coca.svg" alt="Coca" className="h-4 hidden sm:block" />
        </div>
        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
        <span className="font-bold text-gray-800">Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Clock variant="navbar" />
        <button
          onClick={handleLogout} 
          className="bg-orange-100 text-primary px-4 py-1 cursor-pointer rounded-full text-orange-500 text-[13px] font-semibold">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
