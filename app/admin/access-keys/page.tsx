import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccessKeyManager } from "@/components/AccessKeyManager";
import { prisma } from "@/lib/prisma";
import { getLanguage } from "@/lib/i18n/get-language";
import { adminAccessKeysTranslations } from "./translations";
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

  // Fetch all Access keys with their permissions
  const accessKeys = await prisma.accessKey.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
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

  // Fetch all available permissions
  const permissions = await prisma.permission.findMany({
    orderBy: {
      displayName: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">{t.description}</p>
      </div>

      <AccessKeyManager
        accessKeys={accessKeys}
        permissions={permissions}
        adminId={session.user.id}
      />
    </div>
  );
}
