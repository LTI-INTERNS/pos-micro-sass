'use client';

import { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar*/}
        <div className="fixed left-0 top-[60px] bottom-0 z-20 hidden sm:block overflow-y-auto scrollbar-hide hover:scrollbar-show group">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile Sidebar*/}
        <div className="sm:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <main className="flex-1 ml-0 sm:ml-64 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;