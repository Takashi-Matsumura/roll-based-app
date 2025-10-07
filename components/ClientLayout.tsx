"use client";

import type { Session } from "next-auth";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "./SidebarToggle";

interface ClientLayoutProps {
  session: Session | null;
  userPermissions?: string[];
  children: React.ReactNode;
}

export function ClientLayout({
  session,
  userPermissions = [],
  children,
}: ClientLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <>
      {session && (
        <Sidebar session={session} userPermissions={userPermissions} />
      )}
      <div className={session ? (isOpen ? "md:pl-64" : "md:pl-16") : ""}>
        {children}
      </div>
    </>
  );
}
