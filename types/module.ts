import type { Role } from "@prisma/client";
import type { ReactNode } from "react";

/**
 * アプリケーションモジュールの定義
 * 各機能（小皿）をモジュールとして定義する
 */
export interface AppModule {
  /** モジュールの一意なID */
  id: string;

  /** 表示名（英語） */
  name: string;

  /** 表示名（日本語） */
  nameJa: string;

  /** メニューアイコン */
  icon: ReactNode;

  /** ルートパス */
  path: string;

  /** メニューグループ */
  menuGroup: "user" | "manager" | "backoffice" | "admin" | "permission";

  /** 必要なロール（いずれか一つ） */
  requiredRoles?: Role[];

  /** 必要な権限（APIキーベース） */
  requiredPermissions?: string[];

  /** メニュー表示順序 */
  order: number;

  /** 説明文 */
  description?: string;

  /** このモジュールを有効化するか */
  enabled: boolean;
}

/**
 * メニューグループの定義
 */
export interface MenuGroup {
  id: string;
  name: string;
  nameJa: string;
  color?: string;
  order: number;
}

/**
 * モジュールレジストリの型
 */
export type ModuleRegistry = Record<string, AppModule>;
