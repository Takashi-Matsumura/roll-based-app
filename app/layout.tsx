import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { ClientLayout } from "@/components/ClientLayout";
import { Header } from "@/components/Header";
import { getUserPermissions } from "@/lib/permissions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBAC Demo App",
  description: "Role-based access control demo with Next.js and NextAuth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Get user permissions if logged in
  let userPermissions: string[] = [];
  if (session) {
    userPermissions = await getUserPermissions(session.user.id);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ClientLayout session={session} userPermissions={userPermissions}>
          <Header session={session} />
          <main
            className={`container mx-auto px-4 py-8 ${session ? "pt-24" : "pt-20"}`}
          >
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
