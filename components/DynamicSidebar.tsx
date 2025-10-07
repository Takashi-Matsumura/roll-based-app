"use client";

import { useState } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { useSidebar } from "./SidebarToggle";
import { SignOutButton } from "./SignOutButton";
import { RoleBadge } from "./RoleBadge";
import { MenuGroup } from "./MenuGroup";
import type { AppModule } from "@/types/module";

interface DynamicSidebarProps {
  session: Session;
  accessibleModules: AppModule[];
  groupedModules: Record<string, AppModule[]>;
  menuGroups: Array<{
    id: string;
    name: string;
    nameJa: string;
    color?: string;
  }>;
  language?: string;
}

export function DynamicSidebar({
  session,
  accessibleModules,
  groupedModules,
  menuGroups,
  language = "en",
}: DynamicSidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [isBottomMenuExpanded, setIsBottomMenuExpanded] = useState(true);

  // 翻訳関数
  const t = (en: string, ja: string) => {
    return language === "ja" ? ja : en;
  };

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-16"} bg-white shadow-lg h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col`}
    >
      {/* Header with Toggle Button and App Name */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                key="menu-icon"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {isOpen && (
            <Link href="/" className="text-xl font-bold text-gray-800">
              {t("RBAC Demo", "RBACデモ")}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Menu - Dynamic (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-4">
        {menuGroups.map((group) => {
          const modules = groupedModules[group.id] || [];
          if (modules.length === 0) return null;

          // モジュールをメニュー項目形式に変換
          const menuItems = modules.map((module) => ({
            id: module.id,
            href: module.path,
            label: language === "ja" ? module.nameJa : module.name,
            icon: module.icon,
          }));

          return (
            <MenuGroup
              key={group.id}
              title={language === "ja" ? group.nameJa : group.name}
              items={menuItems}
              color={group.color}
              isSidebarCollapsed={!isOpen}
            />
          );
        })}
      </nav>

      {/* User Info and Sign Out Button at Bottom (Fixed) - Dark Mode */}
      <div className="flex-shrink-0 p-4 pt-6 border-t bg-gray-800 relative">
        {/* Collapsible Bottom Menu - Profile and Settings with z-index, Dark Mode, and Slide Animation */}
        <div
          className={`absolute bottom-full left-0 right-0 bg-gray-800 shadow-lg border border-gray-700 z-50 mb-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isBottomMenuExpanded ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="py-0">
            {/* Profile Link */}
            <Link
              href="/profile"
              className={`flex items-center gap-3 px-3 py-2 mx-4 mt-4 mb-2 text-white hover:bg-gray-700 rounded-lg transition ${!isOpen ? "justify-center" : ""}`}
              title={!isOpen ? t("Profile", "プロフィール") : undefined}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  key="profile-path"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {isOpen && (
                <span className="font-medium">
                  {t("Profile", "プロフィール")}
                </span>
              )}
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2 mx-4 mb-4 text-white hover:bg-gray-700 rounded-lg transition ${!isOpen ? "justify-center" : ""}`}
              title={!isOpen ? t("Settings", "設定") : undefined}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  key="settings-gear"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  key="settings-center"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isOpen && (
                <span className="font-medium">{t("Settings", "設定")}</span>
              )}
            </Link>
          </div>
        </div>

        {/* User Info - Clickable to toggle bottom menu - Dark Mode */}
        {isOpen && (
          <button
            type="button"
            onClick={() => setIsBottomMenuExpanded(!isBottomMenuExpanded)}
            className="w-full mb-4 text-left hover:bg-gray-700 rounded-lg p-2 transition"
          >
            <div className="flex items-center gap-3 mb-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {session.user.name}
                </div>
                <div className="text-xs text-gray-300 truncate">
                  {session.user.email}
                </div>
              </div>
              {/* Chevron icon */}
              <svg
                className={`w-5 h-5 text-gray-300 transition-transform ${isBottomMenuExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  key="chevron-path"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <RoleBadge role={session.user.role} />
          </button>
        )}

        {/* User Avatar Only (when collapsed) - also clickable - Dark Mode */}
        {!isOpen && session.user.image && (
          <button
            type="button"
            onClick={() => setIsBottomMenuExpanded(!isBottomMenuExpanded)}
            className="mb-4 flex justify-center w-full hover:bg-gray-700 rounded-lg transition py-2"
            title={t("Toggle menu", "メニューを切り替え")}
          >
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          </button>
        )}

        {/* Sign Out Button */}
        <SignOutButton collapsed={!isOpen} />
      </div>
    </aside>
  );
}
