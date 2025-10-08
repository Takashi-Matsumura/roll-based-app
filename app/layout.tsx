import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { ClientLayout } from "@/components/ClientLayout";
import { Header } from "@/components/Header";
import { getUserPermissions } from "@/lib/permissions";
import { getUserAccessibleMenus } from "@/lib/access-keys";
import { prisma } from "@/lib/prisma";
import { getEnabledModules, menuGroups } from "@/lib/modules/registry";
import {
  getAccessibleModules,
  groupModulesByMenuGroup,
} from "@/lib/modules/access-control";
import type { AppModule, MenuGroup } from "@/types/module";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBAC Demo App",
  description: "Role-based access control demo with Next.js and NextAuth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Get user permissions and language if logged in
  let userPermissions: string[] = [];
  let language = "en";
  let accessibleModules: AppModule[] = [];
  let groupedModules: Record<string, AppModule[]> = {};
  let sortedMenuGroups: MenuGroup[] = [];

  let accessKeyMenus: string[] = [];

  if (session) {
    // 1回のクエリで全情報を取得（パフォーマンス最適化）
    const [permissions, user, accessKeyMenuPaths] = await Promise.all([
      getUserPermissions(session.user.id),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { language: true },
      }),
      getUserAccessibleMenus(session.user.id),
    ]);

    userPermissions = permissions;
    language = user?.language || "en";
    accessKeyMenus = accessKeyMenuPaths;

    // Module Registryから有効なモジュールを取得
    const allModules = getEnabledModules();

    // ユーザーがアクセス可能なモジュールをフィルタリング
    accessibleModules = getAccessibleModules(
      allModules,
      session.user.role,
      userPermissions,
    );

    // Access Keyで許可されたメニューを追加
    const accessKeyModules = allModules.filter((module) =>
      accessKeyMenus.includes(module.path)
    );

    // 重複を除いてマージ
    const modulePathSet = new Set(accessibleModules.map(m => m.path));
    for (const module of accessKeyModules) {
      if (!modulePathSet.has(module.path)) {
        accessibleModules.push(module);
      }
    }

    // メニューグループごとにモジュールをグループ化
    groupedModules = groupModulesByMenuGroup(accessibleModules);

    // 表示するメニューグループを抽出してソート
    const activeGroupIds = Object.keys(groupedModules);
    sortedMenuGroups = Object.values(menuGroups)
      .filter((group) => activeGroupIds.includes(group.id))
      .sort((a, b) => a.order - b.order);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ClientLayout
          session={session}
          userPermissions={userPermissions}
          language={language}
          accessibleModules={accessibleModules}
          groupedModules={groupedModules}
          menuGroups={sortedMenuGroups}
        >
          <Header session={session} language={language} />
          <main
            className={`container mx-auto px-4 py-8 ${session ? "pt-24" : "pt-20"}`}
          >
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
