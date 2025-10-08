import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccessKeyManager } from "@/components/AccessKeyManager";
import { prisma } from "@/lib/prisma";
import { getLanguage } from "@/lib/i18n/get-language";
import { adminAccessKeysTranslations } from "./translations";
import { getEnabledModules } from "@/lib/modules/registry";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = adminAccessKeysTranslations[language];

  return {
    title: t.title,
  };
}

export default async function AccessKeysPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const language = await getLanguage();
  const t = adminAccessKeysTranslations[language];

  // Fetch all Access keys with target user info
  const accessKeys = await prisma.accessKey.findMany({
    include: {
      targetUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          userAccessKeys: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all users (excluding current admin for selection)
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: session.user.id, // Exclude self
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Get all available modules except ADMIN menu group
  const allModules = getEnabledModules();
  const modules = allModules.filter((module) => module.menuGroup !== "ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">{t.description}</p>
      </div>

      <AccessKeyManager
        accessKeys={accessKeys}
        users={users}
        modules={modules}
        adminId={session.user.id}
        language={language}
      />
    </div>
  );
}
