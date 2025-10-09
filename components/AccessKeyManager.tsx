"use client";

import type { AccessKey, User } from "@prisma/client";
import type { AppModule } from "@/types/module";
import { useState } from "react";

type AccessKeyWithTargetUser = AccessKey & {
  targetUser: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  _count: {
    userAccessKeys: number;
  };
};

interface AccessKeyManagerProps {
  accessKeys: AccessKeyWithTargetUser[];
  users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  }>;
  modules: AppModule[];
  adminId: string;
  language?: string;
}

export function AccessKeyManager({
  accessKeys: initialAccessKeys,
  users,
  modules,
  adminId,
  language = "en",
}: AccessKeyManagerProps) {
  const [accessKeys, setAccessKeys] = useState(initialAccessKeys);
  const [isCreating, setIsCreating] = useState(false);

  // デフォルトは1年後
  const getDefaultExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    name: "",
    expiresAt: getDefaultExpiryDate(),
    targetUserId: "",
    menuPaths: [] as string[],
  });

  const t = (en: string, ja: string) => (language === "ja" ? ja : en);

  const handleCreate = async () => {
    if (
      !formData.name ||
      !formData.targetUserId ||
      formData.menuPaths.length === 0
    ) {
      alert(
        t(
          "Please enter a name, select a target user, and select at least one menu",
          "名前、対象ユーザー、および少なくとも1つのメニューを選択してください"
        )
      );
      return;
    }

    try {
      const response = await fetch("/api/admin/access-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create Access key");
      }

      const { accessKey } = await response.json();
      setAccessKeys([accessKey, ...accessKeys]);
      setFormData({
        name: "",
        expiresAt: getDefaultExpiryDate(),
        targetUserId: "",
        menuPaths: [],
      });
      setIsCreating(false);
      alert(
        t(
          `Access key created successfully:\n\n${accessKey.key}\n\nPlease copy and save this key.`,
          `アクセスキーが正常に作成されました:\n\n${accessKey.key}\n\nこのキーをコピーして保存してください。`
        )
      );
    } catch (error) {
      console.error("Error creating Access key:", error);
      alert(
        t(
          `Failed to create Access key: ${error instanceof Error ? error.message : "Unknown error"}`,
          `アクセスキーの作成に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`
        )
      );
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/access-keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update Access key");

      setAccessKeys(
        accessKeys.map((key) =>
          key.id === id ? { ...key, isActive: !currentStatus } : key
        )
      );
    } catch (error) {
      console.error("Error updating Access key:", error);
      alert(t("Failed to update Access key", "アクセスキーの更新に失敗しました"));
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        t(
          "Are you sure you want to delete this Access key?",
          "このアクセスキーを削除してもよろしいですか？"
        )
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/access-keys?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete Access key");

      setAccessKeys(accessKeys.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deleting Access key:", error);
      alert(t("Failed to delete Access key", "アクセスキーの削除に失敗しました"));
    }
  };

  const toggleMenu = (menuPath: string) => {
    setFormData((prev) => ({
      ...prev,
      menuPaths: prev.menuPaths.includes(menuPath)
        ? prev.menuPaths.filter((path) => path !== menuPath)
        : [...prev.menuPaths, menuPath],
    }));
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      alert(t("Access key copied to clipboard", "アクセスキーをクリップボードにコピーしました"));
    } catch (error) {
      console.error("Failed to copy:", error);
      alert(t("Failed to copy access key", "アクセスキーのコピーに失敗しました"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Access Key */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {t("Create New Access Key", "新しいアクセスキーを作成")}
          </h2>
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isCreating ? t("Cancel", "キャンセル") : t("Create", "作成")}
          </button>
        </div>

        {isCreating && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Key Name", "キー名")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder={t(
                  "e.g., Manager Access for John",
                  "例: John用マネージャーアクセス"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Target User", "対象ユーザー")}
              </label>
              <select
                value={formData.targetUserId}
                onChange={(e) =>
                  setFormData({ ...formData, targetUserId: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">
                  {t("-- Select a user --", "-- ユーザーを選択 --")}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Expiration Date", "有効期限")}
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiresAt: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Select Menus to Grant Access", "アクセスを許可するメニューを選択")}
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                {modules.map((module) => (
                  <label
                    key={module.id}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.menuPaths.includes(module.path)}
                      onChange={() => toggleMenu(module.path)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {language === "ja" ? module.nameJa : module.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {module.path}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {t("Generate Access Key", "アクセスキーを生成")}
            </button>
          </div>
        )}
      </div>

      {/* Access Keys List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {t("Issued Access Keys", "発行済みアクセスキー")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("Access Key Information", "アクセスキー情報")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("Status", "ステータス")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("Menus", "メニュー")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("Expires", "有効期限")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("Actions", "操作")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessKeys.map((accessKey) => {
                const menuPaths = JSON.parse(accessKey.menuPaths) as string[];
                return (
                  <tr key={accessKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {/* Name */}
                        <div className="font-semibold text-gray-900">
                          {accessKey.name}
                        </div>

                        {/* Target User */}
                        {accessKey.targetUser ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">{accessKey.targetUser.name}</span>
                            <span className="text-gray-400">({accessKey.targetUser.email})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{t("No target user", "対象ユーザーなし")}</span>
                          </div>
                        )}

                        {/* Access Key */}
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                          <code className="flex-1 font-mono text-xs text-gray-600 truncate">
                            {accessKey.key}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyKey(accessKey.key)}
                            className="flex-shrink-0 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title={t("Copy to clipboard", "クリップボードにコピー")}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {accessKey.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                          {t("Active", "有効")}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded">
                          {t("Inactive", "無効")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {menuPaths.map((path) => {
                          const module = modules.find((m) => m.path === path);
                          return (
                            <div
                              key={path}
                              className="text-sm text-gray-700"
                              title={path}
                            >
                              • {module
                                ? language === "ja"
                                  ? module.nameJa
                                  : module.name
                                : path}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(accessKey.expiresAt).toLocaleDateString(
                        language === "ja" ? "ja-JP" : "en-US"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(accessKey.id, accessKey.isActive)
                          }
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                        >
                          {accessKey.isActive
                            ? t("Deactivate", "無効化")
                            : t("Activate", "有効化")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(accessKey.id)}
                          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                        >
                          {t("Delete", "削除")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {accessKeys.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t("No access keys have been issued yet", "まだアクセスキーは発行されていません")}
          </div>
        )}
      </div>
    </div>
  );
}
