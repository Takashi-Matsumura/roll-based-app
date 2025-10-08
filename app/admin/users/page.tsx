import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRoleChanger } from "@/components/UserRoleChanger";
import { prisma } from "@/lib/prisma";
import { getLanguage } from "@/lib/i18n/get-language";
import { adminUsersTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = adminUsersTranslations[language];

  return {
    title: t.title,
  };
}

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const language = await getLanguage();
  const t = adminUsersTranslations[language];

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>{t.warning}</strong> {t.warningMessage}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  {t.user}
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  {t.email}
                </th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                  {t.role}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {user.image && (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <UserRoleChanger
                      userId={user.id}
                      currentRole={user.role}
                      isCurrentUser={user.id === session.user.id}
                      language={language}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">{t.noUsersFound}</p>
          </div>
        )}
      </div>
    </div>
  );
}
