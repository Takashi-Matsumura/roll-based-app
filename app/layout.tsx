import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { ClientLayout } from "@/components/ClientLayout";
import { Header } from "@/components/Header";
import { getUserPermissions } from "@/lib/permissions";
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

  if (session) {
    // 1回のクエリで全情報を取得（パフォーマンス最適化）
    const [permissions, user] = await Promise.all([
      getUserPermissions(session.user.id),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { language: true },
      }),
    ]);

    userPermissions = permissions;
    language = user?.language || "en";

    // Module Registryから有効なモジュールを取得
    const allModules = getEnabledModules();

    // ユーザーがアクセス可能なモジュールをフィルタリング
    accessibleModules = getAccessibleModules(
      allModules,
      session.user.role,
      userPermissions,
    );

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
          <Header session={session} />
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
