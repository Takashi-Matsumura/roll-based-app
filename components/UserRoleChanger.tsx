"use client";

import type { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserRoleChangerProps {
  userId: string;
  currentRole: Role;
  isCurrentUser: boolean;
  language?: string;
}

const getRoleColor = (role: Role) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800";
    case "USER":
      return "bg-blue-100 text-blue-800";
    case "MANAGER":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function UserRoleChanger({
  userId,
  currentRole,
  isCurrentUser,
  language = "en",
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
        alert(language === "ja" ? "ロールの変更に失敗しました" : "Failed to change role");
      }
    } catch (_error) {
      alert(language === "ja" ? "ロールの変更中にエラーが発生しました" : "Error changing role");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCurrentUser) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(role)}`}>
        {role}
      </span>
    );
  }

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value as Role)}
      disabled={isLoading}
      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${getRoleColor(role)}`}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
      <option value="MANAGER">MANAGER</option>
    </select>
  );
}
