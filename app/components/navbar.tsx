'use client';

import { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
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
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Coca Logo" className="w-10 h-10 rounded-full" />
          <img src="/coca.svg" alt="Coca" className="h-6" />
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <span className="font-bold text-gray-800">Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="bg-gray-100 px-4 py-1 rounded-full text-[13px] font-bold text-gray-600">
          {formatTime(currentTime)} {formatDate(currentTime)}
        </span>
        <button className="bg-orange-100 text-primary px-4 py-1 cursor-pointer rounded-full text-orange-500 text-[13px] font-semibold ">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;