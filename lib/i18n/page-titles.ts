/**
 * Page title translations for header display
 */
export const pageTitles = {
  en: {
    "/": "Home",
    "/login": "Login",
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/settings": "Settings",
    "/access-keys": "Access Keys",
    "/reports": "Reports",
    "/analytics": "Analytics",
    "/advanced-settings": "Advanced Settings",
    "/manager/bi": "Business Intelligence",
    "/manager/hr-evaluation": "HR Evaluation",
    "/backoffice/business-trip": "Business Trip Request",
    "/backoffice/expense-claim": "Expense Claim",
    "/admin": "Admin Panel",
    "/admin/users": "User Management",
    "/admin/access-keys": "Access Key Management",
  },
  ja: {
    "/": "ホーム",
    "/login": "ログイン",
    "/dashboard": "ダッシュボード",
    "/profile": "プロフィール",
    "/settings": "設定",
    "/access-keys": "アクセスキー",
    "/reports": "レポート",
    "/analytics": "分析ツール",
    "/advanced-settings": "高度な設定",
    "/manager/bi": "ビジネスインテリジェンス",
    "/manager/hr-evaluation": "人事評価",
    "/backoffice/business-trip": "出張申請",
    "/backoffice/expense-claim": "経費精算",
    "/admin": "管理画面",
    "/admin/users": "ユーザー管理",
    "/admin/access-keys": "アクセスキー管理",
  },
} as const;

export function getPageTitle(pathname: string, language: "en" | "ja"): string {
  const titles = pageTitles[language];
  return titles[pathname as keyof typeof titles] || "RBAC Demo";
}
