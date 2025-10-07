"use client";

import Link from "next/link";
import { SignInButton } from "./SignInButton";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarToggle";

interface HeaderProps {
  session?: {
    user: {
      role: string;
    };
  } | null;
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/login": "Login",
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin Panel",
  "/admin/users": "User Management",
};

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const pageTitle = PAGE_TITLES[pathname] || "RBAC Demo";

  return (
    <header
      className={`bg-white shadow-sm border-b fixed top-0 right-0 left-0 ${session ? (isOpen ? "md:left-64" : "md:left-16") : ""} z-10 transition-all duration-300`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {session ? (
            <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
          ) : (
            <Link href="/" className="text-xl font-bold text-gray-800">
              RBAC Demo
            </Link>
          )}

          {!session && (
            <div className="flex items-center gap-4">
              <SignInButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
