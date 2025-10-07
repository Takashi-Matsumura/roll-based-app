"use client";

import type { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserRoleChangerProps {
  userId: string;
  currentRole: Role;
  isCurrentUser: boolean;
}

export function UserRoleChanger({
  userId,
  currentRole,
  isCurrentUser,
}: UserRoleChangerProps) {
  const [role, setRole] = useState<Role>(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: Role) => {
    if (newRole === role) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setRole(newRole);
        router.refresh();
      } else {
        alert("Failed to change role");
      }
    } catch (_error) {
      alert("Error changing role");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCurrentUser) {
    return (
      <span className="text-xs text-gray-500 italic">
        (You cannot change your own role)
      </span>
    );
  }

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value as Role)}
      disabled={isLoading}
      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
