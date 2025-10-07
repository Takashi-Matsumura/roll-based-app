import type { AppModule, MenuGroup } from "@/types/module";

/**
 * メニューグループの定義
 */
export const menuGroups: Record<string, MenuGroup> = {
  user: {
    id: "user",
    name: "USER",
    nameJa: "ユーザー",
    order: 1,
  },
  manager: {
    id: "manager",
    name: "MANAGER",
    nameJa: "マネージャー",
    color: "text-blue-700",
    order: 2,
  },
  backoffice: {
    id: "backoffice",
    name: "BACK OFFICE",
    nameJa: "バックオフィス",
    color: "text-orange-700",
    order: 3,
  },
  permission: {
    id: "permission",
    name: "Additional Features",
    nameJa: "追加機能",
    color: "text-green-700",
    order: 4,
  },
  admin: {
    id: "admin",
    name: "ADMIN",
    nameJa: "管理者",
    color: "text-purple-700",
    order: 5,
  },
};

/**
 * アプリケーションモジュールのレジストリ
 * ここに全てのモジュール（小皿）を登録する
 */
export const moduleRegistry: Record<string, AppModule> = {
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    nameJa: "ダッシュボード",
    path: "/dashboard",
    menuGroup: "user",
    requiredRoles: ["USER", "MANAGER", "BACKOFFICE", "ADMIN"],
    order: 1,
    enabled: true,
    icon: (
      <svg
        key="dashboard-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },

  profile: {
    id: "profile",
    name: "Profile",
    nameJa: "プロフィール",
    path: "/profile",
    menuGroup: "user",
    requiredRoles: ["USER", "MANAGER", "BACKOFFICE", "ADMIN"],
    order: 2,
    enabled: false, // Profile is handled separately in sidebar, not as a module
    icon: (
      <svg
        key="profile-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },

  accessKeys: {
    id: "accessKeys",
    name: "Access Keys",
    nameJa: "アクセスキー",
    path: "/access-keys",
    menuGroup: "user",
    requiredRoles: ["USER", "MANAGER", "BACKOFFICE", "ADMIN"],
    order: 3,
    enabled: true,
    icon: (
      <svg
        key="accessKeys-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },

  businessIntelligence: {
    id: "businessIntelligence",
    name: "Business Intelligence",
    nameJa: "ビジネスインテリジェンス",
    path: "/manager/bi",
    menuGroup: "manager",
    requiredRoles: ["MANAGER", "ADMIN"],
    order: 1,
    enabled: true,
    icon: (
      <svg
        key="businessIntelligence-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },

  hrEvaluation: {
    id: "hrEvaluation",
    name: "HR Evaluation",
    nameJa: "人事評価",
    path: "/manager/hr-evaluation",
    menuGroup: "manager",
    requiredRoles: ["MANAGER", "ADMIN"],
    order: 2,
    enabled: true,
    icon: (
      <svg
        key="hrEvaluation-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },

  businessTrip: {
    id: "businessTrip",
    name: "Business Trip Request",
    nameJa: "出張申請",
    path: "/backoffice/business-trip",
    menuGroup: "backoffice",
    requiredRoles: ["BACKOFFICE", "ADMIN"],
    order: 1,
    enabled: true,
    icon: (
      <svg
        key="businessTrip-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },

  expenseClaim: {
    id: "expenseClaim",
    name: "Expense Claim",
    nameJa: "経費精算",
    path: "/backoffice/expense-claim",
    menuGroup: "backoffice",
    requiredRoles: ["BACKOFFICE", "ADMIN"],
    order: 2,
    enabled: true,
    icon: (
      <svg
        key="expenseClaim-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },

  reports: {
    id: "reports",
    name: "Reports",
    nameJa: "レポート",
    path: "/reports",
    menuGroup: "permission",
    requiredPermissions: ["reports"],
    order: 1,
    enabled: true,
    icon: (
      <svg
        key="reports-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },

  analytics: {
    id: "analytics",
    name: "Analytics",
    nameJa: "分析ツール",
    path: "/analytics",
    menuGroup: "permission",
    requiredPermissions: ["analytics"],
    order: 2,
    enabled: true,
    icon: (
      <svg
        key="analytics-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },

  advancedSettings: {
    id: "advancedSettings",
    name: "Advanced Settings",
    nameJa: "高度な設定",
    path: "/advanced-settings",
    menuGroup: "permission",
    requiredPermissions: ["advanced_settings"],
    order: 3,
    enabled: true,
    icon: (
      <svg
        key="advancedSettings-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  },

  adminPanel: {
    id: "adminPanel",
    name: "Admin Panel",
    nameJa: "管理画面",
    path: "/admin",
    menuGroup: "admin",
    requiredRoles: ["ADMIN"],
    order: 1,
    enabled: true,
    icon: (
      <svg
        key="adminPanel-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },

  userManagement: {
    id: "userManagement",
    name: "User Management",
    nameJa: "ユーザー管理",
    path: "/admin/users",
    menuGroup: "admin",
    requiredRoles: ["ADMIN"],
    order: 2,
    enabled: true,
    icon: (
      <svg
        key="userManagement-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },

  accessKeyManagement: {
    id: "accessKeyManagement",
    name: "Access Key Management",
    nameJa: "アクセスキー管理",
    path: "/admin/access-keys",
    menuGroup: "admin",
    requiredRoles: ["ADMIN"],
    order: 3,
    enabled: true,
    icon: (
      <svg
        key="accessKeyManagement-icon"
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          key="icon-path"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },
};

/**
 * 全モジュールを取得
 */
export function getAllModules(): AppModule[] {
  return Object.values(moduleRegistry).filter((module) => module.enabled);
}

/**
 * 有効なモジュールを取得
 */
export function getEnabledModules(): AppModule[] {
  return Object.values(moduleRegistry).filter((module) => module.enabled);
}

/**
 * IDでモジュールを取得
 */
export function getModuleById(id: string): AppModule | undefined {
  return moduleRegistry[id];
}
