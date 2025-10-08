export const homeTranslations = {
  en: {
    title: "Welcome to RBAC Demo App",
    description:
      "This is a demonstration of Role-Based Access Control (RBAC) using Next.js 15, NextAuth.js v5, Prisma, and Tailwind CSS 4.",
    features: "Features",
    feature1: "Google OAuth authentication",
    feature2: "Five user roles: Guest, User, Manager, Back Office, and Admin",
    feature3: "Access key-based permission system for granular control",
    feature4: "Protected routes based on authentication and role",
    feature5: "Dynamic navigation menu based on user role and permissions",
    feature6: "Multi-language support (English/Japanese)",
    feature7: "Collapsible sidebar with dark mode bottom section",
    feature8: "Admin panel for user and access key management",
    getStarted: "Get Started",
    getStartedDesc:
      "Sign in with your Google account to access the dashboard and other protected features.",
    loggedIn: "You're logged in!",
    loggedInDesc: "Explore the application with your current role:",
    goToDashboard: "Go to Dashboard",
    adminPanel: "Admin Panel",
  },
  ja: {
    title: "RBAC デモアプリへようこそ",
    description:
      "これはNext.js 15、NextAuth.js v5、Prisma、Tailwind CSS 4を使用したロールベースアクセス制御（RBAC）のデモンストレーションです。",
    features: "機能",
    feature1: "Google OAuth認証",
    feature2: "5つのユーザーロール: ゲスト、ユーザー、マネージャー、バックオフィス、管理者",
    feature3: "きめ細かな制御のためのアクセスキーベースの権限システム",
    feature4: "認証とロールに基づいた保護されたルート",
    feature5: "ユーザーロールと権限に基づいた動的ナビゲーションメニュー",
    feature6: "多言語サポート（英語・日本語）",
    feature7: "ダークモード対応の折りたたみ可能なサイドバー",
    feature8: "ユーザーとアクセスキー管理のための管理パネル",
    getStarted: "始めましょう",
    getStartedDesc:
      "Googleアカウントでサインインして、ダッシュボードやその他の保護された機能にアクセスしてください。",
    loggedIn: "ログイン済みです！",
    loggedInDesc: "現在のロールでアプリケーションを探索してください:",
    goToDashboard: "ダッシュボードへ",
    adminPanel: "管理パネル",
  },
} as const;
