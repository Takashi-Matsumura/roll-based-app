"use client";

import { Sidebar } from "./Sidebar";
import { useSidebar } from "./SidebarToggle";
import type { Session } from "next-auth";

interface ClientLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export function ClientLayout({ session, children }: ClientLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <>
      {session && <Sidebar session={session} />}
      <div className={session ? (isOpen ? "md:pl-64" : "md:pl-16") : ""}>
        {children}
      </div>
    </>
  );
}
