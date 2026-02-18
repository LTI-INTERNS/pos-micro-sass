"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  key?: string; 
};

type Props = {
  items: NavItem[];
 
  activeHref?: string;

 
  autoActiveByRoute?: boolean;

  className?: string;
};

export default function SectionNav({
  items,
  activeHref,
  autoActiveByRoute = true,
  className = "",
}: Props) {
  const pathname = usePathname();

  const resolvedActiveHref =
    autoActiveByRoute ? (activeHref ?? pathname) : (activeHref ?? "");

  return (
    <nav
      className={[
        "w-full bg-white border border-black/10 rounded-md",
        "px-6 py-3",
        className,
      ].join(" ")}
    >
      <ul className="flex items-center justify-between gap-6">
        {items.map((item) => {
          const isActive =
            resolvedActiveHref === item.href ||
            (item.href !== "/" && resolvedActiveHref.startsWith(item.href));

          return (
            <li key={item.key ?? item.href} className="flex-1">
              <Link
                href={item.href}
                className={[
                  "relative block text-center",
                  "text-[15px] font-medium",
                  "transition-colors",
                  isActive ? "text-orange-500" : "text-gray-600 hover:text-gray-800",
                ].join(" ")}
              >
                {item.label}

                
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 -bottom-2",
                    "h-0.5 rounded-full transition-all",
                    isActive ? "w-20 bg-orange-500" : "w-0 bg-transparent",
                  ].join(" ")}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
