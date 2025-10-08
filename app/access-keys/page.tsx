import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAccessKeyManager } from "@/components/UserAccessKeyManager";
import { prisma } from "@/lib/prisma";
import { getLanguage } from "@/lib/i18n/get-language";
import { accessKeysTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = accessKeysTranslations[language];

  return {
    title: t.title,
  };
}

export default async function UserAccessKeysPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const language = await getLanguage();
  const t = accessKeysTranslations[language];

  // Fetch user's registered Access keys with permissions
  const userAccessKeys = await prisma.userAccessKey.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      accessKey: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">{t.description}</p>
      </div>

      <UserAccessKeyManager
        userAccessKeys={userAccessKeys}
        userId={session.user.id}
        language={language}
      />
    </div>
  );
}
