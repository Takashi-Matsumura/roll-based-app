import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserApiKeyManager } from "@/components/UserApiKeyManager";
import { prisma } from "@/lib/prisma";

export default async function UserApiKeysPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch user's registered API keys with permissions
  const userApiKeys = await prisma.userApiKey.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      apiKey: {
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
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-600 mt-2">
          Register API keys provided by administrators to access additional
          features
        </p>
      </div>

      <UserApiKeyManager userApiKeys={userApiKeys} userId={session.user.id} />
    </div>
  );
}
