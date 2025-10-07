"use client";

import { useRef, useEffect } from "react";
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
  const { isOpen, width, setWidth } = useSidebar();
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      // Update width based on mouse position
      const newWidth = e.clientX;
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <>
      {session && (
        <>
          <DynamicSidebar
            session={session}
            accessibleModules={accessibleModules}
            groupedModules={groupedModules}
            menuGroups={menuGroups}
            language={language}
          />
          {/* Resize Handle with drag functionality */}
          {isOpen && (
            <div
              className="fixed top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors bg-gray-300 z-50"
              style={{ left: `${width - 4}px` }}
              title="Drag to resize"
              onMouseDown={handleMouseDown}
            />
          )}
        </>
      )}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: session ? (isOpen ? `${width}px` : "4rem") : "0",
        }}
      >
        {children}
      </div>
    </>
  );
}
