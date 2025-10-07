"use client";

import type { Session } from "next-auth";
import { DynamicSidebar } from "./DynamicSidebar";
import { useSidebar } from "./SidebarToggle";
import type { AppModule } from "@/types/module";

interface ClientLayoutProps {
  session: Session | null;
  userPermissions?: string[];
  language?: string;
  accessibleModules?: AppModule[];
  groupedModules?: Record<string, AppModule[]>;
  menuGroups?: Array<{
    id: string;
    name: string;
    nameJa: string;
    color?: string;
  }>;
  children: React.ReactNode;
}

export function ClientLayout({
  session,
  userPermissions = [],
  language = "en",
  accessibleModules = [],
  groupedModules = {},
  menuGroups = [],
  children,
}: ClientLayoutProps) {
  const { isOpen, width } = useSidebar();

  return (
    <>
      {session && (
        <DynamicSidebar
          session={session}
          accessibleModules={accessibleModules}
          groupedModules={groupedModules}
          menuGroups={menuGroups}
          language={language}
        />
      )}
      <div
        style={{
          paddingLeft: session ? (isOpen ? `${width}px` : "4rem") : "0",
        }}
        className="transition-all duration-300"
      >
        {children}
      </div>
    </>
  );
}
