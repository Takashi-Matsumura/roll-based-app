import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { prisma } from "@/lib/prisma";

export default async function ApiKeysPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all API keys with their permissions
  const apiKeys = await prisma.apiKey.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: {
          userApiKeys: true,
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
        <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
        <p className="text-gray-600 mt-2">
          Issue and manage API keys with specific permissions
        </p>
      </div>

      <ApiKeyManager
        apiKeys={apiKeys}
        permissions={permissions}
        adminId={session.user.id}
      />
    </div>
  );
}
