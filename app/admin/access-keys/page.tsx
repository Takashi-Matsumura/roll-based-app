import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccessKeyManager } from "@/components/AccessKeyManager";
import { prisma } from "@/lib/prisma";

export default async function AccessKeysPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

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
        <h1 className="text-3xl font-bold text-gray-900">
          Access Key Management
        </h1>
        <p className="text-gray-600 mt-2">
          Issue and manage Access keys with specific permissions
        </p>
      </div>

      <AccessKeyManager
        accessKeys={accessKeys}
        permissions={permissions}
        adminId={session.user.id}
      />
    </div>
  );
}
