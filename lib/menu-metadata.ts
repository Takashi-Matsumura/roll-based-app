// Menu group type - now flexible to support any string
export type MenuGroup = string;

// Menu group configuration interface
export interface MenuGroupConfig {
  id: string;
  label: {
    en: string;
    ja: string;
  };
  color?: string; // Tailwind color class (e.g., "text-blue-700")
  order: number; // Display order in sidebar
  visibleTo?: "all" | string[]; // "all" or array of roles
}

// Module metadata interface
export interface ModuleMetadata {
  menuGroup: MenuGroup;
  requiresRole?: string[]; // Optional: specific roles required to access
  requiresPermission?: string[]; // Optional: specific permissions required
}

// Menu group configurations
export const menuGroupConfigs: Record<string, MenuGroupConfig> = {
  USER: {
    id: "USER",
    label: { en: "USER", ja: "ユーザー" },
    order: 1,
    visibleTo: "all",
  },
  MANAGER: {
    id: "MANAGER",
    label: { en: "MANAGER", ja: "マネージャー" },
    color: "text-blue-700",
    order: 2,
    visibleTo: ["MANAGER", "ADMIN"],
  },
  BACKOFFICE: {
    id: "BACKOFFICE",
    label: { en: "BACKOFFICE", ja: "バックオフィス" },
    color: "text-orange-700",
    order: 3,
    visibleTo: "all",
  },
  ADMIN: {
    id: "ADMIN",
    label: { en: "ADMIN", ja: "管理者" },
    color: "text-purple-700",
    order: 4,
    visibleTo: ["ADMIN"],
  },
};

// Module metadata registry
export const moduleMetadata: Record<string, ModuleMetadata> = {
  "/dashboard": {
    menuGroup: "USER",
  },
  "/profile": {
    menuGroup: "USER",
  },
  "/access-keys": {
    menuGroup: "USER",
  },
  "/manager/bi": {
    menuGroup: "MANAGER",
    requiresRole: ["MANAGER", "ADMIN"],
  },
  "/manager/hr-evaluation": {
    menuGroup: "MANAGER",
    requiresRole: ["MANAGER", "ADMIN"],
  },
  "/backoffice/business-trip": {
    menuGroup: "BACKOFFICE",
  },
  "/backoffice/expense-claim": {
    menuGroup: "BACKOFFICE",
  },
  "/admin": {
    menuGroup: "ADMIN",
    requiresRole: ["ADMIN"],
  },
  "/admin/users": {
    menuGroup: "ADMIN",
    requiresRole: ["ADMIN"],
  },
  "/admin/access-keys": {
    menuGroup: "ADMIN",
    requiresRole: ["ADMIN"],
  },
  "/reports": {
    menuGroup: "BACKOFFICE",
    requiresPermission: ["reports"],
  },
  "/analytics": {
    menuGroup: "BACKOFFICE",
    requiresPermission: ["analytics"],
  },
  "/settings": {
    menuGroup: "USER",
  },
};

// Helper function to get module metadata
export function getModuleMetadata(path: string): ModuleMetadata | undefined {
  return moduleMetadata[path];
}

// Helper function to get menu group config
export function getMenuGroupConfig(
  groupId: string
): MenuGroupConfig | undefined {
  return menuGroupConfigs[groupId];
}

// Helper function to check if menu group is visible to user
export function isMenuGroupVisible(
  groupId: string,
  userRole: string
): boolean {
  const config = getMenuGroupConfig(groupId);
  if (!config) {
    // Unknown menu groups are visible by default
    return true;
  }

  if (config.visibleTo === "all") {
    return true;
  }

  if (Array.isArray(config.visibleTo)) {
    return config.visibleTo.includes(userRole);
  }

  return false;
}

// Helper function to check if user has access to a module
export function hasModuleAccess(
  path: string,
  userRole: string,
  userPermissions: string[] = []
): boolean {
  const metadata = getModuleMetadata(path);
  if (!metadata) return false;

  // Check role requirements
  if (metadata.requiresRole && !metadata.requiresRole.includes(userRole)) {
    return false;
  }

  // Check permission requirements
  if (
    metadata.requiresPermission &&
    !metadata.requiresPermission.some((p) => userPermissions.includes(p))
  ) {
    return false;
  }

  return true;
}

// Helper function to get all menu groups sorted by order
export function getSortedMenuGroups(): MenuGroupConfig[] {
  return Object.values(menuGroupConfigs).sort((a, b) => a.order - b.order);
}
