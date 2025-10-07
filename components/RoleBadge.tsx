import type { Role } from "@prisma/client";

interface RoleBadgeProps {
  role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const colors = {
    GUEST: "bg-gray-100 text-gray-800",
    USER: "bg-blue-100 text-blue-800",
    MANAGER: "bg-cyan-100 text-cyan-800",
    BACKOFFICE: "bg-orange-100 text-orange-800",
    ADMIN: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role]}`}
    >
      {role}
    </span>
  );
}
