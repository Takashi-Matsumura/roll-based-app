"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  collapsed?: boolean;
}

export function SignOutButton({ collapsed = false }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
      className={`flex items-center gap-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition w-full ${collapsed ? "px-2 justify-center" : "px-4 justify-center"}`}
      title={collapsed ? "Sign Out" : undefined}
      aria-label="Sign Out"
    >
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      {!collapsed && <span>Sign Out</span>}
    </button>
  );
}
