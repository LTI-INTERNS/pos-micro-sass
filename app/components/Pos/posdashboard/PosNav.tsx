'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const PosNavbar = ({ toggleSidebar }: NavbarProps) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        {/*Hamburger menu for mobile responsivenes */}
        <button className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400"  onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-5">
          <img src="/ArrowButton.png" alt="Coca Logo" className="w-6 h-6 rounded-full" />
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <img src="/Vector.png" alt="Coca" className="h-6 hidden sm:block" />
          <div className='flex flex-col '>
            <span className="font-bold text-gray-800 text-sm ">Walk-In </span>
            <span className=" text-gray-300 text-sm">Coca coffeetalk </span>
          </div>
        </div>
        
        
       
      </div>
      
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline bg-gray-100 px-4 py-1 rounded-full text-[13px] font-bold text-gray-600">
          {currentTime
            ? `${formatTime(currentTime)} ${formatDate(currentTime)}`
            : '--:--:-- --/--/----'}
        </span>
        <button className="bg-orange-100 text-primary px-4 py-1 cursor-pointer rounded-full text-orange-500 text-[13px] font-semibold ">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default PosNavbar;