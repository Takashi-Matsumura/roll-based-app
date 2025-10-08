export const dashboardTranslations = {
  en: {
    title: "Dashboard",
    welcome: "Welcome to Your Dashboard",
    description:
      "This is your central hub for managing your account and accessing various features based on your role and permissions.",
    quickActions: "Quick Actions",
    viewProfile: "View Profile",
    viewProfileDesc: "Manage your personal information and settings",
    accessKeys: "Access Keys",
    accessKeysDesc: "Manage your API access keys",
  },
  ja: {
    title: "ダッシュボード",
    welcome: "ダッシュボードへようこそ",
    description:
      "ここは、アカウントを管理し、ロールと権限に基づいてさまざまな機能にアクセスするための中心的な場所です。",
    quickActions: "クイックアクション",
    viewProfile: "プロフィールを表示",
    viewProfileDesc: "個人情報と設定を管理",
    accessKeys: "アクセスキー",
    accessKeysDesc: "APIアクセスキーを管理",
  },
} as const;

export type DashboardTranslationKey = keyof typeof dashboardTranslations.en;
