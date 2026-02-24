'use client';

import { useState } from 'react';
import PosNavbar from '@/components/Pos/posdashboard/PosNav';
import PreviousOrdersModal from '@/components/Pos/posdashboard/PreviousOrdersModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PosNavbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8">{children}</main>
      </div>

      <PreviousOrdersModal
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
