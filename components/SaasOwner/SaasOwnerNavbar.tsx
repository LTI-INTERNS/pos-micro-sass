"use client";

import { Menu, LogOut, Zap, Shield } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  onMenuToggle: () => void;
}

export default function SaasOwnerNavbar({ onMenuToggle }: Props) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/saaslogin" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center gap-4">
        <button
          className="sm:hidden p-2 rounded hover:bg-orange-100 text-gray-400"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-base font-extrabold tracking-tight text-gray-900 leading-none">
              POS Platform
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              SaaS Owner Console
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Shield size={12} />
          SaaS Owner
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-orange-100 text-orange-500 px-4 py-1.5 hover:bg-orange-500 hover:text-white cursor-pointer rounded-full text-xs font-semibold transition-all active:scale-90"
        >
          <LogOut size={13} />
          Log Out
        </button>
      </div>
    </nav>
  );
}
