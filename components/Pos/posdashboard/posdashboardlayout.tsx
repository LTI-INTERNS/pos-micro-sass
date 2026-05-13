'use client';

import { useState } from 'react';
import PosNavbar from '@/components/Pos/posdashboard/PosNav';
import PreviousOrdersModal from '@/components/Pos/posdashboard/PreviousOrdersModal';
import StockAlertProvider from '@/components/Admin/notifications/StockAlertProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [ordersOpen, setOrdersOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PosNavbar
        toggleSidebar={() => {/* sidebar not yet implemented */}}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8">{children}</main>
      </div>

      <PreviousOrdersModal
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      {/* Stock alert toasts — branch-wise, variant-level, bottom-right */}
      <StockAlertProvider />
    </div>
  );
};

export default DashboardLayout;
