"use client";

import type {
  ApiKey,
  ApiKeyPermission,
  Permission,
  UserApiKey,
} from "@prisma/client";
import { useState } from "react";

type UserApiKeyWithDetails = UserApiKey & {
  apiKey: ApiKey & {
    permissions: (ApiKeyPermission & {
      permission: Permission;
    })[];
  };
};

interface UserApiKeyManagerProps {
  userApiKeys: UserApiKeyWithDetails[];
  userId: string;
}

export function UserApiKeyManager({
  userApiKeys: initialUserApiKeys,
  userId,
}: UserApiKeyManagerProps) {
  const [userApiKeys, setUserApiKeys] = useState(initialUserApiKeys);
  const [isAdding, setIsAdding] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!apiKeyInput.trim()) {
      setError("Please enter an API key");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register API key");
        return;
      }

      setUserApiKeys([data.userApiKey, ...userApiKeys]);
      setApiKeyInput("");
      setIsAdding(false);
      alert("API key registered successfully!");

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error registering API key:", error);
      setError("Failed to register API key");
    }
  };

  const handleRemove = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this API key? You will lose the associated permissions.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/user/api-keys?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove API key");

      setUserApiKeys(userApiKeys.filter((key) => key.id !== id));

      // Reload to update permissions
      window.location.reload();
    } catch (error) {
      console.error("Error removing API key:", error);
      alert("Failed to remove API key");
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
              setApiKeyInput("");
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
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
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

      {/* Registered API Keys */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Registered API Keys</h2>
        </div>

        {userApiKeys.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No API keys registered
          </div>
        ) : (
          <div className="divide-y">
            {userApiKeys.map((userApiKey) => {
              const isExpired =
                new Date(userApiKey.apiKey.expiresAt) < new Date();

              return (
                <div key={userApiKey.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {userApiKey.apiKey.name}
                        </h3>
                        {!userApiKey.apiKey.isActive ? (
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
                        {userApiKey.apiKey.key}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(userApiKey.id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Registered:{" "}
                      {new Date(userApiKey.activatedAt).toLocaleDateString(
                        "en-US",
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Expires:{" "}
                      {new Date(userApiKey.apiKey.expiresAt).toLocaleDateString(
                        "en-US",
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Granted Permissions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userApiKey.apiKey.permissions.map(({ permission }) => (
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
        <h3 className="font-semibold text-blue-900 mb-2">Demo API Keys</h3>
        <p className="text-sm text-blue-800 mb-2">
          You can test with the following demo API keys:
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
