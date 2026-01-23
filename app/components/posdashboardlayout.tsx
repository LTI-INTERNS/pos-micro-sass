'use client';

import { useState } from 'react';
import Navbar from '../components/posNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
        }
        .scrollbar-hide:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .scrollbar-hide:hover {
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>

     
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      
      

      
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
