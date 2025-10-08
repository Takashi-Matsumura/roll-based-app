"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarToggle";
import { SignInButton } from "./SignInButton";
import { getPageTitle } from "@/lib/i18n/page-titles";

interface HeaderProps {
  session?: {
    user: {
      role: string;
    };
  } | null;
  language?: string;
}

export function Header({ session, language = "en" }: HeaderProps) {
  const pathname = usePathname();
  const { isOpen, width } = useSidebar();
  const pageTitle = getPageTitle(pathname, language as "en" | "ja");

  return (
    <header
      className="bg-gray-800 shadow-lg border-b border-gray-700 fixed top-0 right-0 z-10 transition-all duration-300"
      style={{
        left: session ? (isOpen ? `${width}px` : "4rem") : "0",
      }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {session ? (
            <h1 className="text-xl font-bold text-white">{pageTitle}</h1>
          ) : (
            <Link href="/" className="text-xl font-bold text-white">
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
