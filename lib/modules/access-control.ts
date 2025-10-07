import type { Role } from "@prisma/client";
import type { AppModule } from "@/types/module";

/**
 * ユーザーがモジュールにアクセスできるかチェック
 */
export function canAccessModule(
  module: AppModule,
  userRole: Role,
  userPermissions: string[],
): boolean {
  // モジュールが無効な場合はアクセス不可
  if (!module.enabled) {
    return false;
  }

  // ロールベースのチェック
  if (module.requiredRoles && module.requiredRoles.length > 0) {
    if (!module.requiredRoles.includes(userRole)) {
      return false;
    }
  }

  // 権限ベースのチェック
  if (module.requiredPermissions && module.requiredPermissions.length > 0) {
    const hasPermission = module.requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
    if (!hasPermission) {
      return false;
    }
  }

  return true;
}

/**
 * ユーザーがアクセス可能なモジュールのリストを取得
 */
export function getAccessibleModules(
  allModules: AppModule[],
  userRole: Role,
  userPermissions: string[],
): AppModule[] {
  return allModules
    .filter((module) => canAccessModule(module, userRole, userPermissions))
    .sort((a, b) => a.order - b.order);
}

/**
 * メニューグループごとにモジュールをグループ化
 */
export function groupModulesByMenuGroup(
  modules: AppModule[],
): Record<string, AppModule[]> {
  const grouped: Record<string, AppModule[]> = {};

  for (const module of modules) {
    if (!grouped[module.menuGroup]) {
      grouped[module.menuGroup] = [];
    }
    grouped[module.menuGroup].push(module);
  }

  return grouped;
}
