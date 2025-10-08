"use client";

import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";
import { MenuGroup } from "./MenuGroup";
import { RoleBadge } from "./RoleBadge";
import { useSidebar } from "./SidebarToggle";
import { SignOutButton } from "./SignOutButton";
import {
  menuGroupConfigs,
  isMenuGroupVisible,
  type MenuGroupConfig,
} from "@/lib/menu-metadata";

interface SidebarProps {
  session: Session;
  userPermissions?: string[];
  language?: string;
}

export function Sidebar({
  session,
  userPermissions = [],
  language = "en",
}: SidebarProps) {
  const { isOpen, toggle } = useSidebar();

  // Translation function
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Dashboard",
        profile: "Profile",
        apiKeys: "API Keys",
        businessIntelligence: "Business Intelligence",
        hrEvaluation: "HR Evaluation",
        businessTrip: "Business Trip Request",
        expenseClaim: "Expense Claim",
        reports: "Reports",
        analytics: "Analytics",
        advancedSettings: "Advanced Settings",
        adminPanel: "Admin Panel",
        userManagement: "User Management",
        apiKeyManagement: "API Key Management",
        settings: "Settings",
        user: "USER",
        manager: "MANAGER",
        backOffice: "BACKOFFICE",
        additionalFeatures: "Additional Features",
        admin: "ADMIN",
      },
      ja: {
        dashboard: "ダッシュボード",
        profile: "プロフィール",
        apiKeys: "APIキー",
        businessIntelligence: "ビジネスインテリジェンス",
        hrEvaluation: "人事評価",
        businessTrip: "出張申請",
        expenseClaim: "経費精算",
        reports: "レポート",
        analytics: "分析ツール",
        advancedSettings: "高度な設定",
        adminPanel: "管理画面",
        userManagement: "ユーザー管理",
        apiKeyManagement: "APIキー管理",
        settings: "設定",
        user: "ユーザー",
        manager: "マネージャー",
        backOffice: "バックオフィス",
        additionalFeatures: "追加機能",
        admin: "管理者",
      },
    };
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Define all menu items organized by menu group
  const menuItemsByGroup: Record<string, Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
  }>> = {
    USER: [
      {
        href: "/dashboard",
        label: t("dashboard"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
      {
        href: "/profile",
        label: t("profile"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        href: "/access-keys",
        label: t("apiKeys"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
      },
    ],
    MANAGER: [
      {
        href: "/manager/bi",
        label: t("businessIntelligence"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
      {
        href: "/manager/hr-evaluation",
        label: t("hrEvaluation"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        ),
      },
    ],
    BACKOFFICE: [
      {
        href: "/backoffice/business-trip",
        label: t("businessTrip"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        href: "/backoffice/expense-claim",
        label: t("expenseClaim"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
    ],
    ADMIN: [
      {
        href: "/admin",
        label: t("adminPanel"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
      {
        href: "/admin/users",
        label: t("userManagement"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
      },
      {
        href: "/admin/access-keys",
        label: t("apiKeyManagement"),
        icon: (
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
      },
    ],
  };

  // Add permission-based menu items to BACKOFFICE group
  if (userPermissions.includes("reports")) {
    if (!menuItemsByGroup.BACKOFFICE) {
      menuItemsByGroup.BACKOFFICE = [];
    }
    menuItemsByGroup.BACKOFFICE.push({
      href: "/reports",
      label: t("reports"),
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    });
  }

  if (userPermissions.includes("analytics")) {
    if (!menuItemsByGroup.BACKOFFICE) {
      menuItemsByGroup.BACKOFFICE = [];
    }
    menuItemsByGroup.BACKOFFICE.push({
      href: "/analytics",
      label: t("analytics"),
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    });
  }

  if (userPermissions.includes("advanced_settings")) {
    if (!menuItemsByGroup.BACKOFFICE) {
      menuItemsByGroup.BACKOFFICE = [];
    }
    menuItemsByGroup.BACKOFFICE.push({
      href: "/advanced-settings",
      label: t("advancedSettings"),
      icon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    });
  }

  // Get sorted menu groups and filter by visibility
  const visibleMenuGroups = Object.values(menuGroupConfigs)
    .sort((a, b) => a.order - b.order)
    .filter((group) => {
      // Check if group is visible to current user
      if (!isMenuGroupVisible(group.id, session.user.role)) {
        return false;
      }
      // Check if group has any menu items
      return menuItemsByGroup[group.id]?.length > 0;
    });

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-16"} bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header with Toggle Button and App Name */}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {isOpen && (
            <Link href="/" className="text-xl font-bold text-gray-800">
              RBAC Demo
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-4">
          {/* Dynamically render all visible menu groups */}
          {visibleMenuGroups.map((group) => {
            const items = menuItemsByGroup[group.id] || [];
            if (items.length === 0) return null;

            return (
              <MenuGroup
                key={group.id}
                title={group.label[language as "en" | "ja"] || group.label.en}
                items={items}
                color={group.color}
                isSidebarCollapsed={!isOpen}
              />
            );
          })}
        </nav>

        {/* User Info and Sign Out Button at Bottom */}
        <div className="mt-auto pt-6 border-t">
          {/* Settings Link */}
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 mb-4 text-gray-700 hover:bg-gray-100 rounded-lg transition ${!isOpen ? "justify-center" : ""}`}
            title={!isOpen ? "Settings" : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isOpen && <span className="font-medium">{t("settings")}</span>}
          </Link>

          {/* User Info */}
          {isOpen && (
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                {session.user.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {session.user.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {session.user.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <RoleBadge role={session.user.role} />
            </div>
          )}

          {/* User Avatar Only (when collapsed) */}
          {!isOpen && (
            <div className="mb-4 flex justify-center">
              {session.user.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">
                    {session.user.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Sign Out Button */}
          <SignOutButton collapsed={!isOpen} />
        </div>
      </div>
    </aside>
  );
}
