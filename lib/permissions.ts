import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Check if a user has a specific permission through registered API keys
 */
export async function hasPermission(
  userId: string,
  permissionName: string,
): Promise<boolean> {
  const userApiKeys = await prisma.userApiKey.findMany({
    where: {
      userId,
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

  // Check if any of the user's registered API keys grant the permission
  for (const userApiKey of userApiKeys) {
    const { apiKey } = userApiKey;

    // Skip if API key is not active
    if (!apiKey.isActive) continue;

    // Skip if API key has expired
    if (new Date(apiKey.expiresAt) < new Date()) continue;

    // Check if this API key has the required permission
    const hasRequiredPermission = apiKey.permissions.some(
      (apiKeyPermission) => apiKeyPermission.permission.name === permissionName,
    );

    if (hasRequiredPermission) {
      return true;
    }
  }

  return false;
}

/**
 * Get all permissions a user has through registered API keys
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const userApiKeys = await prisma.userApiKey.findMany({
    where: {
      userId,
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

  const permissionSet = new Set<string>();

  for (const userApiKey of userApiKeys) {
    const { apiKey } = userApiKey;

    // Skip if API key is not active or expired
    if (!apiKey.isActive || new Date(apiKey.expiresAt) < new Date()) {
      continue;
    }

    // Add all permissions from this API key
    for (const apiKeyPermission of apiKey.permissions) {
      permissionSet.add(apiKeyPermission.permission.name);
    }
  }

  return Array.from(permissionSet);
}

/**
 * Get all permissions details for a user
 */
export async function getUserPermissionDetails(userId: string) {
  const permissions = await prisma.permission.findMany({
    orderBy: {
      displayName: "asc",
    },
  });

  const userPermissions = await getUserPermissions(userId);

  return permissions.map((permission) => ({
    ...permission,
    hasAccess: userPermissions.includes(permission.name),
  }));
}
