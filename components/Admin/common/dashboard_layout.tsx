'use client';

import { useState } from 'react';
import Navbar from '@/components/Admin/common/navbar';
import Sidebar from '@/components/Admin/common/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
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

      <div className="h-[50px]"></div>

      <div className="flex flex-1 overflow-x-hidden">
        {/* Desktop Sidebar*/}
        <div className="fixed left-0 top-[60px] bottom-0 z-20 hidden sm:block overflow-y-auto scrollbar-hide hover:scrollbar-show group">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile Sidebar*/}
        <div className="sm:hidden scrollbar-hide hover:scrollbar-show group">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 ml-0 sm:ml-64 top-[50px] overflow-y-auto p-8 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
