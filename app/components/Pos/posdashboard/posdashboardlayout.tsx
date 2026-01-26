
'use client';

import { useState } from 'react';
import PosNavbar from './PosNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <PosNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden"> 
        <main className="flex-1 overflow-y-auto px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
