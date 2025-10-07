"use client";

import Link from "next/link";
import { useState } from "react";

interface MenuItem {
  id?: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuGroupProps {
  title: string;
  items: MenuItem[];
  color?: string;
  isSidebarCollapsed: boolean;
}

export function MenuGroup({
  title,
  items,
  color = "text-gray-700",
  isSidebarCollapsed,
}: MenuGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isSidebarCollapsed) {
    // When sidebar is collapsed, show items without grouping
    return (
      <>
        {items.map((item) => (
          <Link
            key={item.id || item.href}
            href={item.href}
            className={`flex items-center gap-3 py-3 ${color} hover:bg-gray-100 rounded-lg transition px-2 justify-center`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-1">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase hover:bg-gray-50 rounded-lg transition"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            key="chevron-down"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Group Items */}
      {isExpanded && (
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.id || item.href}
              href={item.href}
              className={`flex items-center gap-3 py-3 ${color} hover:bg-gray-100 rounded-lg transition px-4`}
              title={item.label}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
