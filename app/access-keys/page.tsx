import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserAccessKeyManager } from "@/components/UserAccessKeyManager";
import { prisma } from "@/lib/prisma";

export default async function UserAccessKeysPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Access Keys</h1>
        <p className="text-gray-600 mt-2">
          Register Access keys provided by administrators to access additional
          features
        </p>
      </div>

      <UserAccessKeyManager
        userAccessKeys={userAccessKeys}
        userId={session.user.id}
      />
    </div>
  );
}
