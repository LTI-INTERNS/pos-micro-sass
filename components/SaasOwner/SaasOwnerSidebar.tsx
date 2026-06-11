"use client";

import { useRouter, usePathname } from "next/navigation";
import { Building2, CreditCard, X, Shield } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { label: "Companies", path: "/saasowner/companies", icon: Building2 },
  { label: "Subscription Plans", path: "/saasowner/subscriptions", icon: CreditCard },
];

export default function SaasOwnerSidebar({ isOpen, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-50 top-0 left-0 min-h-full w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative sm:top-0 sm:left-0`}
      >
        <div className="flex justify-end sm:hidden p-4 text-gray-400">
          <button onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path || pathname.startsWith(item.path + "/");

            return (
              <div
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 px-8 py-3 mb-1 text-[11px] cursor-pointer font-bold border-r-4 transition-all
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-500 border-r-orange-500"
                      : "text-gray-400 hover:bg-gray-50 border-r-transparent"
                  }`}
              >
                <Icon size={15} />
                {item.label}
              </div>
            );
          })}
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium px-4">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Shield size={13} className="text-orange-500" />
            </div>
            Platform Admin
          </div>
        </div>
      </aside>
    </>
  );
}
