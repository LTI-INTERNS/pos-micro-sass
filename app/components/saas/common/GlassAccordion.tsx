"use client";

import React from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type GlassAccordionProps = {
  items: AccordionItem[];

  /** first item open by default */
  defaultOpenId?: string;

  /** optional class */
  className?: string;
};

export default function GlassAccordion({
  items,
  defaultOpenId,
  className = "",
}: GlassAccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    defaultOpenId ?? (items[0]?.id ?? null)
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className="w-full">
            {/* Row */}
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-white/90 text-sm sm:text-base">
                {index + 1}. {item.title}
              </span>

              <span className="text-white/70 text-xl font-light select-none">
                {isOpen ? "–" : "+"}
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="pb-4">
                <div className="text-white/65 text-sm leading-relaxed max-w-4xl">
                  {item.content}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px w-full bg-white/25" />
          </div>
        );
      })}
    </div>
  );
}
