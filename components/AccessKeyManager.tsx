"use client";

import type { AccessKey, AccessKeyPermission, Permission } from "@prisma/client";
import { useState } from "react";

type AccessKeyWithPermissions = AccessKey & {
  permissions: (AccessKeyPermission & {
    permission: Permission;
  })[];
  _count: {
    userAccessKeys: number;
  };
};

interface AccessKeyManagerProps {
  accessKeys: AccessKeyWithPermissions[];
  permissions: Permission[];
  adminId: string;
}

export function AccessKeyManager({
  accessKeys: initialAccessKeys,
  permissions,
  adminId,
}: AccessKeyManagerProps) {
  const [accessKeys, setAccessKeys] = useState(initialAccessKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    expiresInDays: 365,
    permissionIds: [] as string[],
  });

  const handleCreate = async () => {
    if (!formData.name || formData.permissionIds.length === 0) {
      alert("Please enter a name and select at least one permission");
      return;
    }

    try {
      const response = await fetch("/api/admin/access-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create Access key");

      const { accessKey } = await response.json();
      setAccessKeys([accessKey, ...accessKeys]);
      setFormData({ name: "", expiresInDays: 365, permissionIds: [] });
      setIsCreating(false);
      alert(
        `Access key created successfully:\n\n${accessKey.key}\n\nPlease copy and save this key.`,
      );
    } catch (error) {
      console.error("Error creating Access key:", error);
      alert("Failed to create Access key");
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
          key.id === id ? { ...key, isActive: !currentStatus } : key,
        ),
      );
    } catch (error) {
      console.error("Error updating Access key:", error);
      alert("Failed to update Access key");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Access key?")) return;

    try {
      const response = await fetch(`/api/admin/access-keys?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete Access key");

      setAccessKeys(accessKeys.filter((key) => key.id !== id));
    } catch (error) {
      console.error("Error deleting Access key:", error);
      alert("Failed to delete Access key");
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Create New API Key */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New API Key</h2>
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isCreating ? "Cancel" : "Create"}
          </button>
        </div>

        {isCreating && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Report Access Key 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration (days)
              </label>
              <input
                type="number"
                value={formData.expiresInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiresInDays: Number.parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Permissions
              </label>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissionIds.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">
                        {permission.displayName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {permission.description}
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
              Generate API Key
            </button>
          </div>
        )}
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Issued API Keys</h2>
        </div>

        <div className="divide-y">
          {accessKeys.map((accessKey) => (
            <div key={accessKey.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{accessKey.name}</h3>
                    {accessKey.isActive ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {accessKey.key}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(accessKey.id, accessKey.isActive)
                    }
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    {accessKey.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(accessKey.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Expires:{" "}
                  {new Date(accessKey.expiresAt).toLocaleDateString("en-US")}
                </div>
                <div className="text-sm text-gray-600">
                  Users: {accessKey._count.userAccessKeys}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Permissions:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {accessKey.permissions.map(({ permission }) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
