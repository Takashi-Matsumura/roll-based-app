"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarToggle";
import { SignOutButton } from "./SignOutButton";
import { RoleBadge } from "./RoleBadge";
import type { Session } from "next-auth";

interface SidebarProps {
  session: Session;
}

export function Sidebar({ session }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-16"} bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header with Toggle Button and App Name */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {isOpen && (
            <Link href="/" className="text-xl font-bold text-gray-800">
              RBAC Demo
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isOpen ? "px-4" : "px-2 justify-center"}`}
            title={!isOpen ? "Dashboard" : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/profile"
            className={`flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isOpen ? "px-4" : "px-2 justify-center"}`}
            title={!isOpen ? "Profile" : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {isOpen && <span>Profile</span>}
          </Link>

          <Link
            href="/settings"
            className={`flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isOpen ? "px-4" : "px-2 justify-center"}`}
            title={!isOpen ? "Settings" : undefined}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isOpen && <span>Settings</span>}
          </Link>

          {session.user.role === "ADMIN" && (
            <>
              {isOpen && (
                <div className="pt-4 mt-4 border-t">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Admin
                  </div>
                </div>
              )}
              {!isOpen && <div className="pt-4 mt-4 border-t" />}

              <Link
                href="/admin"
                className={`flex items-center gap-3 py-3 text-purple-700 hover:bg-purple-50 rounded-lg transition ${isOpen ? "px-4" : "px-2 justify-center"}`}
                title={!isOpen ? "Admin Panel" : undefined}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {isOpen && <span>Admin Panel</span>}
              </Link>

              <Link
                href="/admin/users"
                className={`flex items-center gap-3 py-3 text-purple-700 hover:bg-purple-50 rounded-lg transition ${isOpen ? "px-4" : "px-2 justify-center"}`}
                title={!isOpen ? "User Management" : undefined}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {isOpen && <span>User Management</span>}
              </Link>
            </>
          )}
        </nav>

        {/* User Info and Sign Out Button at Bottom */}
        <div className="mt-auto pt-6 border-t">
          {/* User Info */}
          {isOpen && (
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {session.user.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <RoleBadge role={session.user.role} />
            </div>
          )}

          {/* User Avatar Only (when collapsed) */}
          {!isOpen && session.user.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            </div>
          )}

          {/* Sign Out Button */}
          <SignOutButton collapsed={!isOpen} />
        </div>
      </div>
    </aside>
  );
}
