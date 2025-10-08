"use client";

import type {
  AccessKey,
  AccessKeyPermission,
  Permission,
  UserAccessKey,
} from "@prisma/client";
import { useState } from "react";

type UserAccessKeyWithDetails = UserAccessKey & {
  accessKey: AccessKey & {
    permissions: (AccessKeyPermission & {
      permission: Permission;
    })[];
  };
};

interface UserAccessKeyManagerProps {
  userAccessKeys: UserAccessKeyWithDetails[];
  userId: string;
  language?: string;
}

export function UserAccessKeyManager({
  userAccessKeys: initialUserAccessKeys,
  userId,
  language = "en",
}: UserAccessKeyManagerProps) {
  const [userAccessKeys, setUserAccessKeys] = useState(initialUserAccessKeys);
  const [isAdding, setIsAdding] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [error, setError] = useState("");

  const t = (en: string, ja: string) => (language === "ja" ? ja : en);

  const handleRegister = async () => {
    if (!accessKeyInput.trim()) {
      setError(t("Please enter an Access key", "アクセスキーを入力してください"));
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/user/access-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey: accessKeyInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("Failed to register Access key", "アクセスキーの登録に失敗しました"));
        return;
      }

      setUserAccessKeys([data.userAccessKey, ...userAccessKeys]);
      setAccessKeyInput("");
      setIsAdding(false);
      alert(t("Access key registered successfully!", "アクセスキーを正常に登録しました！"));

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error registering Access key:", error);
      setError(t("Failed to register Access key", "アクセスキーの登録に失敗しました"));
    }
  };

  const handleRemove = async (id: string) => {
    if (
      !confirm(
        t(
          "Are you sure you want to remove this Access key? You will lose the associated permissions.",
          "このアクセスキーを削除してもよろしいですか？関連する権限も失われます。"
        )
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/user/access-keys?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(t("Failed to remove Access key", "アクセスキーの削除に失敗しました"));

      setUserAccessKeys(userAccessKeys.filter((key) => key.id !== id));

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error removing Access key:", error);
      alert(t("Failed to remove Access key", "アクセスキーの削除に失敗しました"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New API Key */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t("Register API Key", "APIキーを登録")}</h2>
          <button
            type="button"
            onClick={() => {
              setIsAdding(!isAdding);
              setError("");
              setAccessKeyInput("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isAdding ? t("Cancel", "キャンセル") : t("Add", "追加")}
          </button>
        </div>

        {isAdding && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Enter API Key", "APIキーを入力")}
              </label>
              <input
                type="text"
                value={accessKeyInput}
                onChange={(e) => setAccessKeyInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-mono"
                placeholder={t("e.g., XXXX-XXXX-XXXX-XXXX", "例: XXXX-XXXX-XXXX-XXXX")}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {t("Register", "登録")}
            </button>
          </div>
        )}
      </div>

      {/* Registered Access Keys */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{t("Registered Access Keys", "登録済みアクセスキー")}</h2>
        </div>

        {userAccessKeys.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {t("No Access keys registered", "登録されているアクセスキーはありません")}
          </div>
        ) : (
          <div className="divide-y">
            {userAccessKeys.map((userAccessKey) => {
              const isExpired =
                new Date(userAccessKey.accessKey.expiresAt) < new Date();

              return (
                <div key={userAccessKey.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {userAccessKey.accessKey.name}
                        </h3>
                        {!userAccessKey.accessKey.isActive ? (
                          <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded">
                            {t("Inactive", "無効")}
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded">
                            {t("Expired", "期限切れ")}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                            {t("Active", "有効")}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">
                        {userAccessKey.accessKey.key}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(userAccessKey.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      {t("Remove", "削除")}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {t("Registered", "登録日")}:{" "}
                      {new Date(userAccessKey.activatedAt).toLocaleDateString(
                        language === "ja" ? "ja-JP" : "en-US",
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("Expires", "有効期限")}:{" "}
                      {new Date(
                        userAccessKey.accessKey.expiresAt,
                      ).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {t("Granted Permissions", "付与された権限")}:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userAccessKey.accessKey.permissions.map(
                          ({ permission }) => (
                            <span
                              key={permission.id}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {permission.displayName}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
