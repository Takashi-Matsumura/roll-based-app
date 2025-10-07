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
}

export function UserAccessKeyManager({
  userAccessKeys: initialUserAccessKeys,
  userId,
}: UserAccessKeyManagerProps) {
  const [userAccessKeys, setUserAccessKeys] = useState(initialUserAccessKeys);
  const [isAdding, setIsAdding] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!accessKeyInput.trim()) {
      setError("Please enter an Access key");
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
        setError(data.error || "Failed to register Access key");
        return;
      }

      setUserAccessKeys([data.userAccessKey, ...userAccessKeys]);
      setAccessKeyInput("");
      setIsAdding(false);
      alert("Access key registered successfully!");

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error registering Access key:", error);
      setError("Failed to register Access key");
    }
  };

  const handleRemove = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this Access key? You will lose the associated permissions.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/user/access-keys?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove Access key");

      setUserAccessKeys(userAccessKeys.filter((key) => key.id !== id));

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error removing Access key:", error);
      alert("Failed to remove Access key");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New API Key */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Register API Key</h2>
          <button
            type="button"
            onClick={() => {
              setIsAdding(!isAdding);
              setError("");
              setAccessKeyInput("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isAdding ? "Cancel" : "Add"}
          </button>
        </div>

        {isAdding && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter API Key
              </label>
              <input
                type="text"
                value={accessKeyInput}
                onChange={(e) => setAccessKeyInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-mono"
                placeholder="e.g., XXXX-XXXX-XXXX-XXXX"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Registered Access Keys */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Registered Access Keys</h2>
        </div>

        {userAccessKeys.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No Access keys registered
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
                            Inactive
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded">
                            Expired
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                            Active
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
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Registered:{" "}
                      {new Date(userAccessKey.activatedAt).toLocaleDateString(
                        "en-US",
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Expires:{" "}
                      {new Date(userAccessKey.accessKey.expiresAt).toLocaleDateString(
                        "en-US",
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Granted Permissions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userAccessKey.accessKey.permissions.map(({ permission }) => (
                          <span
                            key={permission.id}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {permission.displayName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Demo Keys Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Demo Access Keys</h3>
        <p className="text-sm text-blue-800 mb-2">
          You can test with the following demo Access keys:
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="font-mono">
            • DEMO-KEY-REPORTS-2025 (Reports access only)
          </li>
          <li className="font-mono">
            • DEMO-KEY-FULL-ACCESS-2025 (All permissions)
          </li>
        </ul>
      </div>
    </div>
  );
}
