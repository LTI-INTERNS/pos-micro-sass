"use client";

import { useState } from "react";
import SaasOwnerNavbar from "@/components/SaasOwner/SaasOwnerNavbar";
import SaasOwnerSidebar from "@/components/SaasOwner/SaasOwnerSidebar";

interface Props {
  children: React.ReactNode;
}

export default function SaasOwnerLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-30">
        <SaasOwnerNavbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      </div>

      {/* Navbar height spacer */}
      <div className="h-[57px]" />

      <div className="flex flex-1 overflow-x-hidden">
        {/* Desktop sidebar */}
        <div className="fixed left-0 top-[57px] bottom-0 z-20 hidden sm:block w-64 overflow-y-auto bg-white border-r border-gray-200">
          <SaasOwnerSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile sidebar */}
        <div className="sm:hidden">
          <SaasOwnerSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 ml-0 sm:ml-64 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
